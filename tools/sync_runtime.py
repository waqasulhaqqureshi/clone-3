#!/usr/bin/env python3
"""Pull the runtime-only modules the pages load through importmaps and iframes.

The static mirror already contains every file the HTML links to. What it cannot
contain is the graph a browser builds afterwards:

  * bare module specifiers resolved by an <script type="importmap">
    ("three", "three/addons/", "lenis")
  * paths that only exist as string literals inside JavaScript
    ("sword-shrine-assets/models/soldier.glb")

This walks that graph from the local entry points, follows every import and
asset literal, and downloads whatever is still missing from the live origin.

Usage: python3 tools/sync_runtime.py [--dry-run]
"""

from __future__ import annotations

import json
import os
import posixpath
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://therishithakor.com/"

ASSET_EXTS = (
    "webp", "png", "jpg", "jpeg", "avif", "gif", "svg", "ico",
    "glb", "gltf", "bin", "hdr", "exr", "ktx2",
    "json", "mp3", "ogg", "wav",
    "woff", "woff2", "ttf", "otf",
    "txt", "pdf", "mp4", "webm",
)

ASSET_RE = re.compile(r"""['"]([^'"\n\s$]+?\.(?:%s))['"]""" % "|".join(ASSET_EXTS))
IMPORT_RE = re.compile(
    r"""(?:^|[^\w$.])(?:import|export)\s[^;]{0,400}?from\s*['"]([^'"]+)['"]"""
    r"""|(?:^|[^\w$.])import\s*\(\s*['"]([^'"]+)['"]"""
)
IMPORTMAP_RE = re.compile(
    r"""<script[^>]+type=["']importmap["'][^>]*>\s*(\{.*?\})\s*</script>""", re.S
)
BARE_RE = re.compile(r"[a-z@][\w.\-/]*")

MAX_FILES = 800
MAX_BYTES = 120 * 1024 * 1024


def read(path: str) -> str:
    with open(os.path.join(ROOT, path), encoding="utf-8", errors="ignore") as f:
        return f.read()


def local(path: str) -> bool:
    return os.path.isfile(os.path.join(ROOT, path))


def walk_html():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in {".git", "node_modules", "dist", "tools"}]
        for name in filenames:
            if name in {"build.mjs", "server.mjs"}:
                continue
            if name.endswith((".html", ".js", ".mjs")):
                yield os.path.relpath(os.path.join(dirpath, name), ROOT).replace(os.sep, "/")


def importmaps() -> dict[str, str]:
    maps: dict[str, str] = {}
    for page in walk_html():
        if not page.endswith(".html"):
            continue
        for block in IMPORTMAP_RE.findall(read(page)):
            try:
                spec = json.loads(block).get("imports", {})
            except json.JSONDecodeError:
                continue
            for key, value in spec.items():
                verbatim = value.startswith(("/", "http"))
                target = value if verbatim else posixpath.join(posixpath.dirname(page), value)
                clean = posixpath.normpath(target.lstrip("/"))
                maps[key] = clean + "/" if key.endswith("/") else clean
    return maps


def page_root(path: str) -> str:
    """Directory of the html document a module is loaded from."""
    current = posixpath.dirname(path)
    while current:
        if local(posixpath.join(current, "index.html")):
            return current
        current = posixpath.dirname(current)
    return ""


def resolve(spec: str, from_file: str, maps: dict[str, str]) -> str | None:
    if spec.startswith(("http://", "https://", "data:", "#")):
        return None
    if spec in maps:
        return posixpath.normpath(maps[spec])
    for key, target in maps.items():
        if key.endswith("/") and spec.startswith(key):
            return posixpath.normpath(posixpath.join(target, spec[len(key):]))
    if spec.startswith("/"):
        return spec.lstrip("/")
    if spec.startswith("."):
        return posixpath.normpath(posixpath.join(posixpath.dirname(from_file), spec))
    if spec.lower().rsplit(".", 1)[-1] in ASSET_EXTS:
        # asset literals are written against the document that loads the module
        return posixpath.normpath(posixpath.join(page_root(from_file), spec))
    if BARE_RE.fullmatch(spec):
        return posixpath.normpath(posixpath.join("vendor", spec))
    return None


def references(text: str) -> list[str]:
    out = [m.group(1) or m.group(2) for m in IMPORT_RE.finditer(text)]
    out += ASSET_RE.findall(text)
    return out


def download(rel: str) -> int:
    dest = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(dest) or ROOT, exist_ok=True)
    result = subprocess.run(
        ["curl", "-sS", "-L", "--max-time", "120", "--retry", "2", "-f", "-o", dest, BASE + rel],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 or not os.path.isfile(dest) or os.path.getsize(dest) == 0:
        if os.path.isfile(dest):
            os.remove(dest)
        return 0
    size = os.path.getsize(dest)
    print(f"  got     {rel}  {size / 1024:.0f} kB")
    return size


def main() -> int:
    dry = "--dry-run" in sys.argv
    maps = importmaps()
    print(f"importmaps: {json.dumps(maps, indent=2)}")

    queue: list[tuple[str, str, str]] = []
    for page in walk_html():
        for spec in references(read(page)):
            target = resolve(spec, page, maps)
            if target and not local(target):
                queue.append((target, page, spec))

    pending = list(dict.fromkeys(queue))
    seen: set[str] = set()
    downloaded = total_bytes = 0
    failed: list[str] = []

    while pending:
        rel, from_file, spec = pending.pop(0)
        rel = posixpath.normpath(rel)
        if rel in seen or rel.startswith(".."):
            continue
        seen.add(rel)

        if local(rel):
            text = read(rel)
        else:
            if dry:
                print(f"  would fetch {rel}")
                downloaded += 1
                continue
            size = download(rel)
            if size == 0:
                failed.append(rel)
                print(f"  failed  {rel}")
                continue
            downloaded += 1
            total_bytes += size
            text = read(rel)
            if downloaded > MAX_FILES or total_bytes > MAX_BYTES:
                print("  stopping: budget reached")
                break

        for spec2 in references(text):
            target = resolve(spec2, rel, maps)
            if target and not local(target) and target not in seen:
                pending.append((target, rel, spec2))

    if dry:
        print(f"{downloaded} files would be fetched")
    else:
        print(f"downloaded {downloaded} files, {total_bytes / 1e6:.1f} MB, {len(failed)} failures")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

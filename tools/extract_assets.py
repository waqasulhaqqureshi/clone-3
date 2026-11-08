"""Extract the site's imagery from the 30 fps reference frames (goal.webm).

Everything the live site serves as photography/mockups is reconstructed from the
recording, because the sandbox can only reach github/npm/pypi and not
therishithakor.com. Run:  python3 tools/extract_assets.py
Frames must exist at /tmp/frames/goal (see tools/frames.sh).
"""
import os, subprocess, json
from PIL import Image, ImageDraw, ImageFilter

FR = "/tmp/frames/goal"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "img")
os.makedirs(OUT, exist_ok=True)

def frame(t):
    return Image.open(f"{FR}/g_{round(t*30):05d}.jpg").convert("RGB")

def feather(im, left=0, top=0, right=0, bottom=0):
    """alpha mask that fades the given edges inward."""
    a = Image.new("L", im.size, 255)
    d = ImageDraw.Draw(a)
    if left:
        for i in range(left):
            d.line([(i, 0), (i, im.height)], fill=int(255 * (i / left) ** 0.8))
    if right:
        for i in range(right):
            d.line([(im.width - 1 - i, 0), (im.width - 1 - i, im.height)], fill=int(255 * (i / right) ** 0.8))
    if top:
        for i in range(top):
            d.line([(0, i), (im.width, i)], fill=int(255 * (i / top) ** 0.8))
    if bottom:
        for i in range(bottom):
            d.line([(0, im.height - 1 - i), (im.width, im.height - 1 - i)], fill=int(255 * (i / bottom) ** 0.8))
    im = im.copy()
    im.putalpha(a)
    return im

def save(im, name, q=90):
    im.save(os.path.join(OUT, name), quality=q, method=6)

# ---------------------------------------------------------------- portraits
# The hero swaps the photograph with the active skill. Five shots, one per skill.
PORTRAITS = [
    ("graphic", 2.0), ("photographer", 5.0), ("web", 8.0), ("app", 11.0), ("uiux", 14.0),
]
BOX = (1010, 205, 1918, 958)
for name, t in PORTRAITS:
    im = frame(t).crop(BOX)
    im = feather(im, left=170, top=50)
    save(im, f"portrait-{name}.webp", 92)

# ---------------------------------------------------------------- doors
# flat-on frame: every leaf closed, identical lighting
flat = frame(40.0)
LEAVES = {
    "web": (233, 394, 410, 847),
    "app": (657, 394, 833, 847),
    "uiux": (1081, 394, 1257, 847),
    "graphic": (1505, 394, 1681, 847),
}

def arch_mask(size, grow=3):
    w, h = size
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    r = w // 2
    d.rounded_rectangle([0, 0, w - 1, h + r], radius=r, fill=255)
    return m

meta = {}
for key, box in LEAVES.items():
    leaf = flat.crop(box)
    m = arch_mask(leaf.size)
    leaf.putalpha(m)
    save(leaf, f"door-{key}.webp", 94)
    meta[key] = box

# door unit (moulding + recess) with the leaf knocked out
for key, box in LEAVES.items():
    pad_x, pad_top, pad_bottom = 46, 40, 22
    unit_box = (box[0] - pad_x, box[1] - pad_top, box[2] + pad_x, box[3] + pad_bottom)
    unit = flat.crop(unit_box)
    hole = Image.new("L", unit.size, 255)
    hw, hh = box[2] - box[0], box[3] - box[1]
    om = arch_mask((hw + 6, hh + 6))
    hole.paste(0, (pad_x - 3, pad_top - 3), om)
    unit.putalpha(feather(unit.convert("RGB"), 24, 24, 24, 0).getchannel("A"))
    unit.putalpha(Image.composite(unit.getchannel("A"), Image.new("L", unit.size, 0), hole))
    save(unit, f"door-unit-{key}.webp", 94)
    meta[key] = {"leaf": box, "unit": unit_box}

# ---------------------------------------------------------------- textures
# plain plaster between two doors, tiled by CSS
plaster = frame(40.0).crop((430, 300, 620, 700))
save(plaster, "plaster.webp", 88)

# wall's lower skirting band, one clean segment
skirt = frame(40.0).crop((430, 690, 630, 870))
save(skirt, "skirting.webp", 90)

# ---------------------------------------------------------------- hero card rings
# the spiral binding of the flip calendar
rings = frame(2.0).crop((168, 480, 920, 560))
save(rings, "card-rings.webp", 92)

with open(os.path.join(OUT, "doors.json"), "w") as f:
    json.dump(meta, f, indent=2)
print("extracted:", sorted(os.listdir(OUT)))

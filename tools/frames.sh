#!/usr/bin/env bash
# Extract 30 fps reference frames from the two recordings.
#   goal.webm    — the destination (therishithakor.com, 2:53)
#   situation.avi — the current state of this build (0:18)
#
# The sources are natively 15 fps, so `fps=30` duplicates each original frame
# once; that keeps every downstream timestamp addressable at 1/30 s.
set -euo pipefail
FF="${FF:-ffmpeg}"   # pip install imageio-ffmpeg -> use that binary if no system ffmpeg
mkdir -p frames/goal frames/situation

"$FF" -hide_banner -loglevel error -i goal.webm -vf "fps=30" -q:v 4 frames/goal/g_%05d.jpg
"$FF" -hide_banner -loglevel error -i situation.avi -vf "fps=30" -q:v 4 frames/situation/s_%05d.jpg

echo "goal.webm    -> $(ls frames/goal | wc -l) frames (2:53.87)"
echo "situation.avi-> $(ls frames/situation | wc -l) frames (0:18.67)"

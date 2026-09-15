#!/usr/bin/env bash
# Renders the scroll-scrub source footage into WebP frame sequences.
#
# Run this whenever the source video changes, then commit public/seq/.
# The MP4s are deliberately NOT shipped: decoding them in the browser cost
# ~500MB of canvas memory per instance and left the section black for seconds
# while it sampled. Pre-rendered frames stream and decode progressively.
#
# Source files live at the repo root, one level above app/.
set -euo pipefail
cd "$(dirname "$0")/.."

FPS=15          # scrub reads fine well below playback rate
WIDTH=1920      # full source width: 960 read soft on a desktop screen
QUALITY=78      # WebP q — raise for cleaner frames, watch the total size

render() {
  local input="$1" name="$2" pre="${3:-}"
  rm -rf "public/seq/$name"
  mkdir -p "public/seq/$name"
  ffmpeg -loglevel error -i "$input" \
    -vf "${pre}fps=$FPS,scale=$WIDTH:-2" \
    -c:v libwebp -quality "$QUALITY" -compression_level 6 \
    "public/seq/$name/f-%03d.webp"
  echo "$name: $(ls "public/seq/$name" | wc -l) frames, $(du -sh "public/seq/$name" | cut -f1)"
}

render "../hero scrub logo extended.mp4" hero
# One continuous ocean-to-cloud take. It used to be two films (ship.mp4 then
# clouds.mp4) crossfaded together in the page; they are now a single scrub.
# Shifted 14px left (0.7%) so the hull lands on the same vertical axis as the
# trailer it cuts from. Baked here rather than transformed in the page.
render "../ship.mp4"       ship "crop=iw-14:ih:14:0,"

echo
echo "Update count={N} in Stage.tsx / Stats.tsx if the frame count changed."

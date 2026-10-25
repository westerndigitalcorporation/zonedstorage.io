#!/usr/bin/env bash
#
# png2svg.sh - Convert PNG images to SVG by true vectorization (tracing).
#
# This reproduces the working pipeline used for linux-zbd-overview.png:
#   1. Flatten any alpha channel onto a white background (ImageMagick),
#      which avoids a known vtracer crash on RGBA input.
#   2. Trace the flattened raster into real vector paths (vtracer).
#
# Note: text is traced into vector outlines, not editable text.
#
# Usage:
#   png2svg.sh [options] <file.png|directory> [more...]
#
# Options:
#   -o DIR   Write SVGs into DIR (default: alongside each input PNG)
#   -r       Recurse into directories looking for *.png
#   -f       Overwrite existing .svg output (default: skip if newer)
#   -h       Show this help
#
# Examples:
#   png2svg.sh image.png
#   png2svg.sh -o out/ a.png b.png
#   png2svg.sh -r static/img/

set -euo pipefail

usage() { sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

OUT_DIR=""
RECURSE=0
FORCE=0

while getopts ":o:rfh" opt; do
  case "$opt" in
    o) OUT_DIR="$OPTARG" ;;
    r) RECURSE=1 ;;
    f) FORCE=1 ;;
    h) usage 0 ;;
    \?) echo "Unknown option: -$OPTARG" >&2; usage 1 ;;
    :) echo "Option -$OPTARG requires an argument" >&2; usage 1 ;;
  esac
done
shift $((OPTIND - 1))

[ "$#" -ge 1 ] || { echo "error: no input given" >&2; usage 1; }

# --- dependency checks ---------------------------------------------------
if command -v magick >/dev/null 2>&1; then
  MAGICK=(magick)
elif command -v convert >/dev/null 2>&1; then
  MAGICK=(convert)
else
  echo "error: ImageMagick ('magick' or 'convert') is required" >&2
  exit 1
fi

if ! python3 -c "import vtracer" >/dev/null 2>&1; then
  echo "error: the 'vtracer' Python module is required. Install with:" >&2
  echo "       pip install --user vtracer" >&2
  exit 1
fi

[ -n "$OUT_DIR" ] && mkdir -p "$OUT_DIR"

# --- collect input files -------------------------------------------------
declare -a FILES=()
for arg in "$@"; do
  if [ -d "$arg" ]; then
    if [ "$RECURSE" -eq 1 ]; then
      while IFS= read -r -d '' f; do FILES+=("$f"); done \
        < <(find "$arg" -type f -iname '*.png' -print0)
    else
      for f in "$arg"/*.png "$arg"/*.PNG; do
        [ -e "$f" ] && FILES+=("$f")
      done
    fi
  elif [ -f "$arg" ]; then
    FILES+=("$arg")
  else
    echo "warn : skipping '$arg' (not a file or directory)" >&2
  fi
done

[ "${#FILES[@]}" -ge 1 ] || { echo "error: no PNG files found" >&2; exit 1; }

# --- convert -------------------------------------------------------------
convert_one() {
  local in="$1" out tmp base
  base="$(basename "${in%.*}")"
  if [ -n "$OUT_DIR" ]; then
    out="$OUT_DIR/$base.svg"
  else
    out="${in%.*}.svg"
  fi

  if [ "$FORCE" -eq 0 ] && [ -f "$out" ] && [ "$out" -nt "$in" ]; then
    echo "skip : $out (up to date; use -f to force)"
    return 0
  fi

  tmp="$(mktemp --suffix=.png)"
  # Flatten alpha onto white and force plain RGB (avoids vtracer RGBA crash).
  "${MAGICK[@]}" "$in" -background white -alpha remove -alpha off -type TrueColor "$tmp"

  python3 - "$tmp" "$out" <<'PY'
import sys, vtracer
vtracer.convert_image_to_svg_py(sys.argv[1], sys.argv[2])
PY

  rm -f "$tmp"
  echo "ok   : $in -> $out"
}

rc=0
for f in "${FILES[@]}"; do
  convert_one "$f" || { echo "fail : $f" >&2; rc=1; }
done
exit "$rc"

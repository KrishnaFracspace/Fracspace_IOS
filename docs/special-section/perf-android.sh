#!/usr/bin/env bash
# Special Section perf run on a connected Android device (see PERF.md).
# Start with the app open on the screen under test, signed in, Metro running.
#
#   docs/special-section/perf-android.sh <label> [cycles] [enter] [leave]
#
#   label   name for this run, e.g. hub-before
#   cycles  leave/enter cycles for the leak check (default 10)
#   enter   text or content-desc of the element that opens the screen
#           (default "Stays, Music and Shop" = centre tab), or "x,y" in px
#   leave   same for the element that leaves it (default "Home"); "BACK"
#           presses the system back key
#   uiautomator cannot dump a screen whose animations never stop (Hub), so
#   pass "x,y" for taps made there.
#
# Output: docs/special-section/runs/<label>-android.txt (scratch output, not
# committed; copy the numbers into PERF.md).
set -euo pipefail
PKG=com.fracspace
LABEL=${1:?label}
CYCLES=${2:-10}
ENTER=${3:-Stays, Music and Shop}
LEAVE=${4:-Home}
OUT="$(dirname "$0")/runs/$LABEL-android.txt"
mkdir -p "$(dirname "$OUT")"
: >"$OUT"

say() { echo "$*" | tee -a "$OUT"; }

# Centre of the first node whose text or content-desc equals $1.
tap() {
  if [[ $1 =~ ^[0-9]+,[0-9]+$ ]]; then
    adb shell input tap ${1/,/ }
    return
  fi
  adb shell uiautomator dump /sdcard/ss-ui.xml >/dev/null || true
  local xy
  xy=$(adb shell cat /sdcard/ss-ui.xml | python3 -c '
import re, sys
want = sys.argv[1]
for m in re.finditer(r"<node [^>]*>", sys.stdin.read()):
    n = m.group(0)
    t = re.search(r" text=\"([^\"]*)\"", n).group(1)
    d = re.search(r" content-desc=\"([^\"]*)\"", n).group(1)
    if want in (t, d):
        x1, y1, x2, y2 = map(int, re.search(r"bounds=\"\[(\d+),(\d+)\]\[(\d+),(\d+)\]\"", n).groups())
        print((x1 + x2) // 2, (y1 + y2) // 2)
        break
' "$1")
  [ -n "$xy" ] || { say "!! '$1' not found (pass x,y instead)"; exit 1; }
  adb shell input tap $xy
}

mem() {
  say "--- meminfo: $1"
  adb shell dumpsys meminfo $PKG | grep -E "Native Heap|Dalvik Heap|Graphics|TOTAL PSS|Views:|AppContexts" | tee -a "$OUT"
}

frames() {
  say "--- gfxinfo: $1"
  adb shell dumpsys gfxinfo $PKG | grep -E "Total frames|Janky frames:|50th percentile|90th percentile|95th percentile|99th percentile|Slow UI thread|Slow bitmap|Slow issue draw|50th gpu|90th gpu" | tee -a "$OUT"
}

swipes() {
  local w h
  read -r w h < <(adb shell wm size | awk -F'[ x]' '/size/{print $(NF-1), $NF}')
  for _ in 1 2 3; do
    adb shell input swipe $((w / 2)) $((h * 3 / 4)) $((w / 2)) $((h / 4)) 300
    sleep 1
  done
  for _ in 1 2 3; do
    adb shell input swipe $((w / 2)) $((h / 4)) $((w / 2)) $((h * 3 / 4)) 300
    sleep 1
  done
}

say "run $LABEL  $(date '+%F %T')  device $(adb shell getprop ro.product.model)"
adb logcat -c

# 1. Idle on the screen: looping animations only.
adb shell dumpsys gfxinfo $PKG reset >/dev/null
sleep 10
frames "idle 10s"

# 2. Vertical scroll.
adb shell dumpsys gfxinfo $PKG reset >/dev/null
swipes
frames "scroll 6 swipes"

# 3. Leak check: memory before/after N leave/enter cycles.
sleep 5
mem "before $CYCLES cycles"
for i in $(seq "$CYCLES"); do
  if [ "$LEAVE" = BACK ]; then adb shell input keyevent 4; else tap "$LEAVE"; fi
  sleep 2
  tap "$ENTER"
  sleep 3
done
sleep 10
mem "after $CYCLES cycles (+10s settle)"

say "--- [ssperf] log"
adb logcat -d -s ReactNativeJS | grep ssperf | sed 's/^.*\[ssperf\]/[ssperf]/' | tee -a "$OUT" || true
echo "saved $OUT"

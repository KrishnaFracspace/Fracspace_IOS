#!/usr/bin/env bash
# Leave/enter cycles that confirm every entry (see PERF.md). Start on the
# screen under test, signed in, Metro running, probes on.
#
#   docs/special-section/perf-cycles.sh <label> <cycles> <enter x,y> <Screen>
#
# Each cycle presses BACK, checks the app is still in front, taps <enter x,y>
# and waits for "[ssperf] <Screen> mount" in logcat (one retry). It stops on a
# missed tap instead of carrying on somewhere else. meminfo before and after.
# Output: docs/special-section/runs/<label>-cycles.txt (not committed).
set -u
PKG=com.fracspace
LABEL=${1:?label}
N=${2:-10}
XY=${3:?enter x,y}
SCREEN=${4:?screen name used by useFirstFrame}
OUT="$(dirname "$0")/runs/$LABEL-cycles.txt"
mkdir -p "$(dirname "$OUT")"
: >"$OUT"

mem() { adb shell dumpsys meminfo $PKG | grep -E "TOTAL PSS|Views:|Native Heap:" >>"$OUT"; }

echo "--- before" >>"$OUT"
mem
for i in $(seq 1 "$N"); do
  adb shell input keyevent BACK
  sleep 4
  adb shell dumpsys activity activities | grep -q "ResumedActivity.*$PKG" || { echo "LEFT APP at $i" >>"$OUT"; break; }
  ok=
  for try in 1 2; do
    adb logcat -c
    adb shell input tap ${XY/,/ }
    for s in 1 2 3 4 5 6 7 8; do
      sleep 1
      l=$(adb logcat -d | grep -o "$SCREEN mount.*" | head -1)
      [ -n "$l" ] && { echo "$i $l" >>"$OUT"; ok=1; break; }
    done
    [ -n "$ok" ] && break
  done
  [ -n "$ok" ] || { echo "MISSED at $i" >>"$OUT"; break; }
  sleep 2
done
sleep 10
echo "--- after" >>"$OUT"
mem
cat "$OUT"

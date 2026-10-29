#!/usr/bin/env bash
# perf-oneshot.sh <label> "name x,y|BACK seconds" ... : taps in order, dumps framestats
# every ~1.5 s, then lists per step: frames, frames > 33 ms, frames > 100 ms (ms after the tap).
# Output: docs/special-section/runs/<label>.oneshot (not committed).
mkdir -p "$(dirname "$0")/runs"; cd "$(dirname "$0")/runs"; L=$1; shift; out=$L.oneshot; : > $out; : > $L.taps
adb shell dumpsys gfxinfo com.fracspace reset >/dev/null
for step in "$@"; do
  set -- $step; n=$1; xy=$2; w=$3
  adb shell "log -t ivamark $n; $( [ $xy = BACK ] && echo input keyevent 4 || echo input tap ${xy%,*} ${xy#*,})"; up=$(adb logcat -v monotonic -d -s ivamark | tail -1 | awk '{print $1}')
  echo "$n $up" >> $L.taps
  t=0; while [ $t -lt $w ]; do sleep 1.5; adb shell dumpsys gfxinfo com.fracspace framestats >> $out; t=$((t+1)); done
done
python3 - $out $L.taps <<'PY'
import sys
seen={};hdr=None
for l in open(sys.argv[1]):
    if l.startswith('Flags,'): hdr=l.strip().split(','); continue
    if hdr and l[:1].isdigit():
        p=l.strip().split(','); d=dict(zip(hdr,p))
        if d.get('Flags')=='0': seen[int(d['IntendedVsync'])]=(int(d['FrameCompleted'])-int(d['IntendedVsync']))/1e6
taps=[(n,float(u)*1e9) for n,u in (l.split() for l in open(sys.argv[2]))]
for n,(a,b) in zip([t[0] for t in taps],zip([t[1] for t in taps],[t[1] for t in taps[1:]]+[9e30])):
    fr=[(v,ms) for v,ms in sorted(seen.items()) if a<=v<b]
    big=[f"{(v-a)/1e6:.0f}ms:{ms:.0f}" for v,ms in fr if ms>100]
    jank=sum(ms>33 for v,ms in fr)
    print(f"{n}: {len(fr)} frames, {jank} >33ms, >100ms at [t+:dur] {' '.join(big)}")
PY

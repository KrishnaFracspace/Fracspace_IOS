// Dev-only performance probes for the Special Section (see
// docs/special-section/PERF.md). Every hook is a no-op in release builds and
// nothing here renders. Output goes to the console with an `[ssperf]` prefix:
// on Android `adb logcat | grep ssperf`; on iOS only Metro / React Native
// DevTools show it (use Instruments there).

import {useEffect, useRef} from 'react';

const ON = __DEV__;
const now = () => global.performance.now();
const renders = {};

/** Counts renders of `name`; totals are logged (and reset) by useJsFps. */
export function useRenderCount(name) {
  if (ON) {
    renders[name] = (renders[name] || 0) + 1;
  }
}

/** Marks a tap that should open a screen; useFirstFrame reports tap → frame. */
export function markTap(name) {
  if (ON) {
    global.__ssperfTap = {name, at: now()};
  }
}

/** Logs ms since the last markTap at a named step (no-op without a tap). */
export function sinceTap(step) {
  const tap = ON && global.__ssperfTap;
  if (tap) {
    console.log(`[ssperf] ${tap.name} ${step} +${Math.round(now() - tap.at)}ms`);
  }
}

/** Logs first render → first painted frame, and tap → frame if markTap ran. */
export function useFirstFrame(name) {
  const t0 = useRef(ON ? now() : 0);
  useEffect(() => {
    if (!ON) {
      return;
    }
    const id = requestAnimationFrame(() => {
      const t = now();
      const tap = global.__ssperfTap;
      const fromTap = tap ? ` tap→frame=${Math.round(t - tap.at)}ms` : '';
      console.log(`[ssperf] ${name} mount render→frame=${Math.round(t - t0.current)}ms${fromTap}`);
      global.__ssperfTap = null;
    });
    return () => cancelAnimationFrame(id);
  }, [name]);
}

/**
 * While `active`, logs the JS thread's frame rate and the render counts every
 * `every` ms. JS fps drops when the JS thread is busy (UI-thread animations
 * keep running; measure those with gfxinfo / Instruments).
 */
export function useJsFps(name, active, every = 5000) {
  const first = useRef(true);
  useEffect(() => {
    if (!ON || !active) {
      return;
    }
    let frames = 0;
    let raf;
    const tick = () => {
      frames++;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    let last = now();
    const tap = first.current ? null : global.__ssperfTap;
    first.current = false;
    if (tap) {
      sinceTap('focus effects start');
      // Re-entry: the screen is already mounted, so time tap → next frame.
      requestAnimationFrame(() => {
        console.log(`[ssperf] ${name} focus tap→frame=${Math.round(now() - tap.at)}ms`);
        global.__ssperfTap = null;
      });
    }
    const id = setInterval(() => {
      const t = now();
      const fps = Math.round((frames * 1000) / (t - last));
      const counts = Object.keys(renders)
        .map(k => `${k}=${renders[k]}`)
        .join(' ');
      console.log(`[ssperf] ${name} jsFps=${fps} renders{${counts}}`);
      frames = 0;
      last = t;
      Object.keys(renders).forEach(k => delete renders[k]);
    }, every);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [name, active, every]);
}

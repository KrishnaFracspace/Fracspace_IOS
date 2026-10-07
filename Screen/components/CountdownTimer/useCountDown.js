import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

const useCountdown = (targetDate) => {
  const [time, setTime] = useState({});
  // The banner's screen stays mounted under others; only tick while visible.
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let interval;
    const tick = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick(); // show the time now, not after the first second
    interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isFocused]);

  return time;
};

export default useCountdown;

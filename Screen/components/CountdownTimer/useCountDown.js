import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const [time, setTime] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return time;
};

export default useCountdown;

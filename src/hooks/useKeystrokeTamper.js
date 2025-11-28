import { useEffect } from 'react';

export default function useKeystrokeTamper(callback) {
  useEffect(() => {
    let last = performance.now();
    let rapidCount = 0;

    const onType = () => {
      const now = performance.now();
      const diff = now - last;

      // Extremely fast typing = bot
      if (diff < 20) rapidCount++;

      if (rapidCount >= 15) {
        callback('keystroke-automation');
      }

      last = now;
    };

    window.addEventListener('keydown', onType);
    return () => window.removeEventListener('keydown', onType);
  }, [callback]);
}

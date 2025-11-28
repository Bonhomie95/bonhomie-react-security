import { useEffect, useState } from 'react';
import { isDevtoolsOpen } from '../utils/detectDevTools.js';

export default function useDevtoolsDetect(options = {}) {
  const {
    onDetect, // callback when devtools is detected
    pollInterval = 1000, // ms
    enabled = true,
  } = options;

  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let prev = isDevtoolsOpen();
    setDevtoolsOpen(prev);

    const check = () => {
      const current = isDevtoolsOpen();
      if (current && !prev && typeof onDetect === 'function') {
        onDetect();
      }
      prev = current;
      setDevtoolsOpen(current);
    };

    const resizeHandler = () => check();
    window.addEventListener('resize', resizeHandler);

    const intervalId = setInterval(check, pollInterval);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      clearInterval(intervalId);
    };
  }, [enabled, pollInterval, onDetect]);

  return devtoolsOpen;
}

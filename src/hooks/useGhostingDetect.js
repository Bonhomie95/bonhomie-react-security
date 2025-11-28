import { useEffect } from 'react';

export default function useGhostingDetect(callback) {
  useEffect(() => {
    const keys = new Set();

    const down = (e) => {
      keys.add(e.key);

      if (keys.size >= 4) {
        callback('keyboard-ghosting');
      }
    };

    const up = (e) => {
      keys.delete(e.key);
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [callback]);
}

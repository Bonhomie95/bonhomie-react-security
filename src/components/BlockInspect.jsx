import { useEffect, useContext, useRef } from 'react';
import { SecurityContext } from '../provider/ReactSecurityProvider.jsx';

export default function BlockInspect({
  children,
  detectMobile = true,
  detectContextMenu = true,
  detectZoom = true,
}) {
  const ctx = useContext(SecurityContext);
  const longPressTimer = useRef(null);

  const markEvent = (type) => {
    if (ctx && typeof ctx.markSuspicious === 'function') {
      ctx.markSuspicious(type);
    }
  };

  useEffect(() => {
    // ----- Desktop keyboard shortcuts -----
    const keyHandler = (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        markEvent('inspect_key');
      }

      // CTRL+SHIFT+I / CTRL+SHIFT+J
      if (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key)) {
        e.preventDefault();
        markEvent('inspect_key_combo');
      }

      // CTRL + U
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        markEvent('view_source_attempt');
      }
    };

    window.addEventListener('keydown', keyHandler);

    // ----- Block right-click -----
    const contextHandler = (e) => {
      if (detectContextMenu) {
        e.preventDefault();
        markEvent('context_menu_blocked');
      }
    };
    window.addEventListener('contextmenu', contextHandler);

    // ----- Mobile long press -----
    const touchStart = () => {
      if (!detectMobile) return;

      longPressTimer.current = setTimeout(() => {
        markEvent('mobile_long_press_inspect');
      }, 500);
    };
    const touchEnd = () => clearTimeout(longPressTimer.current);

    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchend', touchEnd);

    // ----- Mobile & desktop zoom detection -----
    const zoomHandler = () => {
      if (!detectZoom) return;
      const zoom = window.outerWidth / window.innerWidth;
      if (zoom > 1.05) {
        markEvent('zoom_devtools_detected');
      }
    };
    window.addEventListener('resize', zoomHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('contextmenu', contextHandler);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('resize', zoomHandler);
    };
  }, [detectMobile, detectContextMenu, detectZoom]);

  return children;
}

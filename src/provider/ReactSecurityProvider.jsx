import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

// Base hooks
import useDevtoolsDetect from '../hooks/useDevtoolsDetect.js';
import useScreenshotBlock from '../hooks/useScreenshotBlock.js';
import useClipboardLock from '../hooks/useClipboardLock.js';
import useGhostingDetect from '../hooks/useGhostingDetect.js';
import useKeystrokeTamper from '../hooks/useKeystrokeTamper.js';

// Utilities
import { detectAIScreenshot } from '../utils/aiScreenshotDetector.js';
import { detectVPN } from '../utils/vpnDetect.js';
import { applyDynamicWatermark, clearWatermark } from '../utils/watermark.js';

export const SecurityContext = createContext({
  suspicious: false,
  locked: false,
  lastEvent: null,
  markSuspicious: () => {},
  unlock: () => {},
  config: {},
});

// ----------------------------------------------
// SECURITY LEVELS PRESET
// ----------------------------------------------
const LEVELS = {
  low: {
    blockDevTools: true,
    blockScreenshot: false,
    blockCopy: false,
    lockOnSuspicious: false,
    autoLogout: false,
    noiseOverlay: false,
    showLockOverlay: false,
    enableWatermark: false,
    detectVPN: false,
    detectKeystrokeTamper: false,
  },
  medium: {
    blockDevTools: true,
    blockScreenshot: true,
    blockCopy: true,
    lockOnSuspicious: true,
    autoLogout: false,
    noiseOverlay: false,
    showLockOverlay: true,
    enableWatermark: true,
    detectVPN: true,
    detectKeystrokeTamper: true,
  },
  high: {
    blockDevTools: true,
    blockScreenshot: true,
    blockCopy: true,
    lockOnSuspicious: true,
    autoLogout: true,
    noiseOverlay: true,
    showLockOverlay: true,
    enableWatermark: true,
    detectVPN: true,
    detectKeystrokeTamper: true,
  },
};

export default function ReactSecurityProvider({
  children,
  level = 'medium',
  config = {},
}) {
  const [suspicious, setSuspicious] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  // ----------------------------------------
  // Merge config preset with user overrides
  // ----------------------------------------
  const merged = useMemo(() => {
    const defaults = LEVELS[level] || LEVELS.medium;
    return { ...defaults, ...config };
  }, [level, config]);

  const {
    blockDevTools,
    blockScreenshot,
    blockCopy,
    lockOnSuspicious,
    autoLogout,
    noiseOverlay,
    showLockOverlay,
    enableWatermark,
    detectVPN: checkVPN,
    detectKeystrokeTamper,
    onDetect,
    onLogout,
  } = merged;

  // ----------------------------------------
  // Mark suspicious activity
  // ----------------------------------------
  const markSuspicious = useCallback(
    (type) => {
      setSuspicious(true);
      setLastEvent(type);

      if (lockOnSuspicious) setLocked(true);
      if (onDetect) onDetect(type);
      if (autoLogout && onLogout) onLogout(type);
    },
    [lockOnSuspicious, autoLogout, onDetect, onLogout]
  );

  const unlock = useCallback(() => {
    setLocked(false);
    clearWatermark();
  }, []);

  // ----------------------------------------
  // HOOKS — Core Detection
  // ----------------------------------------
  useDevtoolsDetect({
    enabled: blockDevTools,
    onDetect: () => markSuspicious('devtools'),
  });

  useScreenshotBlock({
    blockPrintScreen: blockScreenshot,
    blockImageSave: blockScreenshot,
    onScreenshotAttempt: async () => {
      const aiFlag = await detectAIScreenshot();
      if (aiFlag) markSuspicious('ai_screenshot');
      else markSuspicious('screenshot');
    },
  });

  useClipboardLock({
    blockCopy,
    blockCut: blockCopy,
    blockPaste: blockCopy,
    blockContextMenu: blockCopy,
    onBlock: () => markSuspicious('clipboard'),
  });

  // ----------------------------------------
  // HOOKS — Advanced detection
  // ----------------------------------------
  useGhostingDetect({
    enabled: detectKeystrokeTamper,
    onGhost: () => markSuspicious('ghosting'),
  });

  useKeystrokeTamper({
    enabled: detectKeystrokeTamper,
    onTamper: () => markSuspicious('keystroke_tamper'),
  });

  // ----------------------------------------
  // VPN / Proxy Detection
  // ----------------------------------------
  useEffect(() => {
    if (!checkVPN) return;
    detectVPN().then((isVPN) => {
      if (isVPN) markSuspicious('vpn_detected');
    });
  }, [checkVPN, markSuspicious]);

  // ----------------------------------------
  // Watermark (dynamic)
  // ----------------------------------------
  useEffect(() => {
    if (!enableWatermark) return;
    applyDynamicWatermark('SECURE • BONHOMIE • ' + new Date().toISOString());

    return () => clearWatermark();
  }, [enableWatermark]);

  // ----------------------------------------
  // Noise Overlay (UI protection)
  // ----------------------------------------
  useEffect(() => {
    if (!noiseOverlay) return;

    const el = document.createElement('div');
    el.id = 'bon-security-noise';
    el.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" opacity="0.07"><filter id="n"><feTurbulence baseFrequency="0.8"/></filter><rect width="100%" height="100%" filter="url(%23n)" /></svg>');
      z-index: 999999;
    `;
    document.body.appendChild(el);

    return () => el.remove();
  }, [noiseOverlay]);

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  return (
    <SecurityContext.Provider
      value={{
        suspicious,
        locked,
        lastEvent,
        markSuspicious,
        unlock,
        config: merged,
      }}
    >
      {/* Optional lock overlay */}
      {locked && showLockOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 999999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          🔒 Security Lock Activated
        </div>
      )}

      {children}
    </SecurityContext.Provider>
  );
}

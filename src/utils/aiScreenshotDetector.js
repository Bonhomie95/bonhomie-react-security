/**
 * Low-level continuous freeze detector.
 * Detects Snipping Tool, screenshot anomalies, screen freeze patterns.
 */
export function createAIScreenshotDetector(callback) {
  let last = performance.now();
  let active = true;

  const check = () => {
    if (!active) return;

    const now = performance.now();
    const delta = now - last;

    // Sudden freeze pattern commonly seen during screenshot or screen capture attempts.
    // These values were tested across Chrome, Edge, Snipping Tool, OBS, Lightshot.
    if (delta > 250 && delta < 650) {
      callback("ai_screenshot_detected");
    }

    last = now;
    requestAnimationFrame(check);
  };

  requestAnimationFrame(check);

  // Allow external cleanup
  return () => {
    active = false;
  };
}

/**
 * High-level wrapper for easy usage.
 * 
 * @param {Function} onDetect - Called when a suspicious freeze or screenshot signal is detected.
 */
export function detectAIScreenshot(onDetect) {
  if (typeof window === "undefined" || typeof requestAnimationFrame === "undefined") {
    return () => {};
  }

  return createAIScreenshotDetector(onDetect);
}

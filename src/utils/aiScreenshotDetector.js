export function createAIScreenshotDetector(callback) {
  let last = performance.now();

  const check = () => {
    const now = performance.now();
    const delta = now - last;

    // Sudden freeze pattern (Snipping tool)
    if (delta > 250 && delta < 600) {
      callback('suspicious-freeze');
    }

    last = now;
    requestAnimationFrame(check);
  };

  requestAnimationFrame(check);
}

export function getRandomWatermarkPosition() {
  const margin = 40;
  const positions = [
    { bottom: margin, right: margin },
    { top: margin, right: margin },
    { bottom: margin, left: margin },
    { top: margin, left: margin },
    { top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-20deg)" }
  ];

  return positions[Math.floor(Math.random() * positions.length)];
}

let watermarkEl = null;

/**
 * Apply a dynamic watermark overlay on the screen
 * @param {string} text - Watermark text
 * @param {number} opacity - 0.05 to 0.25 recommended
 * @param {number} size - font size in px
 */
export function applyDynamicWatermark(
  text = "Protected Content",
  opacity = 0.12,
  size = 22
) {
  // Remove old watermark to avoid duplicates
  clearWatermark();

  const pos = getRandomWatermarkPosition();

  watermarkEl = document.createElement("div");
  watermarkEl.setAttribute("data-bon-watermark", "true");

  Object.assign(watermarkEl.style, {
    position: "fixed",
    zIndex: 999999,
    pointerEvents: "none",
    fontWeight: "700",
    fontSize: `${size}px`,
    color: `rgba(255,255,255,${opacity})`,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    userSelect: "none",
    padding: "6px 14px",
    mixBlendMode: "overlay",
    transition: "opacity 0.25s ease",
    opacity: "1",
    ...pos
  });

  watermarkEl.textContent = text;

  document.body.appendChild(watermarkEl);
}

/**
 * Remove watermark from DOM
 */
export function clearWatermark() {
  if (watermarkEl) {
    watermarkEl.style.opacity = "0";
    setTimeout(() => {
      watermarkEl?.remove();
      watermarkEl = null;
    }, 200);
  }

  // remove any other stray watermark nodes
  document.querySelectorAll('[data-bon-watermark]').forEach((el) => el.remove());
}

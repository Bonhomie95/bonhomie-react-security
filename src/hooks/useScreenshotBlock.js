import { useEffect } from "react";

export default function useScreenshotBlock(options = {}) {
  const {
    blockPrintScreen = true,
    blockImageSave = true,
    onScreenshotAttempt // callback
  } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Block PrintScreen (Windows)
    const handleKeydown = (e) => {
      if (blockPrintScreen && e.key === "PrintScreen") {
        e.preventDefault();
        if (onScreenshotAttempt) onScreenshotAttempt("printscreen");

        // overwrite clipboard with blank text
        navigator.clipboard.writeText("");
      }

      // Common screenshot shortcuts
      if (blockPrintScreen && (e.ctrlKey && e.key === "p")) {
        e.preventDefault();
      }
    };

    // Block right-click image saving
    const handleContextMenu = (e) => {
      if (!blockImageSave) return;
      const target = e.target;
      if (target.tagName === "IMG" || target.tagName === "CANVAS") {
        e.preventDefault();
        if (onScreenshotAttempt) onScreenshotAttempt("contextmenu-image");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [blockPrintScreen, blockImageSave, onScreenshotAttempt]);
}

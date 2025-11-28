export function getRandomWatermarkPosition() {
  const margin = 40;
  const positions = [
    { bottom: margin, right: margin },
    { top: margin, right: margin },
    { bottom: margin, left: margin },
    { top: margin, left: margin },
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  ];

  return positions[Math.floor(Math.random() * positions.length)];
}

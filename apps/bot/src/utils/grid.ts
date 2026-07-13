export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function formatDirection(fromX: number, fromY: number, toX: number, toY: number): string {
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  // Rust coordinates might be different (e.g., origin top-left or bottom-left), adjust if necessary
  if (angle < 0) angle += 360;

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  return directions[Math.round(angle / 45)];
}

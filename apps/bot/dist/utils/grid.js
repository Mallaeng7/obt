"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
exports.formatDirection = formatDirection;
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function formatDirection(fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    // Rust coordinates might be different (e.g., origin top-left or bottom-left), adjust if necessary
    if (angle < 0)
        angle += 360;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(angle / 45)];
}

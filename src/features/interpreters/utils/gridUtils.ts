import { GRID_CONFIG } from '../config/interpretersConfig';

/**
 * Calculates space value from size using a divisor constant
 * @param size - The size value to calculate from
 * @returns The calculated space value
 */
export function getSpace(size: number): number {
    return size / GRID_CONFIG.calculation.spaceDivisor;
}

/**
 * Converts pixel dimensions to grid rows and columns
 * @param size - Grid cell size
 * @param height - Container height in pixels
 * @param width - Container width in pixels
 * @returns Object containing rows and cols properties
 */
export function convertPixels(
    size: number,
    height: number,
    width: number
): { rows: number; cols: number } {
    const space = getSpace(size);
    const pixel = GRID_CONFIG.calculation.pixelMultiplier * (size + space);
    const rows = Math.floor(height / pixel);
    const cols = Math.floor(width / pixel);

    return { rows, cols };
}

/**
 * Gets direction value from arrow key or WASD key input
 * @param arrow - String representing arrow key or WASD key
 * @returns Direction value (-2 for up, 2 for down, -1 for left, 1 for right, 0 for invalid)
 */
export function getDirection(arrow: string): number {
    switch (arrow.toLowerCase()) {
        case 'arrowup':
        case 'w':
            return -2;
        case 'arrowdown':
        case 's':
            return 2;
        case 'arrowleft':
        case 'a':
            return -1;
        case 'arrowright':
        case 'd':
            return 1;
        default:
            return 0;
    }
}

/**
 * Moves grid position based on direction
 * @param start - Starting position index
 * @param arrow - Direction value (-2, 2, -1, 1)
 * @param rows - Number of rows in grid
 * @param cols - Number of columns in grid
 * @returns New position index after movement
 */
export function gridMove(
    start: number,
    arrow: number,
    rows: number,
    cols: number
): number {
    const jump = cols - 1;
    const max = rows * cols;

    switch (arrow) {
        case 2:
            start += cols;
            break;
        case -2:
            start -= cols;
            break;
        case 1:
            if (start % cols === jump) start -= jump;
            else start += 1;
            break;
        case -1:
            if (start % cols === 0) start += jump;
            else start -= 1;
            break;
        default:
            break;
    }

    return (start + max) % max;
}

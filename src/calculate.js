export function getSpace(size) {
    return size / 20;
}

export function convertPixels(
        size, height, width) {
    const space = getSpace(size);
    const pixel = 16 * (size + space);
    const rows  = Math.floor(height / pixel);
    const cols  = Math.floor(width  / pixel);

    return { rows, cols };
}

export function getDirection(arrow) {
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

export function gridMove(
        start,
        arrow,
        rows,
        cols) {
    const jump = cols - 1;
    const max  = rows * cols;

    switch (arrow) {
        case 2:
            start += cols;
            break;
        case -2:
            start -= cols;
            break;
        case 1:
            if (start % cols === jump)
                start -= jump;
            else
                start += 1;
            break;
        case -1:
            if (start % cols === 0)
                start += jump;
            else
                start -= 1;
            break;
        default:
            break;
    }

    return (start + max) % max;
}

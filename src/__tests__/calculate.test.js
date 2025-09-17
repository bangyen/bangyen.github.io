import { getSpace, convertPixels, getDirection, gridMove } from '../calculate';

describe('Calculate Utilities', () => {
    /**
     * Tests the calculate utility functions for proper mathematical operations,
     * grid movement calculations, and coordinate transformations to ensure
     * the game mechanics and layout calculations work correctly.
     */
    describe('getSpace', () => {
        test('calculates space correctly for various sizes', () => {
            expect(getSpace(20)).toBe(1);
            expect(getSpace(40)).toBe(2);
            expect(getSpace(10)).toBe(0.5);
            expect(getSpace(0)).toBe(0);
        });

        test('handles decimal sizes', () => {
            expect(getSpace(15)).toBe(0.75);
            expect(getSpace(25)).toBe(1.25);
        });

        test('handles negative sizes', () => {
            expect(getSpace(-20)).toBe(-1);
            expect(getSpace(-10)).toBe(-0.5);
        });
    });

    describe('convertPixels', () => {
        test('calculates rows and cols correctly', () => {
            const result = convertPixels(20, 400, 600);

            expect(result).toHaveProperty('rows');
            expect(result).toHaveProperty('cols');
            expect(typeof result.rows).toBe('number');
            expect(typeof result.cols).toBe('number');
        });

        test('calculates correct dimensions for standard case', () => {
            // size=20, height=400, width=600
            // space = 20/20 = 1
            // pixel = 16 * (20 + 1) = 336
            // rows = floor(400/336) = 1
            // cols = floor(600/336) = 1
            const result = convertPixels(20, 400, 600);

            expect(result.rows).toBe(1);
            expect(result.cols).toBe(1);
        });

        test('calculates correct dimensions for larger case', () => {
            // size=10, height=800, width=1200
            // space = 10/20 = 0.5
            // pixel = 16 * (10 + 0.5) = 168
            // rows = floor(800/168) = 4
            // cols = floor(1200/168) = 7
            const result = convertPixels(10, 800, 1200);

            expect(result.rows).toBe(4);
            expect(result.cols).toBe(7);
        });

        test('handles zero dimensions', () => {
            const result = convertPixels(20, 0, 0);

            expect(result.rows).toBe(0);
            expect(result.cols).toBe(0);
        });

        test('handles very small dimensions', () => {
            const result = convertPixels(20, 10, 10);

            expect(result.rows).toBe(0);
            expect(result.cols).toBe(0);
        });

        test('handles very large dimensions', () => {
            const result = convertPixels(20, 10000, 10000);

            expect(result.rows).toBeGreaterThan(0);
            expect(result.cols).toBeGreaterThan(0);
        });
    });

    describe('getDirection', () => {
        test('returns correct direction for arrow keys', () => {
            expect(getDirection('ArrowUp')).toBe(-2);
            expect(getDirection('ArrowDown')).toBe(2);
            expect(getDirection('ArrowLeft')).toBe(-1);
            expect(getDirection('ArrowRight')).toBe(1);
        });

        test('returns correct direction for WASD keys', () => {
            expect(getDirection('w')).toBe(-2);
            expect(getDirection('W')).toBe(-2);
            expect(getDirection('s')).toBe(2);
            expect(getDirection('S')).toBe(2);
            expect(getDirection('a')).toBe(-1);
            expect(getDirection('A')).toBe(-1);
            expect(getDirection('d')).toBe(1);
            expect(getDirection('D')).toBe(1);
        });

        test('returns 0 for invalid keys', () => {
            expect(getDirection('q')).toBe(0);
            expect(getDirection('z')).toBe(0);
            expect(getDirection('x')).toBe(0);
            expect(getDirection('c')).toBe(0);
            expect(getDirection('')).toBe(0);
            expect(getDirection('invalid')).toBe(0);
        });

        test('handles case insensitive input', () => {
            expect(getDirection('arrowup')).toBe(-2);
            expect(getDirection('ARROWUP')).toBe(-2);
            expect(getDirection('ArrowUp')).toBe(-2);
        });

        test('handles numeric input', () => {
            expect(getDirection('1')).toBe(0);
            expect(getDirection('0')).toBe(0);
        });

        test('handles special characters', () => {
            expect(getDirection('!')).toBe(0);
            expect(getDirection('@')).toBe(0);
            expect(getDirection('#')).toBe(0);
        });
    });

    describe('gridMove', () => {
        test('moves down correctly', () => {
            // Start at position 0, move down (arrow=2) in 3x3 grid
            const result = gridMove(0, 2, 3, 3);
            expect(result).toBe(3);
        });

        test('moves up correctly', () => {
            // Start at position 3, move up (arrow=-2) in 3x3 grid
            const result = gridMove(3, -2, 3, 3);
            expect(result).toBe(0);
        });

        test('moves right correctly', () => {
            // Start at position 0, move right (arrow=1) in 3x3 grid
            const result = gridMove(0, 1, 3, 3);
            expect(result).toBe(1);
        });

        test('moves left correctly', () => {
            // Start at position 1, move left (arrow=-1) in 3x3 grid
            const result = gridMove(1, -1, 3, 3);
            expect(result).toBe(0);
        });

        test('wraps around when moving down from bottom', () => {
            // Start at position 6, move down (arrow=2) in 3x3 grid
            const result = gridMove(6, 2, 3, 3);
            expect(result).toBe(0); // Should wrap to top
        });

        test('wraps around when moving up from top', () => {
            // Start at position 0, move up (arrow=-2) in 3x3 grid
            const result = gridMove(0, -2, 3, 3);
            expect(result).toBe(6); // Should wrap to bottom
        });

        test('wraps around when moving right from right edge', () => {
            // Start at position 2, move right (arrow=1) in 3x3 grid
            const result = gridMove(2, 1, 3, 3);
            expect(result).toBe(0); // Should wrap to left edge
        });

        test('wraps around when moving left from left edge', () => {
            // Start at position 0, move left (arrow=-1) in 3x3 grid
            const result = gridMove(0, -1, 3, 3);
            expect(result).toBe(2); // Should wrap to right edge
        });

        test('handles invalid arrow direction', () => {
            // Start at position 4, invalid arrow (0) in 3x3 grid
            const result = gridMove(4, 0, 3, 3);
            expect(result).toBe(4); // Should stay in same position
        });

        test('handles large arrow values', () => {
            // Start at position 4, large arrow (10) in 3x3 grid
            const result = gridMove(4, 10, 3, 3);
            expect(result).toBe(4); // Should stay in same position
        });

        test('handles negative arrow values', () => {
            // Start at position 4, negative arrow (-10) in 3x3 grid
            const result = gridMove(4, -10, 3, 3);
            expect(result).toBe(4); // Should stay in same position
        });

        test('works with different grid sizes', () => {
            // 2x2 grid
            expect(gridMove(0, 2, 2, 2)).toBe(2);
            expect(gridMove(2, -2, 2, 2)).toBe(0);
            expect(gridMove(0, 1, 2, 2)).toBe(1);
            expect(gridMove(1, -1, 2, 2)).toBe(0);

            // 4x4 grid
            expect(gridMove(0, 2, 4, 4)).toBe(4);
            expect(gridMove(4, -2, 4, 4)).toBe(0);
            expect(gridMove(0, 1, 4, 4)).toBe(1);
            expect(gridMove(1, -1, 4, 4)).toBe(0);
        });

        test('handles edge cases with wrapping', () => {
            // 1x1 grid - should always return 0
            expect(gridMove(0, 2, 1, 1)).toBe(0);
            expect(gridMove(0, -2, 1, 1)).toBe(0);
            expect(gridMove(0, 1, 1, 1)).toBe(0);
            expect(gridMove(0, -1, 1, 1)).toBe(0);
        });

        test('handles large grid positions', () => {
            // Large grid (10x10)
            expect(gridMove(0, 2, 10, 10)).toBe(10);
            expect(gridMove(10, -2, 10, 10)).toBe(0);
            expect(gridMove(0, 1, 10, 10)).toBe(1);
            expect(gridMove(1, -1, 10, 10)).toBe(0);
        });

        test('handles negative start positions', () => {
            // Negative start position should be handled by modulo
            expect(gridMove(-1, 2, 3, 3)).toBe(2); // (-1 + 9) % 9 = 8, then +3 = 11, then 11 % 9 = 2
            expect(gridMove(-3, 1, 3, 3)).toBe(7); // (-3 + 9) % 9 = 6, then +1 = 7, then 7 % 9 = 7
        });

        test('handles start positions larger than grid', () => {
            // Start position larger than grid should be handled by modulo
            expect(gridMove(10, 2, 3, 3)).toBe(4); // 10 % 9 = 1, then +3 = 4, then 4 % 9 = 4
            expect(gridMove(15, -1, 3, 3)).toBe(8); // 15 % 9 = 6, then -1 = 5, then 5 % 9 = 5
        });
    });

    describe('Integration Tests', () => {
        test('getSpace and convertPixels work together', () => {
            const size = 20;
            const space = getSpace(size);
            const result = convertPixels(size, 400, 600);

            expect(space).toBe(1);
            expect(result.rows).toBe(1);
            expect(result.cols).toBe(1);
        });

        test('getDirection and gridMove work together', () => {
            const direction = getDirection('ArrowRight');
            const result = gridMove(0, direction, 3, 3);

            expect(direction).toBe(1);
            expect(result).toBe(1);
        });

        test('complete movement sequence', () => {
            // Start at position 4 (center of 3x3 grid)
            let position = 4;

            // Move right
            position = gridMove(position, getDirection('ArrowRight'), 3, 3);
            expect(position).toBe(5);

            // Move down
            position = gridMove(position, getDirection('ArrowDown'), 3, 3);
            expect(position).toBe(8);

            // Move left
            position = gridMove(position, getDirection('ArrowLeft'), 3, 3);
            expect(position).toBe(7);

            // Move up
            position = gridMove(position, getDirection('ArrowUp'), 3, 3);
            expect(position).toBe(4);
        });

        test('wrapping movement sequence', () => {
            // Start at position 0 (top-left of 3x3 grid)
            let position = 0;

            // Move up (should wrap to bottom)
            position = gridMove(position, getDirection('ArrowUp'), 3, 3);
            expect(position).toBe(6);

            // Move left (should wrap to right edge)
            position = gridMove(position, getDirection('ArrowLeft'), 3, 3);
            expect(position).toBe(8);

            // Move down (should wrap to top)
            position = gridMove(position, getDirection('ArrowDown'), 3, 3);
            expect(position).toBe(2);

            // Move right (should wrap to left edge)
            position = gridMove(position, getDirection('ArrowRight'), 3, 3);
            expect(position).toBe(0);
        });
    });

    describe('Error Handling', () => {
        test('handles zero grid dimensions', () => {
            expect(() => gridMove(0, 1, 0, 0)).not.toThrow();
            expect(() => convertPixels(20, 0, 0)).not.toThrow();
        });

        test('handles negative grid dimensions', () => {
            expect(() => gridMove(0, 1, -1, -1)).not.toThrow();
            expect(() => convertPixels(20, -100, -100)).not.toThrow();
        });

        test('handles undefined/null inputs gracefully', () => {
            expect(() => getDirection(undefined)).toThrow();
            expect(() => getDirection(null)).toThrow();
            expect(() => getSpace(undefined)).not.toThrow();
            expect(() => getSpace(null)).not.toThrow();
        });
    });
});

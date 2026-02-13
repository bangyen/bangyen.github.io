import { describe, it, expect } from 'vitest';

import type { Palette } from '../../../components/Board';
import { getBoardIconFrames, getInputIconFrames } from '../animationFrames';

describe('animationFrames', () => {
    const palette: Palette = {
        primary: 'red',
        secondary: 'blue',
    };

    describe('getBoardIconFrames', () => {
        it('should generate empty frames if no states provided', () => {
            const result = getBoardIconFrames([], 0, 0, 3, palette);
            expect(result).toEqual({});
        });

        it('should generate hidden frames when no match', () => {
            const states = [[0, 0, 0]];
            const result = getBoardIconFrames(states, 0, 0, 3, palette);
            // With length 1, stepSize is 100
            expect(result['0%']).toEqual({
                opacity: 0,
                content: '""',
                color: palette.secondary,
                transform: 'scale(0.5)',
            });
        });

        it('should generate animation frames when match found', () => {
            // State k: all zeros
            // State k+1: top-left (0,0) and its neighbors flipped
            // Adjacency for (0,0) in 3x3: 0, 1 and row 1 col 0.
            // Row 0: 000 -> 011 (binary 3)
            // Row 1: 000 -> 001 (binary 1)
            // Row 2: 000 -> 000 (binary 0)
            const states = [
                [0, 0, 0], // State 0
                [3, 1, 0], // State 1
            ];

            // Checking cell (0,0)
            const result = getBoardIconFrames(states, 0, 0, 3, palette);

            // With length 2, stepSize is 50.
            expect(result['0%']!.opacity).toBe(0);
            expect(result['0%']!.content).toBe('"1"');
            expect(result['5%']!.opacity).toBe(1); // 0 + 50 * (0.1/1) = 5
            expect(result['50%']!.opacity).toBe(0);
        });
    });

    it('should generate animation frames with primary color when light is off', () => {
        // currentState[row] has bit at col as 0
        // but predicted matches nextState
        // (0,0) flip in 2x2. Adj: row 0 col 0, row 0 col 1, row 1 col 0.
        // Row 0: 00 -> 11 (3). Row 1: 00 -> 01 (1).
        const states = [
            [0, 0], // State 0: light (0,0) is OFF
            [3, 1], // State 1: flip at (0,0)
        ];

        const result = getBoardIconFrames(states, 0, 0, 2, palette);
        expect(result['0%']!.color).toBe(palette.primary);
        expect(result['0%']!.content).toBe('"1"');
    });

    it('should handle speed parameter', () => {
        const states = [
            [0, 0],
            [3, 1],
        ];
        const result = getBoardIconFrames(states, 0, 0, 2, palette, 0.5);
        // stepSize is 50. 0 + 50 * (0.1/0.5) = 10
        expect(result['10%']!.opacity).toBe(1);
    });

    it('should handle last state (nextState is null)', () => {
        const states = [[0, 0]];
        const result = getBoardIconFrames(states, 0, 0, 2, palette);
        // match should be false
        expect(result['0%']!.content).toBe('""');
    });

    it('should handle non-matching prediction', () => {
        const states = [
            [0, 0], // State 0
            [0, 0], // State 1: should have been [3, 1] to match
        ];
        const result = getBoardIconFrames(states, 0, 0, 2, palette);
        expect(result['0%']!.content).toBe('""');
    });
    describe('getInputIconFrames', () => {
        it('should generate hidden frames when input does not change', () => {
            const states = [
                [0, 0],
                [0, 0],
            ];

            const result = getInputIconFrames(states, 0, palette);
            expect(result['0%']!.content).toBe('""');
        });

        it('should generate frames with different colors for input', () => {
            const states = [
                [1, 0], // bit at 0 is 1
                [0, 0], // bit at 0 changes
            ];
            const result = getInputIconFrames(states, 0, palette);
            expect(result['0%']!.color).toBe(palette.secondary); // isOne = true
            expect(result['0%']!.content).toBe('"1"');

            const states2 = [
                [0, 0], // bit at 0 is 0
                [1, 0], // bit at 0 changes
            ];
            const result2 = getInputIconFrames(states2, 0, palette);
            expect(result2['0%']!.color).toBe(palette.primary);
        });

        it('should handle last state in input', () => {
            const states = [[1, 0]];
            const result = getInputIconFrames(states, 0, palette);
            expect(result['0%']!.content).toBe('""');
        });
    });
});

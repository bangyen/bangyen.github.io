import { describe, it, expect } from 'vitest';

import { Palette } from '../../../components/Board';
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

    describe('getInputIconFrames', () => {
        it('should generate frames for input state changes', () => {
            const states = [
                [0, 0], // State 0
                [1, 0], // State 1
            ];

            const result = getInputIconFrames(states, 0, palette);

            expect(result['0%']!.content).toBe('"1"');
            expect(result['0%']!.opacity).toBe(0);
            // Speed 2, stepSize 50. 0 + 50 * (0.1/2) = 2.5
            expect(result['2.5%']!.opacity).toBe(1);
        });
    });
});

import { describe, it, expect } from 'vitest';

import { calculateBoardSize } from '../useResponsiveBoardSize';

describe('calculateBoardSize', () => {
    const defaultConfig = {
        rows: 5,
        cols: 5,
        width: 1000,
        height: 1000,
        mobile: false,
        headerOffset: { mobile: 50, desktop: 100 },
        paddingOffset: 20 as number | { x: number; y: number },
        boardMaxWidth: 1200,
        boardSizeFactor: 0.9,
        maxCellSize: 100,
        remBase: 16,
    };

    it('should calculate cell size with numeric paddingOffset', () => {
        const result = calculateBoardSize(defaultConfig);

        // pX = 0, pY = 20
        // maxW = (1000 - 0) * 0.9 = 900
        // maxH = (1000 - 100 - 20) * 0.9 = 880 * 0.9 = 792
        // pxSize = min(900/5, 792/5, 100) = min(180, 158.4, 100) = 100
        // 100 / 16 = 6.25
        expect(result).toBe(6.25);
    });

    it('should calculate cell size with object paddingOffset', () => {
        const result = calculateBoardSize({
            ...defaultConfig,
            paddingOffset: { x: 50, y: 100 },
        });

        // pX = 50, pY = 100
        // maxW = (1000 - 50) * 0.9 = 855
        // maxH = (1000 - 100 - 100) * 0.9 = 800 * 0.9 = 720
        // pxSize = min(855/5, 720/5, 100) = min(171, 144, 100) = 100
        // 100 / 16 = 6.25
        expect(result).toBe(6.25);
    });

    it('should respect mobile headerOffset', () => {
        const result = calculateBoardSize({
            ...defaultConfig,
            width: 400,
            height: 600,
            mobile: true,
            paddingOffset: 0,
        });

        // pX=0, pY=0
        // currentHeaderOffset = 50 (mobile)
        // maxW = (400 - 0) * 0.9 = 360
        // maxH = (600 - 50 - 0) * 0.9 = 550 * 0.9 = 495
        // pxSize = min(360/5, 495/5, 100) = min(72, 99, 100) = 72
        // 72 / 16 = 4.5
        expect(result).toBe(4.5);
    });
});

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useCanvas, resolveColor, lerp, lerpRgb, rgbToCss } from '../useCanvas';

describe('useCanvas', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'ResizeObserver',
            vi.fn().mockImplementation(() => ({
                observe: vi.fn(),
                unobserve: vi.fn(),
                disconnect: vi.fn(),
            })),
        );

        vi.stubGlobal(
            'requestAnimationFrame',
            vi.fn().mockImplementation((cb: FrameRequestCallback) => {
                setTimeout(() => {
                    cb(performance.now());
                }, 0);
            }),
        );
        vi.stubGlobal(
            'cancelAnimationFrame',
            vi.fn().mockImplementation((id: number) => {
                clearTimeout(id);
            }),
        );
    });

    it('returns a ref', () => {
        const { result } = renderHook(() =>
            useCanvas({ onRender: vi.fn(), dependencies: [] }),
        );
        expect(result.current).toHaveProperty('current');
    });

    it('handles color utilities correctly', () => {
        expect(lerp(0, 10, 0.5)).toBe(5);
        expect(rgbToCss({ r: 255, g: 0, b: 0 })).toBe('rgb(255, 0, 0)');

        const start = { r: 0, g: 0, b: 0 };
        const end = { r: 255, g: 255, b: 255 };
        expect(lerpRgb(start, end, 0.5)).toEqual({
            r: 127.5,
            g: 127.5,
            b: 127.5,
        });
    });

    it('resolveColor handles var()', () => {
        // Mock getComputedStyle
        vi.stubGlobal(
            'getComputedStyle',
            vi.fn().mockReturnValue({
                getPropertyValue: vi.fn().mockReturnValue('#ffffff'),
            }),
        );

        expect(resolveColor('var(--test)')).toBe('#ffffff');
        expect(resolveColor('red')).toBe('red');
    });
});

import { useRef, useEffect, useCallback } from 'react';

interface UseCanvasOptions {
    onRender: (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
    ) => void;
    dependencies: unknown[];
}

/**
 * A hook that manages a canvas element's lifecycle and rendering.
 */
export function useCanvas({
    onRender,
    dependencies: _dependencies,
}: UseCanvasOptions) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = globalThis.window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        const targetWidth = Math.round(rect.width * dpr);
        const targetHeight = Math.round(rect.height * dpr);

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }

        // Always set scale and clean clear to be sure
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        onRender(ctx, rect.width, rect.height);
    }, [onRender]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeObserver = new ResizeObserver(() => {
            render();
        });

        resizeObserver.observe(canvas);

        return () => {
            resizeObserver.disconnect();
        };
    }, [render]);

    useEffect(() => {
        let animationFrameId: number;

        const loop = () => {
            render();
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [render]);

    return canvasRef;
}

/**
 * Utility to resolve CSS variables to actual colors.
 */
export function resolveColor(color: string): string {
    if (typeof window === 'undefined') return color; // eslint-disable-line unicorn/prefer-global-this
    if (color.startsWith('var(')) {
        const varName = color.slice(4, -1);
        return getComputedStyle(document.documentElement)
            .getPropertyValue(varName)
            .trim();
    }
    return color;
}

// Color Utilities for Canvas
export interface RGB {
    r: number;
    g: number;
    b: number;
}

const colorCache = new Map<string, RGB>();
let sharedCtx: CanvasRenderingContext2D | null = null;

export const parseColor = (color: string): RGB => {
    const cached = colorCache.get(color);
    if (cached) return cached;

    if (!sharedCtx && typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        sharedCtx = canvas.getContext('2d', { willReadFrequently: true });
    }
    if (!sharedCtx) return { r: 0, g: 0, b: 0 };

    sharedCtx.fillStyle = color;
    sharedCtx.fillRect(0, 0, 1, 1);
    const data = sharedCtx.getImageData(0, 0, 1, 1).data;
    const res = { r: data[0] || 0, g: data[1] || 0, b: data[2] || 0 };
    colorCache.set(color, res);
    return res;
};

export const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

export const lerpRgb = (start: RGB, end: RGB, t: number): RGB => ({
    r: lerp(start.r, end.r, t),
    g: lerp(start.g, end.g, t),
    b: lerp(start.b, end.b, t),
});

export const rgbToCss = ({ r, g, b }: RGB) =>
    `rgb(${String(Math.round(r))}, ${String(Math.round(g))}, ${String(Math.round(b))})`;

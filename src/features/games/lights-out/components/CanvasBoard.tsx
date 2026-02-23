import React, { useRef, useEffect } from 'react';

import type { Palette } from '../types';

interface CanvasBoardProps {
    grid: number[][];
    palette: Palette;
    size: number; // in rem
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

const parseColor = (color: string): RGB => {
    // We use an offscreen canvas to parse any CSS color (hex, hsl, rgb, name)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { r: 0, g: 0, b: 0 };
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return { r: data[0] || 0, g: data[1] || 0, b: data[2] || 0 };
};

const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

const lerpRgb = (start: RGB, end: RGB, t: number): RGB => ({
    r: lerp(start.r, end.r, t),
    g: lerp(start.g, end.g, t),
    b: lerp(start.b, end.b, t),
});

const rgbToCss = ({ r, g, b }: RGB) =>
    `rgb(${String(Math.round(r))}, ${String(Math.round(g))}, ${String(Math.round(b))})`;

export function CanvasBoard({
    grid,
    palette,
    size: remSize,
}: CanvasBoardProps): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const pxScale = 40;
    const size = remSize * pxScale;
    const maxR = size * 0.25;

    // Animation state refs
    const currentColors = useRef<RGB[][]>([]);
    const targetColors = useRef<RGB[][]>([]);
    const currentCorners = useRef<number[][][]>([]);
    const targetCorners = useRef<number[][][]>([]);
    const currentBgColors = useRef<RGB[][]>([]);
    const targetBgColors = useRef<RGB[][]>([]);
    const currentBgCorners = useRef<number[][][]>([]);
    const targetBgCorners = useRef<number[][][]>([]);

    const animationRef = useRef<number>(0);

    // Initialization and Target Updates
    useEffect(() => {
        const colorGridRGB = grid.map(row =>
            row.map(cell =>
                parseColor(cell === 1 ? palette.primary : palette.secondary),
            ),
        );

        targetColors.current = colorGridRGB;
        // Ensure currentColors matches target dimensions
        if (
            currentColors.current.length !== colorGridRGB.length ||
            currentColors.current[0]?.length !== colorGridRGB[0]?.length
        ) {
            currentColors.current = structuredClone(colorGridRGB);
        }

        // Background calculation
        const hasBackground = rows > 1 && cols > 1;
        const colorGridStrings = grid.map(row =>
            row.map(cell => (cell === 1 ? palette.primary : palette.secondary)),
        );

        const bgColorsRGB: RGB[][] = [];
        if (hasBackground) {
            for (let y = 0; y < rows - 1; y++) {
                bgColorsRGB[y] = [];
                const rowStrings = colorGridStrings[y];
                const nextRowStrings = colorGridStrings[y + 1];
                if (!rowStrings || !nextRowStrings) continue;

                for (let x = 0; x < cols - 1; x++) {
                    const cluster = [
                        rowStrings[x],
                        rowStrings[x + 1],
                        nextRowStrings[x],
                        nextRowStrings[x + 1],
                    ].filter((c): c is string => c !== undefined);

                    const counts: Record<string, number> = {};
                    for (const c of cluster) {
                        counts[c] = (counts[c] || 0) + 1;
                    }

                    const dominantColor = Object.keys(counts).find(
                        c => (counts[c] ?? 0) >= 3,
                    );
                    const backgroundColor = bgColorsRGB[y];
                    if (backgroundColor) {
                        backgroundColor[x] = parseColor(
                            dominantColor || palette.secondary,
                        );
                    }
                }
            }
        }
        targetBgColors.current = bgColorsRGB;
        if (
            currentBgColors.current.length !== bgColorsRGB.length ||
            currentBgColors.current[0]?.length !== bgColorsRGB[0]?.length
        ) {
            currentBgColors.current = structuredClone(bgColorsRGB);
        }

        // Corner targets
        const getCorners = (layerGrid: RGB[][], y: number, x: number) => {
            const current = layerGrid[y]?.[x];
            if (!current) return [maxR, maxR, maxR, maxR];
            const isSame = (r1?: RGB, r2?: RGB) =>
                r1?.r === r2?.r && r1?.g === r2?.g && r1?.b === r2?.b;
            const up = isSame(layerGrid[y - 1]?.[x], current);
            const down = isSame(layerGrid[y + 1]?.[x], current);
            const left = isSame(layerGrid[y]?.[x - 1], current);
            const right = isSame(layerGrid[y]?.[x + 1], current);

            return [
                up || left ? 0 : maxR,
                up || right ? 0 : maxR,
                down || right ? 0 : maxR,
                down || left ? 0 : maxR,
            ];
        };

        const newTargetCorners = colorGridRGB.map((row, y) =>
            row.map((_, x) => getCorners(colorGridRGB, y, x)),
        );
        targetCorners.current = newTargetCorners;
        if (
            currentCorners.current.length !== newTargetCorners.length ||
            currentCorners.current[0]?.length !== newTargetCorners[0]?.length
        ) {
            currentCorners.current = structuredClone(newTargetCorners);
        }

        const newTargetBgCorners = bgColorsRGB.map((row, y) =>
            row.map((_, x) => getCorners(bgColorsRGB, y, x)),
        );
        targetBgCorners.current = newTargetBgCorners;
        if (
            currentBgCorners.current.length !== newTargetBgCorners.length ||
            currentBgCorners.current[0]?.length !==
                newTargetBgCorners[0]?.length
        ) {
            currentBgCorners.current = structuredClone(newTargetBgCorners);
        }
    }, [grid, palette, rows, cols, maxR]);

    // Animation Loop
    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const lerpFactor = 0.2; // Speed of transition

            const updateLayer = (
                currentLColors: RGB[][],
                targetLColors: RGB[][],
                currentLCorners: number[][][],
                targetLCorners: number[][][],
                offset: number,
            ) => {
                for (const [y, rowColors] of targetLColors.entries()) {
                    const curRowColors = currentLColors[y];
                    const curRowCorners = currentLCorners[y];
                    const targetRowCorners = targetLCorners[y];

                    if (!curRowColors || !curRowCorners || !targetRowCorners)
                        continue;

                    for (const [x, targetColor] of rowColors.entries()) {
                        const curColor = curRowColors[x];
                        const targetCellCorners = targetRowCorners[x];
                        const curCellCorners = curRowCorners[x];

                        if (!curColor || !targetCellCorners || !curCellCorners)
                            continue;

                        // Interpolate Color
                        curRowColors[x] = lerpRgb(
                            curColor,
                            targetColor,
                            lerpFactor,
                        );

                        // Interpolate Corners
                        for (let i = 0; i < 4; i++) {
                            const tc = targetCellCorners[i];
                            const cc = curCellCorners[i];
                            if (tc !== undefined && cc !== undefined) {
                                curCellCorners[i] = lerp(cc, tc, lerpFactor);
                            }
                        }

                        ctx.beginPath();
                        ctx.roundRect(
                            x * size + offset,
                            y * size + offset,
                            size + 1,
                            size + 1,
                            curCellCorners as [number, number, number, number],
                        );
                        ctx.fillStyle = rgbToCss(curRowColors[x]);
                        ctx.fill();
                    }
                }
            };

            if (rows > 1 && cols > 1) {
                updateLayer(
                    currentBgColors.current,
                    targetBgColors.current,
                    currentBgCorners.current,
                    targetBgCorners.current,
                    size / 2,
                );
            }
            updateLayer(
                currentColors.current,
                targetColors.current,
                currentCorners.current,
                targetCorners.current,
                0,
            );

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [size, rows, cols, maxR]);

    return (
        <canvas
            ref={canvasRef}
            data-testid="canvas-board"
            width={size * cols}
            height={size * rows}
            style={{
                display: 'block',
                width: `${String(remSize * cols)}rem`,
                height: `${String(remSize * rows)}rem`,
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        />
    );
}

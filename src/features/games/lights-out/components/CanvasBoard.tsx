import React, { useRef, useEffect, useCallback } from 'react';

import type { Palette } from '../types';

import {
    useCanvas,
    parseColor,
    lerpRgb,
    rgbToCss,
    type RGB,
} from '@/features/games/hooks/useCanvas';

interface CanvasBoardProps {
    grid: number[][];
    palette: Palette;
    size: number; // in rem (height)
    width?: number; // in rem (optional, defaults to size)
}

export function CanvasBoard({
    grid,
    palette,
    size: remHeight,
    width: remWidth,
}: CanvasBoardProps): React.ReactElement {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;

    // Animation state refs
    const currentColors = useRef<RGB[][]>([]);
    const targetColors = useRef<RGB[][]>([]);
    const currentCorners = useRef<number[][][]>([]);
    const targetCorners = useRef<number[][][]>([]);
    const currentBgColors = useRef<RGB[][]>([]);
    const targetBgColors = useRef<RGB[][]>([]);
    const currentBgCorners = useRef<number[][][]>([]);
    const targetBgCorners = useRef<number[][][]>([]);

    // Initialization and Target Updates
    useEffect(() => {
        const cellSizeRemH = remHeight;
        const cellSizeRemW = remWidth ?? remHeight;

        const pxScale = 40;
        const h = cellSizeRemH * pxScale;
        const w = cellSizeRemW * pxScale;
        const maxR = Math.min(w, h) * 0.35;

        const colorGridRGB = grid.map(row =>
            row.map(cell =>
                parseColor(cell === 1 ? palette.primary : palette.secondary),
            ),
        );

        targetColors.current = colorGridRGB;
        if (currentColors.current.length !== colorGridRGB.length) {
            currentColors.current = structuredClone(colorGridRGB);
        }

        const hasBackground = rows > 1 && cols > 1;
        const colorGridStrings = grid.map(row =>
            row.map(cell => (cell === 1 ? palette.primary : palette.secondary)),
        );

        const bgColorsRGB: RGB[][] = [];
        if (hasBackground) {
            for (let y = 0; y < rows - 1; y++) {
                const row: RGB[] = [];
                for (let x = 0; x < cols - 1; x++) {
                    const cluster = [
                        colorGridStrings[y]?.[x],
                        colorGridStrings[y]?.[x + 1],
                        colorGridStrings[y + 1]?.[x],
                        colorGridStrings[y + 1]?.[x + 1],
                    ].filter((c): c is string => c !== undefined);

                    const counts: Record<string, number> = {};
                    for (const c of cluster) counts[c] = (counts[c] || 0) + 1;

                    const dominantColor = Object.keys(counts).find(
                        c => (counts[c] ?? 0) >= 3,
                    );
                    row.push(parseColor(dominantColor || palette.secondary));
                }
                bgColorsRGB.push(row);
            }
        }
        targetBgColors.current = bgColorsRGB;
        if (currentBgColors.current.length !== bgColorsRGB.length) {
            currentBgColors.current = structuredClone(bgColorsRGB);
        }

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

        targetCorners.current = colorGridRGB.map((row, y) =>
            row.map((_, x) => getCorners(colorGridRGB, y, x)),
        );
        if (currentCorners.current.length !== targetCorners.current.length) {
            currentCorners.current = structuredClone(targetCorners.current);
        }

        targetBgCorners.current = bgColorsRGB.map((row, y) =>
            row.map((_, x) => getCorners(bgColorsRGB, y, x)),
        );
        if (
            currentBgCorners.current.length !== targetBgCorners.current.length
        ) {
            currentBgCorners.current = structuredClone(targetBgCorners.current);
        }
    }, [grid, palette, rows, cols, remHeight, remWidth]);

    const render = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const lerpFactor = 0.4;

            const totalWidthRem = (remWidth ?? remHeight) * cols;
            const totalHeightRem = remHeight * rows;
            const pxScaleW = width / totalWidthRem;
            const pxScaleH = height / totalHeightRem;

            const drawH = remHeight * pxScaleH;
            const drawW = (remWidth ?? remHeight) * pxScaleW;

            const radiusFactor = drawW / ((remWidth ?? remHeight) * 40);

            const updateLayer = (
                currentLColors: RGB[][],
                targetLColors: RGB[][],
                currentLCorners: number[][][],
                targetLCorners: number[][][],
                offsetX: number,
                offsetY: number,
            ) => {
                for (const [y, rowColors] of targetLColors.entries()) {
                    const curRowColors = currentLColors[y];
                    if (!curRowColors) continue;

                    for (const [x, targetColor] of rowColors.entries()) {
                        const curColor = curRowColors[x];
                        if (!curColor) continue;

                        curRowColors[x] = lerpRgb(
                            curColor,
                            targetColor,
                            lerpFactor,
                        );

                        const targetCellCorners = targetLCorners[y]?.[x];
                        const curCellCorners = currentLCorners[y]?.[x];
                        if (targetCellCorners && curCellCorners) {
                            for (let i = 0; i < 4; i++) {
                                const tc = targetCellCorners[i];
                                const cc = curCellCorners[i];
                                if (tc !== undefined && cc !== undefined) {
                                    curCellCorners[i] =
                                        cc + (tc - cc) * lerpFactor;
                                }
                            }
                        }

                        ctx.beginPath();
                        const scaledCorners = curCellCorners?.map(
                            c => c * radiusFactor,
                        ) as [number, number, number, number];

                        ctx.roundRect(
                            x * drawW + offsetX,
                            y * drawH + offsetY,
                            drawW + 0.5,
                            drawH + 0.5,
                            scaledCorners,
                        );
                        ctx.fillStyle = rgbToCss(curRowColors[x]);
                        ctx.fill();
                    }
                }
            };

            ctx.clearRect(0, 0, width, height);

            if (rows > 1 && cols > 1) {
                updateLayer(
                    currentBgColors.current,
                    targetBgColors.current,
                    currentBgCorners.current,
                    targetBgCorners.current,
                    drawW / 2,
                    drawH / 2,
                );
            }
            updateLayer(
                currentColors.current,
                targetColors.current,
                currentCorners.current,
                targetCorners.current,
                0,
                0,
            );
        },
        [remHeight, remWidth, rows, cols],
    );

    const canvasRef = useCanvas({
        onRender: render,
        dependencies: [render],
    });

    return (
        <canvas
            ref={canvasRef}
            data-testid="canvas-board"
            style={{
                display: 'block',
                width: `${((remWidth ?? remHeight) * cols).toString()}rem`,
                height: `${(remHeight * rows).toString()}rem`,
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        />
    );
}

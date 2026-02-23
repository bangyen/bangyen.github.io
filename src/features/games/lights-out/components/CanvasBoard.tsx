import React, { useRef, useEffect } from 'react';

import type { Palette } from '../types';

interface CanvasBoardProps {
    grid: number[][];
    palette: Palette;
    size: number; // in rem
}

export function CanvasBoard({
    grid,
    palette,
    size: remSize,
}: CanvasBoardProps): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    // Use a fixed scale for internal canvas drawing to ensure sharpness
    const pxScale = 40;
    const size = remSize * pxScale;
    const r = size * 0.25;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Convert state grid to color strings
        // User requested to "swap the colors"
        const colorGrid: string[][] = grid.map(row =>
            row.map(cell => (cell === 1 ? palette.primary : palette.secondary)),
        );

        // 2. Generate Background Colors (only for 2D grids with enough rows/cols)
        const hasBackground = rows > 1 && cols > 1;
        const gridBg: string[][] = [];
        if (hasBackground) {
            for (let y = 0; y < rows - 1; y++) {
                gridBg[y] = [];
                for (let x = 0; x < cols - 1; x++) {
                    const rowY = colorGrid[y];
                    const rowY1 = colorGrid[y + 1];

                    if (!rowY || !rowY1) continue;

                    const cluster = [
                        rowY[x],
                        rowY[x + 1],
                        rowY1[x],
                        rowY1[x + 1],
                    ].filter((c): c is string => c !== undefined);

                    const counts: Record<string, number> = {};
                    cluster.forEach(c => {
                        counts[c] = (counts[c] || 0) + 1;
                    });

                    const dominantColor = Object.keys(counts).find(
                        c => (counts[c] ?? 0) >= 3,
                    );
                    const rowBg = gridBg[y];
                    if (rowBg) {
                        rowBg[x] =
                            dominantColor ||
                            (Math.random() > 0.5
                                ? palette.primary
                                : palette.secondary);
                    }
                }
            }
        }

        const drawLayer = (
            layerGrid: string[][],
            lRows: number,
            lCols: number,
            offset: number,
        ) => {
            for (let y = 0; y < lRows; y++) {
                for (let x = 0; x < lCols; x++) {
                    const current = layerGrid[y]?.[x];
                    if (!current) continue;

                    const up = layerGrid[y - 1]?.[x] === current;
                    const down = layerGrid[y + 1]?.[x] === current;
                    const left = layerGrid[y]?.[x - 1] === current;
                    const right = layerGrid[y]?.[x + 1] === current;

                    const corners = [
                        up || left ? 0 : r,
                        up || right ? 0 : r,
                        down || right ? 0 : r,
                        down || left ? 0 : r,
                    ] as [number, number, number, number];

                    ctx.beginPath();
                    ctx.roundRect(
                        x * size + offset,
                        y * size + offset,
                        size + 1,
                        size + 1,
                        corners,
                    );
                    ctx.fillStyle = current;
                    ctx.fill();
                }
            }
        };

        if (hasBackground) {
            drawLayer(gridBg, rows - 1, cols - 1, size / 2);
        }
        drawLayer(colorGrid, rows, cols, 0);
    }, [grid, palette, size, rows, cols, r]);

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

import React, { useRef, useEffect, useCallback } from 'react';

import { SLANT_STYLES } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD } from '../types';

import { COLORS } from '@/config/theme';
import { useCanvas, resolveColor } from '@/features/games/hooks/useCanvas';

interface SlantCanvasBoardProps {
    grid: CellState[][];
    numbers: (number | null)[][];
    satisfiedNodes: Set<string>;
    activeCell: string | null;
    size: number; // cell size in rem
    lineWidth?: number;
    // Analysis mode specific props
    cellSources?: Map<string, 'user' | 'propagated'>;
    conflictSet?: Set<string>;
    cycleCells?: Set<string>;
    nodeConflictSet?: Set<string>;
}

export function SlantCanvasBoard({
    grid,
    numbers,
    satisfiedNodes,
    activeCell,
    size: remSize,
    lineWidth,
    cellSources,
    conflictSet,
    cycleCells,
    nodeConflictSet,
}: SlantCanvasBoardProps): React.ReactElement {
    const slashBirthdays = useRef<Map<string, number>>(new Map());
    const prevGrid = useRef<CellState[][]>([]);

    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;

    const numRows = numbers.length;
    const numCols = numbers[0]?.length ?? 0;

    // Track when slashes are added to animate them
    useEffect(() => {
        grid.forEach((row, r) => {
            row.forEach((value, c) => {
                const pos = `${r.toString()},${c.toString()}`;
                const prevValue = prevGrid.current[r]?.[c];
                if (value !== prevValue && value !== 0) {
                    slashBirthdays.current.set(pos, performance.now());
                } else if (value === 0) {
                    slashBirthdays.current.delete(pos);
                }
            });
        });
        prevGrid.current = grid.map(row => [...row]);
    }, [grid]);

    const render = useCallback(
        (ctx: CanvasRenderingContext2D, width: number) => {
            const spaceRem = 0.3;
            const paddingRem = remSize * 0.6;

            // Calculate pxScale dynamically to match the CSS layout exactly
            const totalWidthRem = cols * (remSize + spaceRem) + 2 * paddingRem;
            const pxScale = width / totalWidthRem;

            const cellSize = remSize * pxScale;
            const space = spaceRem * pxScale;
            const numberSize = cellSize * 0.4;
            const padding = paddingRem * pxScale;

            const bgColor = resolveColor(SLANT_STYLES.ANALYSIS.BG_SUBTLE);
            const activeColor = resolveColor(COLORS.interactive.hover);
            const lineColor = resolveColor(COLORS.text.primary);
            const nodeBg = resolveColor(COLORS.surface.background);
            const nodeTextDim = resolveColor(COLORS.interactive.disabledText);
            const nodeTextPrimary = resolveColor(COLORS.text.primary);
            const borderColor = resolveColor(COLORS.border.subtle);

            const conflictColor = resolveColor(COLORS.data.red);
            const propagatedColor = resolveColor(COLORS.data.green);
            const userColor = resolveColor(COLORS.primary.main);

            const borderRadius = cellSize / 4;

            ctx.clearRect(
                0,
                0,
                ctx.canvas.width / (window.devicePixelRatio || 1),
                ctx.canvas.height / (window.devicePixelRatio || 1),
            );

            // 1. Draw Cells
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * (cellSize + space) + padding + space / 2;
                    const y = r * (cellSize + space) + padding + space / 2;
                    const pos = `${r.toString()},${c.toString()}`;
                    const isActive = pos === activeCell;

                    ctx.beginPath();
                    ctx.roundRect(x, y, cellSize, cellSize, borderRadius);
                    ctx.fillStyle = isActive ? activeColor : bgColor;
                    ctx.fill();

                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 2 * (pxScale / 16); // Scale line width reasonably
                    ctx.stroke();

                    const value = grid[r]?.[c];
                    if (value === FORWARD || value === BACKWARD) {
                        const now = performance.now();
                        const birthday = slashBirthdays.current.get(pos) || 0;
                        const age = now - birthday;
                        const duration = 150;

                        let scale = 1;
                        let opacity = 1;

                        if (age < duration) {
                            const t = age / duration;
                            scale =
                                t < 0.7
                                    ? 0.5 + (1.1 - 0.5) * (t / 0.7)
                                    : 1.1 + (1 - 1.1) * ((t - 0.7) / 0.3);
                            opacity = Math.min(1, age / (duration * 0.5));
                        }

                        ctx.save();
                        ctx.translate(x + cellSize / 2, y + cellSize / 2);
                        ctx.scale(scale, scale);
                        ctx.globalAlpha = opacity;

                        if (value === FORWARD) {
                            ctx.rotate(-Math.PI / 4);
                        } else {
                            ctx.rotate(Math.PI / 4);
                        }

                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 12 * (pxScale / 16);
                        ctx.shadowOffsetY = 4 * (pxScale / 16);

                        ctx.beginPath();
                        const lineLength = cellSize * 1.1;
                        const strokeWidth = (lineWidth ?? 12) * (pxScale / 40);
                        ctx.roundRect(
                            -lineLength / 2,
                            -strokeWidth / 2,
                            lineLength,
                            strokeWidth,
                            99,
                        );

                        let slashColor = lineColor;
                        if (conflictSet?.has(pos) || cycleCells?.has(pos)) {
                            slashColor = conflictColor;
                        } else {
                            const source = cellSources?.get(pos);
                            if (source === 'user') {
                                slashColor = userColor;
                            } else if (source === 'propagated') {
                                slashColor = propagatedColor;
                            }
                        }

                        ctx.fillStyle = slashColor;
                        ctx.fill();
                        ctx.restore();
                    }
                }
            }

            // 2. Draw Numbers (Nodes)
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `800 ${(numberSize * 0.5).toString()}px Inter, Roboto, sans-serif`;

            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    const value = numbers[r]?.[c];
                    if (value === null || value === undefined) continue;

                    const x = c * (cellSize + space) + padding;
                    const y = r * (cellSize + space) + padding;
                    const pos = `${r.toString()},${c.toString()}`;
                    const isSatisfied = satisfiedNodes.has(pos);
                    const hasConflict = nodeConflictSet?.has(pos);

                    ctx.beginPath();
                    ctx.arc(x, y, numberSize / 2, 0, Math.PI * 2);

                    if (hasConflict) {
                        ctx.save();
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 10 * (pxScale / 16);
                        ctx.shadowOffsetY = 5 * (pxScale / 16);
                        ctx.fillStyle = conflictColor;
                        ctx.fill();
                        ctx.restore();
                    } else {
                        ctx.fillStyle = nodeBg;
                        if (isSatisfied) {
                            ctx.fill();
                        } else {
                            ctx.save();
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 20 * (pxScale / 16);
                            ctx.shadowOffsetY = 10 * (pxScale / 16);
                            ctx.fill();
                            ctx.restore();

                            ctx.strokeStyle = borderColor;
                            ctx.lineWidth = 2 * (pxScale / 16);
                            ctx.stroke();
                        }
                    }

                    let textColor = isSatisfied ? nodeTextDim : nodeTextPrimary;
                    if (hasConflict) textColor = '#FFFFFF';

                    ctx.fillStyle = textColor;
                    ctx.fillText(value.toString(), x, y);
                }
            }
        },
        [
            grid,
            numbers,
            satisfiedNodes,
            activeCell,
            cellSources,
            conflictSet,
            cycleCells,
            nodeConflictSet,
            remSize,
            numRows,
            numCols,
            rows,
            cols,
            lineWidth,
        ],
    );

    const canvasRef = useCanvas({
        onRender: render,
        dependencies: [render],
    });

    const spaceRem = 0.3;
    const paddingRem = remSize * 0.6;
    const totalWidthRem = cols * (remSize + spaceRem) + 2 * paddingRem;
    const totalHeightRem = rows * (remSize + spaceRem) + 2 * paddingRem;

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width: `${totalWidthRem.toString()}rem`,
                height: `${totalHeightRem.toString()}rem`,
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        />
    );
}

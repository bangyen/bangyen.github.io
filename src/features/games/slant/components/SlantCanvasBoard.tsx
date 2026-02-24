import { useTheme } from '@mui/material';
import React, { useRef, useEffect } from 'react';

import { SLANT_STYLES } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD } from '../types';

import { COLORS } from '@/config/theme';

interface SlantCanvasBoardProps {
    grid: CellState[][];
    numbers: (number | null)[][];
    satisfiedNodes: Set<string>;
    activeCell: string | null;
    size: number; // cell size in rem
}

export function SlantCanvasBoard({
    grid,
    numbers,
    satisfiedNodes,
    activeCell,
    size: remSize,
}: SlantCanvasBoardProps): React.ReactElement {
    const theme = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const slashBirthdays = useRef<Map<string, number>>(new Map());
    const prevGrid = useRef<CellState[][]>([]);

    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const pxScale = 40;
    const cellSize = remSize * pxScale;
    const space = 0.2 * pxScale;

    const numRows = numbers.length;
    const numCols = numbers[0]?.length ?? 0;

    // Track when slashes are added to animate them
    useEffect(() => {
        grid.forEach((row, r) => {
            row.forEach((value, c) => {
                const pos = String(r) + ',' + String(c);
                const prevValue = prevGrid.current[r]?.[c];
                // Only set birthday if the slash value changed
                if (value !== prevValue && value !== 0) {
                    slashBirthdays.current.set(pos, performance.now());
                } else if (value === 0) {
                    slashBirthdays.current.delete(pos);
                }
            });
        });
        prevGrid.current = grid.map(row => [...row]);
    }, [grid]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        /**
         * Resolves a CSS color string (including var(--...)) into the final color.
         */
        const resolveColor = (color: string): string => {
            if (color.startsWith('var(')) {
                const varName = color.slice(4, -1);
                return getComputedStyle(document.documentElement)
                    .getPropertyValue(varName)
                    .trim();
            }
            return color;
        };

        const numberSize = cellSize * 0.4;
        const padding = numberSize * 1.5; // Significantly increased padding to prevent shadow clipping

        const totalWidth = cols * cellSize + (cols - 1) * space + 2 * padding;
        const totalHeight = rows * cellSize + (rows - 1) * space + 2 * padding;

        canvas.width = totalWidth;
        canvas.height = totalHeight;

        const bgColor = resolveColor(SLANT_STYLES.ANALYSIS.BG_SUBTLE);
        const activeColor = resolveColor(COLORS.interactive.hover);
        const lineColor = resolveColor(COLORS.text.primary);
        const nodeBg = resolveColor(COLORS.surface.background);
        const nodeTextDim = resolveColor(COLORS.interactive.disabledText);
        const nodeTextPrimary = resolveColor(COLORS.text.primary);
        const borderColor = resolveColor(COLORS.border.subtle);
        const borderRadius = cellSize / 4;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Cells
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * (cellSize + space) + padding;
                    const y = r * (cellSize + space) + padding;
                    const pos = String(r) + ',' + String(c);
                    const isActive = pos === activeCell;

                    // Cell background and border with rounded corners
                    ctx.beginPath();
                    ctx.roundRect(x, y, cellSize, cellSize, borderRadius);
                    ctx.fillStyle = isActive ? activeColor : bgColor;
                    ctx.fill();

                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 5;
                    ctx.stroke();

                    // Draw Slash
                    const gridRow = grid[r];
                    if (!gridRow) continue;
                    const value = gridRow[c];
                    if (value === FORWARD || value === BACKWARD) {
                        const now = performance.now();
                        const birthday = slashBirthdays.current.get(pos) || 0;
                        const age = now - birthday;
                        const duration = 200;

                        let scale = 1;
                        let opacity = 1;

                        if (age < duration) {
                            const t = age / duration;
                            // scale 0.5 -> 1.1 (at t=0.7) -> 1.0 (at t=1.0)
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

                        // Shadow for line
                        ctx.shadowColor =
                            'rgba(0, 0, 0, ' + String(0.4 * opacity) + ')';
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetY = 5;

                        ctx.beginPath();
                        const lineLength = cellSize * 1.1;
                        ctx.roundRect(
                            -lineLength / 2,
                            -6, // Offset centered for thickness 12
                            lineLength,
                            12,
                            99,
                        );
                        ctx.fillStyle = lineColor;
                        ctx.fill();
                        ctx.restore();
                    }
                }
            }

            // 2. Draw Numbers (Nodes)
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font =
                '800 ' +
                String(numberSize * 0.5) +
                'px Inter, Roboto, sans-serif';

            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    const numsRow = numbers[r];
                    if (!numsRow) continue;
                    const value = numsRow[c];
                    if (value === null) continue;

                    const x = c * (cellSize + space) + padding;
                    const y = r * (cellSize + space) + padding;
                    const pos = String(r) + ',' + String(c);
                    const isSatisfied = satisfiedNodes.has(pos);

                    // Node background circle
                    ctx.beginPath();
                    ctx.arc(x, y, numberSize / 2, 0, Math.PI * 2);
                    ctx.fillStyle = nodeBg;

                    if (isSatisfied) {
                        ctx.fill();
                    } else {
                        ctx.save();
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                        ctx.shadowBlur = 20;
                        ctx.shadowOffsetY = 10;
                        ctx.fill();
                        ctx.restore();

                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = 5;
                        ctx.stroke();
                    }

                    // Node text
                    if (value !== undefined) {
                        ctx.fillStyle = isSatisfied
                            ? nodeTextDim
                            : nodeTextPrimary;
                        ctx.fillText(value.toString(), x, y + 1); // Small offset for alignment
                    }
                }
            }

            // Keep animating if there are active animations
            const hasOngoingAnimations = Array.from(
                slashBirthdays.current.values(),
            ).some(birthday => performance.now() - birthday < 200);

            if (hasOngoingAnimations) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [
        grid,
        numbers,
        satisfiedNodes,
        activeCell,
        cellSize,
        space,
        numRows,
        numCols,
        rows,
        cols,
        theme.palette.mode,
    ]);

    const remPadding = remSize * 0.4 * 1.5;
    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width:
                    String(cols * remSize + (cols - 1) * 0.2 + 2 * remPadding) +
                    'rem',
                height:
                    String(rows * remSize + (rows - 1) * 0.2 + 2 * remPadding) +
                    'rem',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
        />
    );
}

import React, { useMemo } from 'react';

import type { Palette } from '../types';
import {
    getBoardIconFrames,
    getInputIconFrames,
} from '../utils/animationFrames';

export interface GridWithKeyframesProps {
    boardStates: number[][];
    inputStates: number[][];
    dims: number;
    id: string;
    palette: Palette;
    children: React.ReactNode;
}

/**
 * Wrapper component that generates CSS keyframe animations for board and input icons
 * Injects <style> tag with dynamically generated @keyframes rules
 */
export function GridWithKeyframes({
    boardStates,
    inputStates,
    dims,
    id,
    palette,
    children,
}: GridWithKeyframesProps) {
    const keyframes = useMemo(() => {
        // Generate keyframes for board cells
        const boardKF = boardStates.flatMap((_, r) =>
            Array.from({ length: dims }, (_, c) => {
                const name = `${id}-board-icon-${String(r)}-${String(c)}`;
                const frames = getBoardIconFrames(
                    boardStates,
                    r,
                    c,
                    dims,
                    palette,
                );
                return { name, frames };
            }),
        );

        // Generate keyframes for input row
        const inputKF = inputStates.flatMap((_, c) => {
            const name = `${id}-input-icon-0-${String(c)}`;
            const frames = getInputIconFrames(inputStates, c, palette);
            return { name, frames };
        });

        return [...boardKF, ...inputKF];
    }, [boardStates, inputStates, dims, id, palette]);

    return (
        <>
            <style>
                {keyframes
                    .map(
                        kf => `
                @keyframes ${kf.name} {
                    ${Object.entries(
                        kf.frames as unknown as Record<
                            string,
                            Record<string, string>
                        >,
                    )
                        .map(
                            ([p, s]) => `
                        ${p} {
                            ${Object.entries(s)
                                .map(
                                    ([k, v]) =>
                                        `${k.replaceAll(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${v};`,
                                )
                                .join(' ')}
                        }
                    `,
                        )
                        .join('')}
                }
            `,
                    )
                    .join('')}
            </style>
            {children}
        </>
    );
}

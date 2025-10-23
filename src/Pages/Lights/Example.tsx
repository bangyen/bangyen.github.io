import React from 'react';
import { Typography, Grid } from '../../components/mui';

import { getStates } from './chaseHandlers';
import { CustomGrid } from '../../helpers';
import { useMobile } from '../../hooks';
import { TYPOGRAPHY } from '../../config/theme';

interface Frame {
    backgroundColor: string;
}

interface GetStatesResult {
    [key: number]: unknown;
}

interface Palette {
    primary: string;
    secondary: string;
}

function getFrames(states: unknown[], palette: Palette): Record<string, Frame> {
    const newStates = [-1, ...states, -1];
    const length = states.length;
    const frames: Record<string, Frame> = {};

    for (let k = 0; k < length + 1; k++) {
        const state = newStates[k];
        const next = newStates[k + 1];

        const value = state !== -1 ? state : next;
        const color = value ? palette.primary : palette.secondary;

        const percent = (100 * k) / length;
        const floor = Math.floor(percent);

        frames[`${floor}%`] = {
            backgroundColor: color,
        };
    }

    return frames;
}

function propHandler(
    states: unknown[],
    getter: (states: unknown[], row: number, col: number) => unknown[],
    palette: Palette,
    id: string
) {
    return (row: number, col: number): Record<string, unknown> => {
        const state = getter(states, row, col);
        const frames = getFrames(state, palette);
        const length = states.length;

        const name = `${id}-${row}-${col}`;
        const index = `@keyframes ${name}`;

        const animation = `
            ${name}
            ${length * 2}s
            steps(1, start)
            infinite
        `;

        const style: Record<string, unknown> = {
            [index]: frames,
            animation,
        };

        return style;
    };
}

interface ExampleProps {
    states?: unknown[];
    getter?: (states: unknown[], row: number, col: number) => unknown[];
    palette: Palette;
    id?: string;
    rows?: number;
    cols?: number;
    size: number;
    dims?: number;
    start?: unknown[];
}

export default function Example({
    states = [],
    getter = (states: unknown[], row: number, col: number) => [],
    palette,
    id = 'default',
    rows = 3,
    cols = 3,
    size,
}: ExampleProps): React.ReactElement {
    const mobile = useMobile('md');

    const height = mobile ? 200 : 300;
    const width = mobile ? 200 : 300;

    const cellProps = propHandler(states, getter, palette, id);

    return (
        <Grid
            container
            spacing={2}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    fontSize: TYPOGRAPHY.fontSize.caption,
                    color: 'text.secondary',
                    marginBottom: 1,
                }}
            >
                Example Animation
            </Typography>
            <Grid
                sx={{
                    width: `${width}px`,
                    height: `${height}px`,
                    position: 'relative',
                }}
            >
                <CustomGrid
                    cellProps={cellProps}
                    size={size}
                    rows={rows}
                    cols={cols}
                />
            </Grid>
        </Grid>
    );
}


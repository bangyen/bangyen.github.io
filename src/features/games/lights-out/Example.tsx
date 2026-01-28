import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '../../../components/mui';
import { getStates } from './chaseHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import {
    useHandler as useBoardHandler,
    Board,
    Palette,
    Getters,
    PropsFactory,
} from '../components/Board';
import { getOutput, useHandler as useCalculatorHandler } from './calculator';
import { COLORS } from '../../../config/theme';

interface ExampleProps {
    palette: Palette;
    size: number;
    dims?: number;
    start?: number[];
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

// Helper functions removed as we pass states directly

export default function Example({
    start = [],
    dims = 3,
    size,
    palette,
    getFrontProps,
    getBackProps,
}: ExampleProps): React.ReactElement {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const states = getStates(start, dims);
    const width = size;

    const { boardStates, inputStates, outputStates } = states;
    const remainder = frame % inputStates.length;

    const gridState = {
        grid: boardStates[remainder],
        rows: dims,
        cols: dims,
    };

    const boardGetters = useBoardHandler(gridState, palette);
    const frontProps = getFrontProps(boardGetters);
    const backProps = getBackProps(boardGetters);

    const inputGetters = useCalculatorHandler(
        inputStates[remainder],
        dims,
        palette
    );
    const outputGetters = useCalculatorHandler(
        outputStates[remainder],
        dims,
        palette
    );
    const inputProps = getOutput(inputGetters);
    const outputProps = getOutput(outputGetters);

    return (
        <Grid container size={12} spacing={2} sx={{ height: '100%' }}>
            <Grid
                container
                size={12}
                wrap="nowrap"
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%',
                }}
            >
                <Grid
                    size={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Board
                        size={width}
                        rows={dims}
                        cols={dims}
                        frontProps={frontProps}
                        backProps={backProps}
                    />
                </Grid>
                <Grid
                    container
                    size={6}
                    spacing={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, color: COLORS.text.secondary }}
                        >
                            Input
                        </Typography>
                        <CustomGrid
                            rows={1}
                            cols={dims}
                            size={width}
                            cellProps={inputProps}
                            space={0}
                        />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <CustomGrid
                            rows={1}
                            cols={dims}
                            size={width}
                            cellProps={outputProps}
                            space={0}
                        />
                        <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, color: COLORS.text.secondary }}
                        >
                            Result
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}

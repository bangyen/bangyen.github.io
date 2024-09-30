import { useState, useCallback, useEffect } from 'react';
import { Backdrop, Typography } from '@mui/material';
import { CircleRounded } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';

import { getProduct } from './matrices';
import { CustomGrid } from '../helpers';
import { useGetters } from './Board';
import Example from './Example';

function getInput(getters, toggleTile) {
    const { getColor, getBorder } = getters;

    return (r, c) => {
        const { front, back }
            = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
            onClick: toggleTile(c),
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back
                }
            },
            color: front,
            children: <CircleRounded />,
        };
    };
}

function getOutput({
    getColor, getBorder}) {

    return (r, c) => {
        const { front }
            = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
        };
    };
}

function useHandler(row, size, palette) {
    const getTile = useCallback(
        (r, c) => {
            if (r !== 0
                    || c < 0
                    || c >= size)
                return -1;

            return row[c];
        }, [row, size]);

    return useGetters(
        getTile, palette);
}

export default function Info(props) {
    const {
        rows,
        cols,
        size,
        open,
        score,
        palette,
        toggleOpen
    } = props;

    const [row, setRow] = useState(
        Array(cols).fill(0));

    useEffect(() => {
        const newRow
            = Array(cols)
                .fill(0);

        setRow(newRow);
    }, [cols]);

    const res = getProduct(
        row, rows, cols);

    const toggleTile = col =>
        event => {
            event.stopPropagation();

            const newRow = [...row];
            newRow[col] ^= 1;
            setRow(newRow);
        };

    const inputGetters  = useHandler(row, cols, palette);
    const outputGetters = useHandler(res, cols, palette);
    const inputProps  = getInput(inputGetters, toggleTile);
    const outputProps = getOutput(outputGetters);

    return (
        <Backdrop
            open={open}
            onClick={toggleOpen}>
            <Grid container
                spacing={4}>
                <Example
                    dims={3}
                    size={size}
                    start={[1, 3, 8]}
                    palette={palette} />
                <Grid size={12}>
                    <CustomGrid
                        space={0}
                        rows={1}
                        cols={cols}
                        size={size * 0.9}
                        cellProps={inputProps} />
                </Grid>
                <Grid size={12}>
                    <CustomGrid
                        space={0}
                        rows={1}
                        cols={cols}
                        size={size * 0.9}
                        cellProps={outputProps} />
                </Grid>
                <Grid
                    size={12}
                    display="flex"
                    justifyContent="center">
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h6',
                                sm: 'h5',
                                md: 'h4'
                            }
                        }}
                        width="75%"
                        margin="auto"
                        textAlign="center">
                        Boards Solved:
                        &nbsp;{score}
                    </Typography>
                </Grid>
            </Grid>
        </Backdrop>
    );
}
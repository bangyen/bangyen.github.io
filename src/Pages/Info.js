import { useState, useCallback, useMemo, useEffect } from 'react';
import { Backdrop, Typography } from '@mui/material';
import { CircleRounded } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';

import { getInverse } from './matrices';
import { CustomGrid } from '../helpers';
import { useGetters } from './Board';

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

function TextBox({ children }) {
    return (
        <Grid
            size={12}
            display="flex"
            justifyContent="center">
            {children}
        </Grid>
    );
}

function Text({ children }) {
    return (
        <Typography
            variant="h4"
            width="75%"
            margin="auto"
            textAlign="center">
            {children}
        </Typography>
    );
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

    const res = useMemo(
        () => getInverse(
            row, rows, cols),
        [row, rows, cols]);

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
                <TextBox>
                    <Grid size={12}>
                        <Text>
                            Make the entire grid&nbsp;
                            <span style={{ color: palette.secondary }}>
                                this
                            </span>
                            &nbsp;color. If you're stuck
                            on the last row, input the last row
                            into the calculator below and press the top row cells
                            corresponding to the output cells of&nbsp;
                            <span style={{ color: palette.primary }}>
                                this
                            </span>
                            &nbsp;color.
                        </Text>
                    </Grid>
                    <Grid size={0}>
                        <Text>
                            hello
                        </Text>
                    </Grid>
                </TextBox>
                <Grid size={12}>
                    <CustomGrid
                        space={0}
                        rows={1}
                        size={size}
                        cols={cols}
                        cellProps={inputProps} />
                </Grid>
                <Grid size={12}>
                    <CustomGrid
                        space={0}
                        rows={1}
                        size={size}
                        cols={cols}
                        cellProps={outputProps} />
                </Grid>
                <TextBox>
                    <Text>
                        Boards Solved:
                        &nbsp;{score}
                    </Text>
                </TextBox>
            </Grid>
        </Backdrop>
    );
}
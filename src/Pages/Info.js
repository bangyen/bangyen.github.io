import { Backdrop, Typography } from '@mui/material';
import { CircleRounded } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

import { CustomGrid } from '../helpers';
import { useGetters } from './Sector';

function getMatrix(r, c) {
    const first = 7 << (c - 2);
    const matrix = [first];

    for (let k = 1; k < c; k++) {
        const prev = matrix[k - 1];
        const next = prev >> 1;
        matrix.push(next);
    }

    for (let k = c; k < r; k++)
        matrix.pop();

    matrix[0] -= 2 ** c;
    return matrix;
}

function countBits(n) {
    let count = 0;

    while (n) {
        n &= n - 1;
        count++;
    }

    return count;
}

function multiplySym(matrixA, matrixB) {
    const size = matrixA.length;
    const output = [];

    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        let outputRow = 0;

        for (let c = 0; c < size; c++) {
            const colB = matrixB[c];
            const value = rowA & colB;
            const count = countBits(value);

            outputRow <<= 1;
            outputRow += count & 1;
        }

        output.push(outputRow);
    }

    return output;
}

function getIdentity(size) {
    const output = Array(size).fill(1);

    for (let r = 0; r < size; r++)
        output[r] <<= (size - r - 1);

    return output;
}

function symmetricPow(matrix, n) {
    const size = matrix.length;
    let output = getIdentity(size);

    for (let k = 0; k < n; k++)
        output = multiplySym(
            output, matrix);

    return output;
}

function addSym(matrixA, matrixB) {
    const size = matrixA.length;
    const output = [];

    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        const rowB = matrixB[r];
        const outputRow = rowA ^ rowB;
        output.push(outputRow);
    }

    return output;
}

function getPolynomial(n) {
    const output = [0, 1];

    for (let k = 1; k < n; k++) {
        const curr = output[k];
        const prev = output[k - 1];
        const double = curr << 1;
        output.push(double ^ prev);
    }

    return output[n];
}

function evalPolynomial(matrix, poly) {
    const size = matrix.length;
    let output = Array(size).fill(0);
    let degree = 0;

    while (poly) {
        if (poly & 1) {
            const power = symmetricPow(
                matrix, degree);
            output = addSym(
                output, power);
        }

        poly >>= 1;
        degree++;
    }

    return output;
}

function sortMatrices(matrix, identity) {
    const size = matrix.length;
    const sorted = [...Array(size).keys()]
        .sort((a, b) => matrix[b] - matrix[a]);

    const original = sorted.map(row => matrix[row]);
    const inverted = sorted.map(row => identity[row]);

    return [original, inverted];
}

function invertMatrix(matrix) {
    const size = matrix.length;
    const identity = getIdentity(size);

    let original = matrix;
    let inverted = identity;

    for (let c = 0; c < size; c++) {
        const pow = 1 << (size - c - 1);

        [original, inverted] = sortMatrices(
            original, inverted);

        for (let r = 0; r < size; r++) {
            const alt = original[r];

            if (r === c)
                continue;

            if (alt & pow) {
                original[r] ^= original[c];
                inverted[r] ^= inverted[c];
            }
        }
    }

    return inverted;
}

function tileHandler(row, size) {
    return (r, c) => {
        if (r !== 0
                || c < 0
                || c >= size)
            return -1;

        return row[c];
    };
}

function useInput(row, size, toggleTile, palette) {
    const getTile = tileHandler(row, size);
    const { getColor, getBorder }
        = useGetters(getTile, palette);

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

function useOutput(row, size, palette) {
    const getTile = tileHandler(row, size);
    const { getColor, getBorder }
        = useGetters(getTile, palette);

    return (r, c) => {
        const { front }
            = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
        };
    };
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

    const matrix     = getMatrix(rows, cols);
    const polynomial = getPolynomial(rows + 1);
    const product    = evalPolynomial(
        matrix, polynomial);
    const inverted   = invertMatrix(product);
    const binary     = parseInt(row.join(''), 2);
    const result     = inverted.map(
        row => {
            const value = row & binary;
            const count = countBits(value);
            return count & 1;
        });

    const toggleTile = col =>
        event => {
            event.stopPropagation();

            const newRow = [...row];
            newRow[col] ^= 1;
            setRow(newRow);
        };

    const inputProps  = useInput(row, cols, toggleTile, palette);
    const outputProps = useOutput(result, cols, palette);

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
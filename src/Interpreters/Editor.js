import { Program, Output, Tape, Register } from './Display';
import { CustomGrid } from '../helpers';
import Grid from '@mui/material/Grid2';
import { Toolbar } from './Toolbar';

import { Typography, TextField } from '@mui/material';

import React, { createContext, useContext } from 'react';

export const EditorContext = createContext();

export default function Editor({ container, sideProps, hide, children }) {
    const { name } = useContext(EditorContext);

    const rightProps = { xs: 6, sm: 4 };
    let display, leftProps;

    if (hide) {
        display = 'none';
        leftProps = 12;
    } else {
        leftProps = { xs: 6, sm: 8 };
        display = 'flex';
    }

    const titleProps = {
        size: 'grow',
        sx: {
            display: {
                xs: 'none',
                md: 'block',
            },
        },
    };

    const contentProps = {
        flex: 1,
        spacing: 2,
        ref: container,
        container: true,
        display: 'flex',
        alignItems: 'center',
        sx: { overflowY: 'auto' },
    };

    return (
        <Grid
            container
            spacing={2}
            height="100vh"
            display="flex"
            flexDirection="column"
            padding="5vh 5vw 5vh 5vw"
            sx={{
                background:
                    'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
            }}
        >
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid {...titleProps}>
                    <Typography variant="h2">{name}</Typography>
                </Grid>
                <Toolbar />
            </Grid>
            <Grid {...contentProps}>
                <Grid size={leftProps}>{children}</Grid>
                <Grid display={display} size={rightProps}>
                    <TextArea {...sideProps} />
                </Grid>
            </Grid>
            <Program />
            <Output />
            <Tape />
            <Register />
        </Grid>
    );
}

export function GridArea({ handleClick, chooseColor, options, rows, cols }) {
    const { size } = useContext(EditorContext);

    const cellProps = (row, col) => {
        const pos = cols * row + col;
        const color = chooseColor(pos);
        const value = options[pos];

        const text = `${color}.contrastText`;
        const select = `${color}.light`;
        const hover = `${color}.main`;

        return {
            color: text,
            backgroundColor: select,
            onClick: handleClick(pos),
            children: <Text text={value} />,
            sx: {
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: hover,
                },
            },
        };
    };

    return (
        <CustomGrid cellProps={cellProps} size={size} rows={rows} cols={cols} />
    );
}

export function TextArea({
    value,
    readOnly,
    infoLabel,
    fillValue,
    handleChange,
}) {
    const { height } = useContext(EditorContext);
    const rows = Math.floor(height / 32);

    fillValue = fillValue || 'Hello, World!';
    infoLabel = infoLabel || 'Program code';
    readOnly = readOnly || false;

    return (
        <TextField
            variant="outlined"
            label={infoLabel}
            defaultValue={fillValue}
            slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { readOnly },
            }}
            fullWidth
            multiline
            rows={rows}
            value={value}
            onChange={handleChange}
            sx={{
                '& .MuiInputBase-root': {
                    alignItems: 'flex-start',
                    backgroundColor: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    color: 'text.primary',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                },
            }}
        />
    );
}

export function Text({ text, ...props }) {
    return (
        <Typography {...props} variant="h4">
            {text}
        </Typography>
    );
}

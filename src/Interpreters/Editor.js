import { Program, Output, Tape, Register } from './Display';
import { CustomGrid } from '../helpers';
import Grid from '@mui/material/Grid2';
import { Toolbar } from './Toolbar';

import { Typography, TextField } from '@mui/material';

import React, { createContext, useContext } from 'react';

export const EditorContext = createContext();

export default function Editor({ container, sideProps, hide, children }) {
    const { name, tapeFlag, outFlag, regFlag, code } =
        useContext(EditorContext);

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
                background: '#0a0a0a',
                position: 'relative',
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
            <Grid container spacing={2}>
                {(() => {
                    const fields = [];
                    const fieldCount = [
                        code !== undefined,
                        tapeFlag,
                        outFlag,
                        regFlag,
                    ].filter(Boolean).length;
                    const gridSize =
                        fieldCount === 1
                            ? { xs: 12, sm: 12 }
                            : { xs: 12, sm: 6 };

                    if (code !== undefined) {
                        fields.push(
                            <Grid key="program" size={gridSize}>
                                <Program />
                            </Grid>
                        );
                    }
                    if (tapeFlag) {
                        fields.push(
                            <Grid key="tape" size={gridSize}>
                                <Tape />
                            </Grid>
                        );
                    }
                    if (outFlag) {
                        fields.push(
                            <Grid key="output" size={gridSize}>
                                <Output />
                            </Grid>
                        );
                    }
                    if (regFlag) {
                        fields.push(
                            <Grid key="register" size={gridSize}>
                                <Register />
                            </Grid>
                        );
                    }

                    return fields;
                })()}
            </Grid>
        </Grid>
    );
}

export function GridArea({ handleClick, chooseColor, options, rows, cols }) {
    const { size } = useContext(EditorContext);

    const cellProps = (row, col) => {
        const pos = cols * row + col;
        const color = chooseColor(pos);
        const value = options[pos];

        // Homepage-style color scheme
        const getCellStyles = color => {
            const styles = {
                primary: {
                    bg: 'rgba(128, 128, 128, 0.1)',
                    text: 'primary.light',
                    border: '1px solid rgba(25, 118, 210, 0.3)',
                    hover: 'rgba(128, 128, 128, 0.15)',
                },
                info: {
                    bg: 'rgba(128, 128, 128, 0.08)',
                    text: 'secondary.light',
                    border: '1px solid rgba(128, 128, 128, 0.3)',
                    hover: 'rgba(128, 128, 128, 0.12)',
                },
                secondary: {
                    bg: 'rgba(128, 128, 128, 0.05)',
                    text: 'text.secondary',
                    border: '1px solid rgba(128, 128, 128, 0.2)',
                    hover: 'rgba(128, 128, 128, 0.1)',
                },
            };
            return styles[color] || styles.secondary;
        };

        const cellStyle = getCellStyles(color);

        return {
            color: cellStyle.text,
            backgroundColor: cellStyle.bg,
            onClick: handleClick(pos),
            children: <Text text={value} />,
            sx: {
                cursor: 'pointer',
                borderRadius: 2,
                border: cellStyle.border,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: cellStyle.hover,
                    transform: 'translateY(-2px)',
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
                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                    borderRadius: 2,
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    color: 'text.primary',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(128, 128, 128, 0.25)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                },
                '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.light',
                },
            }}
        />
    );
}

export function Text({ text, ...props }) {
    return (
        <Typography
            {...props}
            sx={{
                fontSize: 'inherit',
                fontWeight: 'inherit',
                fontFamily: 'inherit',
                userSelect: 'none',
                lineHeight: 1,
                ...props.sx,
            }}
        >
            {text}
        </Typography>
    );
}

import React, { createContext, useContext, useMemo, ReactNode, RefObject } from 'react';
import { Program, Output, Tape, Register } from './Display';
import { CustomGrid } from '../helpers';
import { Grid, Typography, TextField } from '../components/mui';
import { Toolbar } from './Toolbar';
import { COLORS, SPACING, TYPOGRAPHY } from '../config/theme';
import { SxProps, Theme } from '@mui/material/styles';

interface EditorContextType {
    name: string;
    tapeFlag: boolean;
    outFlag: boolean;
    regFlag: boolean;
    code: string[] | undefined;
    index: number;
    tape: number[];
    pointer: number;
    output: string[] | string;
    register: number;
    height: number;
    size: number;
    dispatch: (action: string) => () => void;
    fastForward: boolean;
    pause: boolean;
}

export const EditorContext = createContext<EditorContextType | null>(null);

interface EditorProps {
    container?: RefObject<HTMLDivElement>;
    sideProps?: TextAreaProps;
    hide?: boolean;
    children: ReactNode;
}

export default function Editor({ container, sideProps, hide = false, children }: EditorProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error('Editor must be used within EditorContext.Provider');
    }
    
    const { name, tapeFlag, outFlag, regFlag, code } = editorContext;

    const rightProps = { xs: 6, md: 4 };
    let display: string, leftProps: number | { xs: number; md: number };

    if (hide) {
        display = 'none';
        leftProps = 12;
    } else {
        leftProps = { xs: 6, md: 8 };
        display = 'flex';
    }

    const titleProps = {
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
                background: COLORS.surface.background,
                position: 'relative',
            }}
        >
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid {...titleProps}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: TYPOGRAPHY.fontSize.h2,
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        }}
                    >
                        {name}
                    </Typography>
                </Grid>
                <Toolbar />
            </Grid>
            <Grid {...contentProps}>
                <Grid size={leftProps}>{children}</Grid>
                <Grid display={display} size={rightProps}>
                    <TextArea {...sideProps} />
                </Grid>
            </Grid>
            <Grid
                container
                spacing={2}
                sx={{ width: '100%', maxWidth: '100%' }}
            >
                {(() => {
                    const fields: ReactNode[] = [];
                    const fieldCount = [
                        code !== undefined,
                        tapeFlag,
                        outFlag,
                        regFlag,
                    ].filter(Boolean).length;
                    const gridSize =
                        fieldCount === 1
                            ? { xs: 12, md: 12 }
                            : { xs: 12, md: 6 };

                    if (code !== undefined) {
                        fields.push(
                            <Grid
                                key="program"
                                size={gridSize}
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <Program />
                            </Grid>
                        );
                    }
                    if (tapeFlag) {
                        fields.push(
                            <Grid
                                key="tape"
                                size={gridSize}
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <Tape />
                            </Grid>
                        );
                    }
                    if (outFlag) {
                        fields.push(
                            <Grid
                                key="output"
                                size={gridSize}
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <Output />
                            </Grid>
                        );
                    }
                    if (regFlag) {
                        fields.push(
                            <Grid
                                key="register"
                                size={gridSize}
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                }}
                            >
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

interface GridAreaProps {
    handleClick: (pos: number) => () => void;
    chooseColor: (pos: number) => string;
    options: string[];
    rows: number;
    cols: number;
}

export function GridArea({ handleClick, chooseColor, options, rows, cols }: GridAreaProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error('GridArea must be used within EditorContext.Provider');
    }
    
    const { size } = editorContext;

    const cellStyles = useMemo(
        () => ({
            primary: {
                bg: COLORS.surface.glass,
                text: COLORS.primary.main,
                border: `1px solid ${COLORS.primary.main}`,
                hover: COLORS.interactive.selected,
            },
            info: {
                bg: COLORS.interactive.focus,
                text: COLORS.text.primary,
                border: `1px solid ${COLORS.primary.main}`,
                hover: COLORS.interactive.hover,
            },
            secondary: {
                bg: COLORS.surface.glass,
                text: COLORS.text.secondary,
                border: `1px solid ${COLORS.border.subtle}`,
                hover: COLORS.interactive.selected,
            },
        }),
        []
    );

    const getCellStyles = useMemo(
        () => (color: string) => {
            return (cellStyles as any)[color] || cellStyles.secondary;
        },
        [cellStyles]
    );

    const cellProps = (row: number, col: number) => {
        const pos = cols * row + col;
        const color = chooseColor(pos);
        const value = options[pos] || ' ';

        const cellStyle = getCellStyles(color);

        return {
            color: cellStyle.text,
            backgroundColor: cellStyle.bg,
            onClick: handleClick(pos),
            children: <Text text={value} />,
            sx: {
                borderRadius: SPACING.borderRadius.md,
                border: cellStyle.border,
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(24px) saturate(180%)',
                '&:hover': {
                    backgroundColor: cellStyle.hover,
                },
            },
        };
    };

    return (
        <CustomGrid cellProps={cellProps} size={size} rows={rows} cols={cols} />
    );
}

interface TextAreaProps {
    value?: string;
    readOnly?: boolean;
    infoLabel?: string;
    fillValue?: string;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function TextArea({
    value,
    readOnly = false,
    infoLabel = 'Program code',
    fillValue = 'Hello, World!',
    handleChange,
}: TextAreaProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error('TextArea must be used within EditorContext.Provider');
    }
    
    const { height } = editorContext;
    const rows = Math.floor(height / 32);

    const isControlled = value !== undefined && value !== null;
    const textFieldProps = isControlled
        ? {
              value: value || '',
              onChange: handleChange,
          }
        : {
              defaultValue: fillValue,
              onChange: handleChange,
          };

    return (
        <TextField
            variant="outlined"
            label={infoLabel}
            slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { readOnly },
            }}
            fullWidth
            multiline
            rows={rows}
            {...textFieldProps}
            sx={{
                '& .MuiInputBase-root': {
                    alignItems: 'flex-start',
                    backgroundColor: COLORS.surface.glass,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    borderRadius: SPACING.borderRadius.md,
                    border: `1px solid ${COLORS.border.subtle}`,
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    color: 'text.primary',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.border.subtle,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.border.subtle,
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

interface TextProps {
    text: string;
    sx?: SxProps<Theme>;
    [key: string]: any;
}

export function Text({ text, ...props }: TextProps) {
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


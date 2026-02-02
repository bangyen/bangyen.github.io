import React, { useContext, ReactNode, RefObject } from 'react';
import { Program, Output, Tape, Register } from './Display';
import { Grid, Typography, Box } from '../../components/mui';
import { Toolbar } from './Toolbar';
import { LAYOUT, COLORS, TYPOGRAPHY } from '../../config/theme';
import { EditorContext } from './EditorContext';
import { TextArea, TextAreaProps } from './components/TextArea';

interface EditorProps {
    container?: RefObject<HTMLDivElement | null>;
    sideProps?: TextAreaProps;
    hide?: boolean;
    navigation?: ReactNode;
    children: ReactNode;
}

export default function Editor({
    container,
    sideProps = {},
    hide = false,
    navigation,
    children,
}: EditorProps) {
    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error('Editor must be used within EditorContext.Provider');
    }

    const { tapeFlag, outFlag, regFlag, code } = editorContext;

    const rightProps = { xs: 6, md: 4 };
    let display: string, leftProps: number | { xs: number; md: number };

    if (hide) {
        display = 'none';
        leftProps = 12;
    } else {
        leftProps = { xs: 6, md: 8 };
        display = 'flex';
    }

    const contentProps = {
        flex: { xs: 'none', md: 1 },
        spacing: 2,
        ref: container,
        container: true,
        display: 'flex',
        alignItems: 'center',
        sx: {
            overflowY: 'hidden',
            height: {
                xs: code !== undefined ? '300px' : '350px',
                md: 'auto',
            },
        },
    };

    return (
        <Grid
            container
            spacing={2}
            minHeight={{ xs: '50vh', md: 'auto' }}
            height={{
                xs: 'auto',
                md: `calc(100vh - ${LAYOUT.headerHeight.md.toString()}px)`,
            }}
            direction="column"
            wrap="nowrap"
            padding={{ xs: '1rem', md: '2rem' }}
            sx={{
                background: COLORS.surface.background,
                position: 'relative',
                boxSizing: 'border-box',
                width: '100% !important',
                margin: '0 !important',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%', // Ensure it takes available height and scrolls
            }}
        >
            <Grid
                container
                alignItems="center"
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                sx={{ mb: { xs: 2, md: 0 }, gap: { xs: 2, md: 0 } }}
            >
                <Grid
                    size="grow"
                    display="flex"
                    alignItems="center"
                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                    sx={{ width: '100%' }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: TYPOGRAPHY.fontSize.h2,
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                            paddingLeft: { xs: 0, md: 2 },
                            flexShrink: 0,
                        }}
                    >
                        Interpreters
                    </Typography>
                </Grid>
                <Grid
                    display="flex"
                    alignItems="center"
                    gap={1}
                    size="auto"
                    justifyContent={{ xs: 'center', md: 'flex-end' }}
                    sx={{ paddingRight: 1, width: { xs: '100%', md: 'auto' } }}
                >
                    <Toolbar />
                    {navigation && (
                        <Box sx={{ flexShrink: 0 }}>{navigation}</Box>
                    )}
                </Grid>
            </Grid>
            <Grid {...contentProps}>
                <Grid size={leftProps}>{children}</Grid>
                <Grid display={display} size={rightProps}>
                    <TextArea {...sideProps} />
                </Grid>
            </Grid>
            <Grid
                size={{ xs: 12 }}
                sx={{
                    // Ensure space for up to 2 rows of fields to prevent layout shift
                    // when switching between interpreters with 1-2 vs 3-4 fields.
                    minHeight:
                        [code !== undefined, tapeFlag, outFlag, regFlag].filter(
                            Boolean
                        ).length > 0
                            ? { xs: 'auto', md: '210px' }
                            : 0,
                    flexShrink: 0,
                }}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{ width: '100%', maxWidth: '100%' }}
                >
                    {(() => {
                        const fields: ReactNode[] = [];
                        const gridSize = { xs: 12, md: 6 };

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
        </Grid>
    );
}

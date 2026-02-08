import React from 'react';
import { Box } from '../../../components/mui';
import { COLORS, ANIMATIONS } from '../../../config/theme';
import { SLANT_STYLES } from './constants';
import { FORWARD, BACKWARD, SlantState } from './boardHandlers';
import { DragProps } from '../hooks/useDrag';
import { getPosKey } from '../utils/gameUtils';

export const getBackProps =
    (
        getDragProps: (pos: string) => DragProps,
        state: SlantState,
        size: number
    ) =>
    (r: number, c: number) => {
        const value = state.grid[r]?.[c];
        const pos = getPosKey(r, c);
        const isError = state.cycleCells.has(pos);
        const dragProps = getDragProps(pos);

        return {
            ...dragProps,
            sx: {
                ...dragProps.sx,
                cursor: 'pointer',
                border: `1px solid ${COLORS.border.subtle}`,
                position: 'relative',
                '&:hover': {
                    backgroundColor: COLORS.interactive.hover,
                },
            },
            children: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {value === FORWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '115%',
                                height: `${String(Math.max(2, size))}px`,
                                backgroundColor: isError
                                    ? COLORS.data.red
                                    : COLORS.text.primary,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(-45deg)',
                                boxShadow: SLANT_STYLES.SHADOWS.LINE,
                                transition: ANIMATIONS.transition,
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                    {value === BACKWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '115%',
                                height: `${String(Math.max(2, size))}px`,
                                backgroundColor: isError
                                    ? COLORS.data.red
                                    : COLORS.text.primary,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(45deg)',
                                boxShadow: SLANT_STYLES.SHADOWS.LINE,
                                transition: ANIMATIONS.transition,
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </Box>
            ),
        };
    };

export const getFrontProps =
    (state: SlantState, numberSize: number) => (r: number, c: number) => {
        const value = state.numbers[r]?.[c];
        const pos = getPosKey(r, c);
        const hasError = state.errorNodes.has(pos);
        const isSatisfied = state.satisfiedNodes.has(pos);

        return {
            sx: {
                // Make the container transparent to clicks so they reach the back layer
                pointerEvents: 'none',
            },
            children: (
                <Box
                    sx={{
                        borderRadius: '50%',
                        backgroundColor: hasError
                            ? COLORS.data.red
                            : COLORS.surface.background,
                        border:
                            value != null
                                ? `2px solid ${
                                      hasError
                                          ? COLORS.data.red
                                          : isSatisfied
                                            ? 'transparent'
                                            : COLORS.border.subtle
                                  }`
                                : 'none',
                        fontSize: `${String(numberSize * 0.5)}rem`,
                        fontWeight: '800',
                        color: hasError
                            ? SLANT_STYLES.COLORS.WHITE
                            : isSatisfied
                              ? COLORS.interactive.disabledText
                              : COLORS.text.primary,
                        boxShadow:
                            isSatisfied && !hasError
                                ? 'none'
                                : SLANT_STYLES.SHADOWS.HINT,
                        zIndex: 5,
                        opacity: value != null ? 1 : 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        transform: hasError ? 'scale(1.1)' : 'scale(1)',
                        width: `${String(numberSize)}rem`,
                        height: `${String(numberSize)}rem`,
                    }}
                >
                    {value ?? ''}
                </Box>
            ),
        };
    };

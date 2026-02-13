import React from 'react';

import type { DragProps } from '../../hooks/useDrag';
import { SLANT_STYLES } from '../config';
import type { SlantState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';

import { Box } from '@/components/mui';
import { COLORS, ANIMATIONS } from '@/config/theme';
import { getPosKey } from '@/utils/gameUtils';

export const getBackProps =
    (
        getDragProps: (pos: string) => DragProps,
        state: SlantState,
        size: number,
    ) =>
    (r: number, c: number) => {
        const value = state.grid[r]?.[c];
        const pos = getPosKey(r, c);
        const isError = state.cycleCells.has(pos);
        const dragProps = getDragProps(pos);

        const clues = [
            { v: state.numbers[r]?.[c], p: getPosKey(r, c) },
            { v: state.numbers[r]?.[c + 1], p: getPosKey(r, c + 1) },
            { v: state.numbers[r + 1]?.[c], p: getPosKey(r + 1, c) },
            { v: state.numbers[r + 1]?.[c + 1], p: getPosKey(r + 1, c + 1) },
        ].map(({ v, p }) => {
            if (v == null) return '-';
            const status = state.errorNodes.has(p)
                ? 'Error'
                : state.satisfiedNodes.has(p)
                  ? 'Ok'
                  : 'Pending';
            return `${String(v)} (${status})`;
        });

        return {
            ...dragProps,
            'aria-label': `Cell ${String(r + 1)}, ${String(c + 1)}. Clues: ${clues.join(', ')}. ${
                value === EMPTY
                    ? 'Empty'
                    : value === FORWARD
                      ? 'Forward Slash'
                      : 'Backward Slash'
            }${isError ? ', Loop Error' : ''}`,
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
                            value == null
                                ? 'none'
                                : `2px solid ${
                                      hasError
                                          ? COLORS.data.red
                                          : isSatisfied
                                            ? 'transparent'
                                            : COLORS.border.subtle
                                  }`,
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
                        opacity: value == null ? 0 : 1,
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

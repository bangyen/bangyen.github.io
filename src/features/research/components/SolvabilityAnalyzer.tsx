import { Box, Typography, Alert } from '@mui/material';
import React, { useState, useCallback } from 'react';

import { SolvabilityHeader } from './solvability/SolvabilityHeader';
import { SolvabilityResults } from './solvability/SolvabilityResults';
import { useWorker } from '../../../hooks';
import { RESEARCH_STYLES } from '../config/constants';

import { COLORS, SPACING } from '@/config/theme';

export const SolvabilityAnalyzer: React.FC = () => {
    const [n, setN] = useState<string>('5');
    const createWorker = useCallback(
        () =>
            new Worker(
                new URL('../workers/solvability.worker.ts', import.meta.url),
                { type: 'module' },
            ),
        [],
    );

    const { result, loading, error, run, terminate, setError } = useWorker<
        { n: number },
        {
            rank: number;
            nullity: number;
            gridRank: number;
            solvablePercent: string;
            quietPatterns: string[];
            totalStates: string;
            reachableStates: string;
            imageMapping: { state: string; toggle: string }[];
            isFullSubspace: boolean;
        }
    >(createWorker);

    const handleCancel = () => {
        terminate();
    };

    const handleAnalyze = () => {
        const size = Number.parseInt(n, 10);
        if (isNaN(size) || size < 1) {
            setError('Please enter a valid positive integer.');
            return;
        }

        if (size > 100) {
            setError('Grid size n > 100 is too computationally intensive.');
            return;
        }

        run({ n: size });
    };

    return (
        <Box>
            <SolvabilityHeader
                n={n}
                loading={loading}
                onNChange={setN}
                onAnalyze={handleAnalyze}
                onCancel={handleCancel}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    height: RESEARCH_STYLES.LAYOUT.RESULT_CARD_HEIGHT,
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {loading && (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            border: `1px dashed ${COLORS.border.subtle}`,
                            borderRadius: SPACING.borderRadius.md,
                            backgroundColor: RESEARCH_STYLES.GLASS.VERY_SUBTLE,
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: `2px solid ${COLORS.primary.main}22`,
                                borderTopColor: COLORS.primary.main,
                                ...RESEARCH_STYLES.ANIMATIONS.SPIN,
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{ color: COLORS.text.secondary }}
                        >
                            Performing Algebraic Matrix Analysis...
                        </Typography>
                    </Box>
                )}
                {!result && !error && !loading && (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            pt: 5,
                            px: 3,
                            border: `1px dashed ${COLORS.border.subtle}`,
                            borderRadius: SPACING.borderRadius.md,
                            backgroundColor: RESEARCH_STYLES.GLASS.VERY_SUBTLE,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: COLORS.text.secondary,
                                fontStyle: 'italic',
                                textAlign: 'center',
                            }}
                        >
                            Select grid dimensions and click analyze to see
                            results
                        </Typography>
                    </Box>
                )}
                {result && !loading && <SolvabilityResults result={result} />}
            </Box>
        </Box>
    );
};

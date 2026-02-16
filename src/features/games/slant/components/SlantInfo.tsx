import { Box, Button } from '@mui/material';
import React from 'react';

import { Example } from './Example';
import {
    SLANT_INFO_TITLES,
    SLANT_INSTRUCTIONS,
    SLANT_INFO_CARD_SX,
    slantInfoContentSx,
} from '../config';

import { Psychology } from '@/components/icons';
import { ErrorState } from '@/components/ui/ErrorState';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { COLORS } from '@/config/theme';
import { useMobile } from '@/hooks';
import { lazyNamed } from '@/utils/lazyNamed';

const GameInfo = lazyNamed(
    () => import('../../components/GameInfo'),
    'GameInfo',
);

interface SlantInfoProps {
    open: boolean;
    toggleOpen: () => void;
    handleOpenCalculator: () => void;
}

/**
 * Game-specific information modal for Slant.
 * Wraps the generic GameInfo component with Slant's instructions,
 * example animation, and calculator toggle.
 */
export function SlantInfo({
    open,
    toggleOpen,
    handleOpenCalculator,
}: SlantInfoProps) {
    const isMobile = useMobile('sm');

    if (!open) return null;

    return (
        <LazySuspense
            message="Loading info..."
            errorFallback={<ErrorState message="Failed to load info panel." />}
        >
            <GameInfo
                open={open}
                toggleOpen={toggleOpen}
                titles={SLANT_INFO_TITLES}
                instructions={SLANT_INSTRUCTIONS}
                instructionsFooter={
                    <Box
                        sx={{
                            display: 'flex',
                            px: 2,
                            ml: { xs: 5, sm: 4 },
                            pt: { xs: 0, sm: 3 },
                            mt: { xs: -2, sm: 0 },
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Psychology />}
                            onClick={handleOpenCalculator}
                            sx={{
                                borderColor: COLORS.border.subtle,
                                color: COLORS.text.secondary,
                            }}
                        >
                            Open Calculator
                        </Button>
                    </Box>
                }
                exampleContent={<Example size={isMobile ? 4 : 5} />}
                cardSx={SLANT_INFO_CARD_SX}
                contentSxOverride={slantInfoContentSx}
            />
        </LazySuspense>
    );
}

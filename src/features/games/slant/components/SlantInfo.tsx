import { Box, Button } from '@mui/material';

import { Example } from './Example';
import { calculatorFooterSx, calculatorButtonSx } from './SlantInfo.styles';
import {
    SLANT_INFO_TITLES,
    SLANT_INSTRUCTIONS,
    SLANT_INFO_CARD_SX,
    slantInfoContentSx,
} from '../config';

import { Psychology } from '@/components/icons';
import { LazyGameInfo } from '@/features/games/components/GameInfo/LazyGameInfo';
import type { BaseInfoProps } from '@/features/games/types';
import { useMobile } from '@/hooks';

interface SlantInfoProps extends BaseInfoProps {
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

    return (
        <LazyGameInfo
            open={open}
            toggleOpen={toggleOpen}
            titles={SLANT_INFO_TITLES}
            instructions={SLANT_INSTRUCTIONS}
            instructionsFooter={
                <Box sx={calculatorFooterSx}>
                    <Button
                        variant="outlined"
                        startIcon={<Psychology />}
                        onClick={handleOpenCalculator}
                        sx={calculatorButtonSx}
                    >
                        Open Calculator
                    </Button>
                </Box>
            }
            exampleContent={<Example size={isMobile ? 4 : 5} />}
            cardSx={SLANT_INFO_CARD_SX}
            contentSxOverride={slantInfoContentSx}
        />
    );
}

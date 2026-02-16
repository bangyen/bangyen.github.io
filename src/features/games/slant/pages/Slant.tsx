import { Box, Button } from '@mui/material';
import React from 'react';

import { GameControls } from '../../components/GameControls';
import { GameInfo } from '../../components/GameInfo';
import { GamePageLayout } from '../../components/GamePageLayout';
import { Example } from '../components/Example';
import { SlantBoardContent } from '../components/SlantBoardContent';
import {
    SLANT_INFO_TITLES,
    SLANT_INSTRUCTIONS,
    SLANT_INFO_CARD_SX,
    slantInfoContentSx,
} from '../config';
import { useSlantGame } from '../hooks/useSlantGame';

import { Psychology } from '@/components/icons';
import { PAGE_TITLES } from '@/config/constants';
import { COLORS } from '@/config/theme';
import { useMobile } from '@/hooks';

export function Slant() {
    const { boardProps, controlsProps, layoutProps, infoProps, trophyProps } =
        useSlantGame();

    const isMobile = useMobile('sm');

    return (
        <GamePageLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            paddingBottom={{ xs: '120px', md: '150px' }}
            controls={<GameControls {...controlsProps} />}
            contentSx={layoutProps.contentSx}
            trophyProps={trophyProps}
            boardSx={layoutProps.boardSx}
            onClick={
                boardProps.isGhostMode ? boardProps.onGhostClose : undefined
            }
        >
            <Box onClick={infoProps.handleBoxClick}>
                <SlantBoardContent {...boardProps} />
            </Box>
            {infoProps.infoOpen && (
                <GameInfo
                    open={infoProps.infoOpen}
                    toggleOpen={infoProps.toggleInfo}
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
                                onClick={infoProps.handleOpenCalculator}
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
            )}
        </GamePageLayout>
    );
}

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

export function Slant() {
    const {
        rows,
        cols,
        state,
        size,
        generating,
        isGhostMode,
        infoOpen,
        toggleInfo,
        controlsProps,
        handleNextAsync,
        ghostMoves,
        boardSx,
        handleGhostMove,
        handleGhostCopy,
        handleGhostClear,
        handleGhostClose,
        handleBoxClick,
        handleOpenCalculator,
        frontProps,
        backProps,
        contentSx,
        dimensionsMismatch,
        iconSizeRatio,
    } = useSlantGame();

    const controls = (
        <GameControls
            {...controlsProps}
            onRefresh={handleNextAsync}
            disabled={generating}
            onOpenInfo={toggleInfo}
            hidden={isGhostMode}
        />
    );

    const boardContent = (
        <SlantBoardContent
            isGhostMode={isGhostMode}
            generating={generating}
            dimensionsMismatch={dimensionsMismatch}
            rows={rows}
            cols={cols}
            state={state}
            size={size}
            ghostMoves={ghostMoves}
            onGhostMove={handleGhostMove}
            onGhostCopy={handleGhostCopy}
            onGhostClear={handleGhostClear}
            onGhostClose={handleGhostClose}
            overlayProps={frontProps}
            cellProps={backProps}
        />
    );

    return (
        <GamePageLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            paddingBottom={{ xs: '120px', md: '150px' }}
            controls={controls}
            contentSx={contentSx}
            trophyProps={{
                show: !isGhostMode && state.solved,
                onReset: handleNextAsync,
                size,
                iconSizeRatio,
            }}
            boardSx={boardSx}
            onClick={isGhostMode ? handleGhostClose : undefined}
        >
            <Box onClick={handleBoxClick}>{boardContent}</Box>
            {infoOpen && (
                <GameInfo
                    open={infoOpen}
                    toggleOpen={toggleInfo}
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
                    exampleContent={<Example size={5} />}
                    cardSx={SLANT_INFO_CARD_SX}
                    contentSxOverride={slantInfoContentSx}
                />
            )}
        </GamePageLayout>
    );
}

import { Box } from '@mui/material';

import { GameControls } from '../../components/GameControls';
import { GamePage } from '../../components/GamePage';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { SlantGameContainer } from '../components/SlantGameContainer';
import { SlantInfo } from '../components/SlantInfo';
import { useSlantGame } from '../hooks/useSlantGame';

import { PAGE_TITLES } from '@/config/constants';

export function Slant() {
    const { boardProps, layoutProps, infoProps, gameState, trophyProps } =
        useSlantGame();

    return (
        <>
            <GamePage
                title={PAGE_TITLES.slant}
                infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
                onClick={
                    boardProps.isAnalysisMode
                        ? boardProps.analysis.onClose
                        : undefined
                }
            >
                <GamePage.Content
                    paddingBottom={{ xs: '120px', md: '150px' }}
                    sx={layoutProps.contentSx}
                >
                    <GamePage.BoardContainer sx={layoutProps.boardSx}>
                        <Box onClick={infoProps.handleBoxClick}>
                            <SlantGameContainer {...boardProps} />
                        </Box>
                        <TrophyOverlay
                            show={
                                !boardProps.isAnalysisMode &&
                                boardProps.state.solved
                            }
                            {...trophyProps}
                        />
                    </GamePage.BoardContainer>
                </GamePage.Content>
                <GameControls
                    {...gameState.controlsProps}
                    onRefresh={gameState.handleNext}
                    disabled={boardProps.generating}
                    hidden={boardProps.isAnalysisMode}
                >
                    <GameControls.Refresh />
                    <GameControls.ResizeMinus />
                    <GameControls.ResizePlus />
                    <GameControls.Info onClick={infoProps.toggleOpen} />
                </GameControls>
            </GamePage>
            <SlantInfo {...infoProps} />
        </>
    );
}

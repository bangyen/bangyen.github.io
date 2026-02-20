import { Box } from '@mui/material';

import { GameControls } from '../../components/GameControls';
import { GamePage } from '../../components/GamePage';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { GameProvider } from '../../hooks/GameContext';
import { SlantGameContainer } from '../components/SlantGameContainer';
import { SlantInfo } from '../components/SlantInfo';
import { useSlantGame } from '../hooks/useSlantGame';

import { PAGE_TITLES } from '@/config/constants';

export function Slant() {
    const {
        boardProps,
        controlsProps,
        layoutProps,
        infoProps,
        trophyProps,
        contextValue,
    } = useSlantGame();

    return (
        <GameProvider
            stateValue={contextValue}
            dispatchValue={contextValue.dispatch}
        >
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
                        <TrophyOverlay {...trophyProps} />
                    </GamePage.BoardContainer>
                </GamePage.Content>
                <GameControls {...controlsProps} />
            </GamePage>
            <SlantInfo {...infoProps} />
        </GameProvider>
    );
}

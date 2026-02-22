import { Box } from '@mui/material';

import { StandardGameLayout } from '../../components/StandardGameLayout';
import { SlantGameContainer } from '../components/SlantGameContainer';
import { SlantInfo } from '../components/SlantInfo';
import { useSlantGame } from '../hooks/useSlantGame';

import { PAGE_TITLES } from '@/config/constants';

export function Slant() {
    const { boardProps, layoutProps, infoProps, gameState, trophyProps } =
        useSlantGame();

    return (
        <StandardGameLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            boardProps={boardProps}
            layoutProps={layoutProps}
            infoProps={infoProps}
            gameState={gameState}
            trophyProps={trophyProps}
            showTrophy={!boardProps.isAnalysisMode && boardProps.state.solved}
            renderBoard={props => (
                <Box onClick={infoProps.handleBoxClick}>
                    <SlantGameContainer {...props} />
                </Box>
            )}
            InfoComponent={SlantInfo}
            onPageClick={
                boardProps.isAnalysisMode
                    ? boardProps.analysis.onClose
                    : undefined
            }
            controlsConfig={{
                onRefresh: gameState.handleNext,
                disabled: boardProps.generating,
                hidden: boardProps.isAnalysisMode,
            }}
        />
    );
}

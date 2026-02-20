import { Board } from '../../components/Board';
import { GameControls } from '../../components/GameControls';
import { GamePage } from '../../components/GamePage';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { GameProvider } from '../../hooks/GameContext';
import { LightsOutInfo as Info } from '../components/LightsOutInfo';
import { useLightsOutGame } from '../hooks/useLightsOutGame';

import { PAGE_TITLES } from '@/config/constants';

export function LightsOut() {
    const {
        boardProps,
        controlsProps,
        layoutProps,
        infoProps,
        trophyProps,
        contextValue,
    } = useLightsOutGame();

    return (
        <GameProvider
            stateValue={contextValue}
            dispatchValue={contextValue.dispatch}
        >
            <GamePage
                title={PAGE_TITLES.lightsOut}
                infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
            >
                <GamePage.Content>
                    <GamePage.BoardContainer sx={layoutProps.boardSx}>
                        <Board {...boardProps} />
                        <TrophyOverlay {...trophyProps} />
                    </GamePage.BoardContainer>
                </GamePage.Content>
                <GameControls {...controlsProps} />
            </GamePage>
            <Info {...infoProps} />
        </GameProvider>
    );
}

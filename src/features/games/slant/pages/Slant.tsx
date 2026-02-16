import { Box } from '@mui/material';

import { GameControls } from '../../components/GameControls';
import { GamePageLayout } from '../../components/GamePageLayout';
import { SlantBoardContent } from '../components/SlantBoardContent';
import { SlantInfo } from '../components/SlantInfo';
import { useSlantGame } from '../hooks/useSlantGame';

import { PAGE_TITLES } from '@/config/constants';

export function Slant() {
    const { boardProps, controlsProps, layoutProps, infoProps, trophyProps } =
        useSlantGame();

    return (
        <GamePageLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            controls={<GameControls {...controlsProps} />}
            trophyProps={trophyProps}
            layout={{
                paddingBottom: { xs: '120px', md: '150px' },
                contentSx: layoutProps.contentSx,
                boardSx: layoutProps.boardSx,
            }}
            onClick={
                boardProps.isGhostMode ? boardProps.onGhostClose : undefined
            }
        >
            <Box onClick={infoProps.handleBoxClick}>
                <SlantBoardContent {...boardProps} />
            </Box>
            <SlantInfo {...infoProps} />
        </GamePageLayout>
    );
}

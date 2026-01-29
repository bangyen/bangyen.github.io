import { GameConfig } from '../types/games';

export const GAME_CONSTANTS: GameConfig = {
    snake: {
        initialLength: 3,
        segmentSize: 3,
        initialVelocity: 1,
    },
    lightsOut: {
        defaultSize: 5,
    },
    gridSizes: {
        mobile: 2.5,
        desktop: 4,
    },
    controls: {
        arrowPrefix: 'arrow',
    },
};

export const GAME_TITLES = {
    snake: 'Snake | Bangyen',
    lightsOut: 'Lights Out | Bangyen',
};

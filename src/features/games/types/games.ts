export interface SnakeConstants {
    initialLength: number;
    segmentSize: number;
    initialVelocity: number;
}

export interface LightsOutConstants {
    defaultSize: number;
}

export interface GridSizes {
    mobile: number;
    desktop: number;
}

export interface GameConfig {
    snake: SnakeConstants;
    lightsOut: LightsOutConstants;
    gridSizes: GridSizes;
    controls: {
        arrowPrefix: string;
    };
}

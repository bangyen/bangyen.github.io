export interface LightsOutConstants {
    defaultSize: number;
}

export interface GridSizes {
    mobile: number;
    desktop: number;
}

export interface GameConfig {
    lightsOut: LightsOutConstants;
    gridSizes: GridSizes;
    controls: {
        arrowPrefix: string;
    };
}

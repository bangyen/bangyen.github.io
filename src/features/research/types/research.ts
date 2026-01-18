export interface OligopolyConstants {
    defaultFirms: number;
    defaultElasticity: number;
    defaultBasePrice: number;
    maxRounds: number;
    simulation: {
        fallbackPrice: number;
        fallbackHHI: number;
        collusionStart: number;
        collusionEnd: number;
        priceAmplitude: number;
        hhiAmplitude: number;
        priceFrequency: number;
        hhiFrequency: number;
    };
}

export interface ZSharpDefaults {
    baseAccuracy: number;
    maxAccuracy: number;
    baseLoss: number;
    minLoss: number;
    improvement: number;
    lossReduction: number;
    maxEpochs: number;
}

export interface ResearchConfig {
    oligopoly: OligopolyConstants;
    zsharp: ZSharpDefaults;
    modelTypes: {
        cournot: string;
    };
}

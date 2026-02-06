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
    options: {
        firms: { value: number; label: string }[];
        elasticity: { value: number; label: string }[];
        price: { value: number; label: string }[];
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
    yAxisPadding: number;
    lossPadding: number;
    gapPadding: number;
    convergencePadding: number;
}

export interface ResearchConfig {
    oligopoly: OligopolyConstants;
    zsharp: ZSharpDefaults;
    modelTypes: {
        cournot: string;
    };
    lightsOut: {
        yAxisMax: number;
    };
}

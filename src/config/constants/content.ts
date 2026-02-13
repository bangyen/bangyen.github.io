import { URLS } from './identity';
import type { Publication, Project } from './types';

export const PUBLICATIONS: Publication[] = [
    {
        title: 'Generalized Collective Algorithms for the Exascale Era',
        conference: 'CLUSTER 2023',
        url: URLS.publications.cluster2023,
        description:
            'Introduced novel framework for exascale collective algorithms, reducing communication overhead by 30% and latency by 20%',
    },
    {
        title: 'Revisiting Computation for Research: Practices and Trends',
        conference: 'SC 2024',
        url: URLS.publications.sc2024,
        description:
            'Interviewed 138 researchers across multiple institutions using thematic analysis to uncover evolving computational research practices',
    },
];

export const PROJECTS: Project[] = [
    {
        title: 'ZSharp — Sharpness-Aware Minimization',
        technology: 'PyTorch',
        url: URLS.zsharpRepo,
        description:
            'Developed PyTorch implementation with Apple Silicon optimization, delivering +5.2% accuracy over SGD and 4.4× training speedup',
    },
    {
        title: 'Oligopoly — Agent-Based Modeling',
        technology: 'FastAPI',
        url: URLS.oligopolyRepo,
        description:
            'Built simulation with 98.5% collusion detection accuracy and 72.3% strategy adaptation rate using FastAPI and SQLAlchemy',
    },
];

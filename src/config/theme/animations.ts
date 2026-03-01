/**
 * Animation and transition definitions
 */

import { COLORS } from './colors';

interface AnimationPresets {
    focus: {
        boxShadow: string;
    };
    glass: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
    };
    glassSoft: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
    };
}

export interface Animations {
    transition: string;
    transitions: {
        standard: string;
        smooth: string;
        fast: string;
    };
    durations: {
        short: number;
        standard: number;
        long: number;
        stagger: number;
        menu: number;
    };
    presets: AnimationPresets;
}

export const ANIMATIONS: Animations = {
    transition:
        'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transitions: {
        standard:
            'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        fast: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    durations: {
        short: 200,
        standard: 400,
        long: 1000,
        stagger: 150,
        menu: 300,
    },
    presets: {
        focus: {
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
        glass: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(24px) saturate(180%)',
            border: `1px solid ${COLORS.border.subtle}`,
        },
        glassSoft: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(8px) saturate(140%)',
            border: `1px solid ${COLORS.border.subtle}`,
        },
    },
};

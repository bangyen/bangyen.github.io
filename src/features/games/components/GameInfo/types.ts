import type { SxProps, Theme } from '@mui/material';
import type React from 'react';

/** Data for a single instruction row shown on the first step. */
export interface InstructionItemData {
    Icon: React.ElementType;
    title: string;
    text: React.ReactNode;
}

export interface GameInfoProps {
    /** Whether the modal is open. */
    open: boolean;
    /** Toggle the modal open/closed. */
    toggleOpen: () => void;
    /** Ordered step titles — length must equal 2 + extraSteps.length. */
    titles: string[];
    /** Instruction rows rendered on step 0. */
    instructions: InstructionItemData[];
    /** Optional footer below the centered instructions (e.g. a button). */
    instructionsFooter?: React.ReactNode;
    /** Content rendered on step 1 (the animated example). */
    exampleContent: React.ReactNode;
    /** Additional steps rendered after the example (e.g. a calculator). */
    extraSteps?: React.ReactNode[];
    /** Optional sx overrides merged onto the GlassCard container. */
    cardSx?: SxProps<Theme>;
    /** Optional per-step override for the scrollable content area sx. */
    contentSxOverride?: (step: number) => SxProps<Theme>;
    /** Optional boolean array indicating which steps scroll and need padding. Defaults to `true` for steps >= 2. */
    scrollableSteps?: boolean[];
    /** Optional key to persist the current step in localStorage. */
    persistenceKey?: string;
}

/** Props for the inner content rendered inside an already-open Modal. */
export interface GameInfoContentProps extends Omit<GameInfoProps, 'open'> {
    /** DOM id applied to the step title for `aria-labelledby` on the modal. */
    titleId: string;
}

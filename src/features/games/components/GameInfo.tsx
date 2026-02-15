import type { SxProps, Theme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import React from 'react';

import { InfoModal } from './InfoModal';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Data for a single instruction row shown on the first step. */
export interface InstructionItemData {
    Icon: React.ElementType;
    title: string;
    text: string;
}

interface GameInfoProps {
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
    cardSx?: Record<string, unknown>;
    /** Optional per-step override for the scrollable content area sx. */
    contentSxOverride?: (step: number) => SxProps<Theme>;
}

/**
 * Renders a single instruction row: an icon, bold title, and description.
 * Used internally to build the instructions step from declarative data.
 */
function InstructionItem({
    Icon,
    title,
    text,
}: {
    Icon: React.ElementType;
    title: string;
    text: string;
}) {
    return (
        <Box sx={{ px: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    color: COLORS.text.primary,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    fontSize: TYPOGRAPHY.fontSize.subheading,
                }}
            >
                <Icon
                    sx={{
                        mr: 2,
                        color: COLORS.primary.main,
                        fontSize: '1.75rem',
                    }}
                />
                {title}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: COLORS.text.secondary,
                    lineHeight: 1.6,
                    fontSize: TYPOGRAPHY.fontSize.body,
                    ml: 6,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}

/**
 * Unified "How to Play" modal for all games.  Accepts instructions as
 * declarative data and the example animation as a ReactNode so individual
 * games don't need separate InfoInstructions / InfoExample components.
 *
 * Step layout:
 *   0 — Instructions (rendered from `instructions` data)
 *   1 — Example      (renders `exampleContent`)
 *   2…— Extra steps  (renders each element from `extraSteps`)
 */
export function GameInfo({
    open,
    toggleOpen,
    titles,
    instructions,
    instructionsFooter,
    exampleContent,
    extraSteps = [],
    cardSx,
    contentSxOverride,
}: GameInfoProps) {
    const instructionsStep = (
        <Box
            sx={{
                animation: 'fadeIn 0.3s ease',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
                {instructions.map(({ Icon, title, text }) => (
                    <InstructionItem
                        key={title}
                        Icon={Icon}
                        title={title}
                        text={text}
                    />
                ))}
            </Box>
            {instructionsFooter}
        </Box>
    );

    const exampleStep = (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.3s ease',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {exampleContent}
            </Box>
        </Box>
    );

    return (
        <InfoModal
            open={open}
            toggleOpen={toggleOpen}
            titles={titles}
            cardSx={cardSx}
            contentSxOverride={contentSxOverride}
            steps={[instructionsStep, exampleStep, ...extraSteps]}
        />
    );
}

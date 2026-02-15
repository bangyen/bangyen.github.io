import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { InfoExample } from './InfoExample';
import { InfoInstructions } from './InfoInstructions';
import { InfoModal } from '../../components/InfoModal';
import { infoContentSx } from '../../components/infoStyles';

import { toSxArray } from '@/utils/muiUtils';

const INFO_TITLES = ['Slant Rules', 'Example'];

interface InfoProps {
    /** Whether the modal is open. */
    open: boolean;
    /** Cell size in rem units (used to scale the example board). */
    size: number;
    /** Toggle the modal open/closed. */
    toggleOpen: () => void;
    /** Closes the modal and activates ghost-mode calculator. */
    onOpenCalculator: () => void;
}

/** Content-area sx with overflow hidden for the animated example. */
const contentSxOverride = (step: number): SxProps<Theme> =>
    [
        ...toSxArray(infoContentSx(step)),
        { overflowY: 'hidden' },
    ] as SxProps<Theme>;

/**
 * Two-step "How to Play" modal for the Slant puzzle.
 * Step 0: rule explanations, Step 1: animated solve example.
 */
export default function Info({
    open,
    toggleOpen,
    onOpenCalculator,
}: InfoProps): React.ReactElement {
    return (
        <InfoModal
            open={open}
            toggleOpen={toggleOpen}
            titles={INFO_TITLES}
            cardSx={{
                height: { xs: '660px', sm: '525px' },
                minHeight: { xs: '660px', sm: '525px' },
            }}
            contentSxOverride={contentSxOverride}
        >
            {(step: number) => (
                <>
                    {step === 0 && (
                        <InfoInstructions onOpenCalculator={onOpenCalculator} />
                    )}
                    {step === 1 && <InfoExample />}
                </>
            )}
        </InfoModal>
    );
}

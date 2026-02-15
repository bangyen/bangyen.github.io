import React from 'react';

import { InstructionItem } from '../../components/InfoContent';
import { InfoInstructionsWrapper } from '../../components/InfoInstructionsWrapper';

import { KeyboardArrowDown, Calculate, Replay } from '@/components/icons';

export function InfoInstructions() {
    return (
        <InfoInstructionsWrapper>
            <InstructionItem
                Icon={KeyboardArrowDown}
                title="Chase to Bottom"
                text="Turn off rows from top to bottom by clicking lights in each row to push them down."
            />
            <InstructionItem
                Icon={Calculate}
                title="Use Calulator"
                text="Enter the remaining lights pattern from the bottom row into the calculator on the last page."
            />
            <InstructionItem
                Icon={Replay}
                title="Chase Again"
                text="Apply the solution pattern to the top row, then chase them down again to solve the puzzle."
            />
        </InfoInstructionsWrapper>
    );
}

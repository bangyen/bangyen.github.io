import React from 'react';

import { AnalysisHint } from './AnalysisHint';

interface AnalysisGridHintProps {
    r: number;
    c: number;
    value: number | null;
    hasConflict: boolean;
    isSatisfied: boolean;
    numberSize: number;
}

export const AnalysisGridHint = React.memo(function AnalysisGridHint({
    r,
    c,
    value,
    hasConflict,
    isSatisfied,
    numberSize,
}: AnalysisGridHintProps) {
    return (
        <div
            data-pos={`${r.toString()},${c.toString()}`}
            data-type="hint"
            style={{
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <AnalysisHint
                value={value}
                hasConflict={hasConflict}
                isSatisfied={isSatisfied}
                numberSize={numberSize}
            />
        </div>
    );
});

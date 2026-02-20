import React, { createContext, useContext } from 'react';

/* eslint-disable react-refresh/only-export-components */
export interface AnalysisContextValue {
    /** Copy current board into analysis layer. */
    onCopy?: () => void;
    /** Clear all analysis moves. */
    onClear?: () => void;
    /** Close analysis mode. */
    onClose?: () => void;
    /** Apply analysis moves to the real board. */
    onApply?: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(
    undefined,
);

export function AnalysisProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: AnalysisContextValue;
}): React.ReactElement {
    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysisContext(): AnalysisContextValue {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error(
            'useAnalysisContext must be used within an AnalysisProvider',
        );
    }
    return context;
}

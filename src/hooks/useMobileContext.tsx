import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';

import { useMobile } from './layout';

/**
 * Values exposed by the mobile-breakpoint context.
 *
 * Each flag corresponds to a MUI breakpoint and is `true` when the
 * viewport is *below* that breakpoint (i.e. the same semantics as
 * `useMobile(bp)`).
 */
export interface MobileContextValue {
    /** `true` when viewport < `sm` breakpoint. */
    sm: boolean;
    /** `true` when viewport < `md` breakpoint. */
    md: boolean;
}

const MobileContext = createContext<MobileContextValue | undefined>(undefined);

export interface MobileProviderProps {
    children: ReactNode;
}

/**
 * Subscribes to common MUI breakpoints once and distributes the
 * results via Context, eliminating redundant `useMediaQuery`
 * subscriptions when multiple siblings need the same flag.
 *
 * Place this at a layout boundary (e.g. inside `ResearchDemo` or a
 * page wrapper) rather than at the app root -- that keeps the
 * subscription count proportional to the number of visible features.
 */
export function MobileProvider({ children }: MobileProviderProps) {
    const sm = useMobile('sm');
    const md = useMobile('md');

    const value: MobileContextValue = React.useMemo(
        () => ({ sm, md }),
        [sm, md],
    );

    return (
        <MobileContext.Provider value={value}>
            {children}
        </MobileContext.Provider>
    );
}

/**
 * Reads the nearest `MobileProvider` context.
 *
 * @throws Error if called outside a `MobileProvider`.
 *
 * @example
 * ```tsx
 * function ChartPanel() {
 *   const { sm } = useMobileContext();
 *   return <YAxis hide={sm} />;
 * }
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMobileContext(): MobileContextValue {
    const ctx = useContext(MobileContext);
    if (ctx === undefined) {
        throw new Error(
            'useMobileContext must be used within a MobileProvider',
        );
    }
    return ctx;
}

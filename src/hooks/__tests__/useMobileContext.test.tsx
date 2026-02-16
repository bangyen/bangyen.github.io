import { useMediaQuery } from '@mui/material';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';

import { MobileProvider, useMobileContext } from '../useMobileContext';

vi.mock('@mui/material', () => ({
    useMediaQuery: vi.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MobileProvider>{children}</MobileProvider>
);

describe('MobileProvider / useMobileContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('provides sm and md breakpoint flags', () => {
        (useMediaQuery as Mock)
            .mockReturnValueOnce(true) // sm
            .mockReturnValueOnce(false); // md

        const { result } = renderHook(() => useMobileContext(), { wrapper });

        expect(result.current.sm).toBe(true);
        expect(result.current.md).toBe(false);
    });

    it('returns false for both when viewport is large', () => {
        (useMediaQuery as Mock)
            .mockReturnValueOnce(false) // sm
            .mockReturnValueOnce(false); // md

        const { result } = renderHook(() => useMobileContext(), { wrapper });

        expect(result.current.sm).toBe(false);
        expect(result.current.md).toBe(false);
    });

    it('returns true for both when viewport is very small', () => {
        (useMediaQuery as Mock)
            .mockReturnValueOnce(true) // sm
            .mockReturnValueOnce(true); // md

        const { result } = renderHook(() => useMobileContext(), { wrapper });

        expect(result.current.sm).toBe(true);
        expect(result.current.md).toBe(true);
    });

    it('throws when used outside MobileProvider', () => {
        expect(() => {
            renderHook(() => useMobileContext());
        }).toThrow('useMobileContext must be used within a MobileProvider');
    });
});

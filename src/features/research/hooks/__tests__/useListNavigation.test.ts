import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useListNavigation } from '../useListNavigation';

describe('useListNavigation', () => {
    it('returns correct props for items', () => {
        const { result } = renderHook(() => useListNavigation({ count: 3 }));

        const props0 = result.current.getItemProps(0, true);
        expect(props0.tabIndex).toBe(0);
        expect(props0['data-index']).toBe(0);

        const props1 = result.current.getItemProps(1, false);
        expect(props1.tabIndex).toBe(-1);
    });

    it('handles keyboard navigation', () => {
        const { result } = renderHook(() => useListNavigation({ count: 3 }));
        const props = result.current.getItemProps(1, true);

        const mockFocus = vi.fn();
        const mockNeighbor = { focus: mockFocus } as any;
        Object.setPrototypeOf(mockNeighbor, HTMLElement.prototype);

        const mockContainer = {
            querySelector: vi.fn().mockReturnValue(mockNeighbor),
        } as any;

        const mockCurrentTarget = {
            closest: vi.fn().mockReturnValue(mockContainer),
        } as any;

        const mockEvent = {
            key: 'ArrowRight',
            currentTarget: mockCurrentTarget,
            preventDefault: vi.fn(),
        } as any;

        props.onKeyDown(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockContainer.querySelector).toHaveBeenCalledWith(
            '[data-index="2"]',
        );
        expect(mockFocus).toHaveBeenCalled();
    });

    it('jumps to start/end with Home/End keys', () => {
        const { result } = renderHook(() => useListNavigation({ count: 5 }));
        const props = result.current.getItemProps(2, true);

        const mockFocus = vi.fn();
        const mockNeighbor = { focus: mockFocus } as any;
        Object.setPrototypeOf(mockNeighbor, HTMLElement.prototype);

        const mockContainer = {
            querySelector: vi.fn().mockReturnValue(mockNeighbor),
        } as any;

        const mockCurrentTarget = {
            closest: vi.fn().mockReturnValue(mockContainer),
        } as any;

        // Home
        const homeEvent = {
            key: 'Home',
            currentTarget: mockCurrentTarget,
            preventDefault: vi.fn(),
        } as any;
        props.onKeyDown(homeEvent);
        expect(mockContainer.querySelector).toHaveBeenCalledWith(
            '[data-index="0"]',
        );

        // End
        const endEvent = {
            key: 'End',
            currentTarget: mockCurrentTarget,
            preventDefault: vi.fn(),
        } as any;
        props.onKeyDown(endEvent);
        expect(mockContainer.querySelector).toHaveBeenCalledWith(
            '[data-index="4"]',
        );
    });
});

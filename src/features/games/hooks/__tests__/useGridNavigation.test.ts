import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useGridNavigation } from '../useGridNavigation';

describe('useGridNavigation', () => {
    it('ignores non-navigation keys', () => {
        const { result } = renderHook(() =>
            useGridNavigation({ rows: 3, cols: 3 }),
        );
        const mockEvent = { key: 'Enter' } as any;

        result.current.handleKeyDown(mockEvent);
        // Should return early
    });

    it('navigates to neighbor and focuses it', () => {
        const { result } = renderHook(() =>
            useGridNavigation({ rows: 3, cols: 3 }),
        );

        const mockFocus = vi.fn();
        const mockNeighbor = { focus: mockFocus } as any;
        Object.setPrototypeOf(mockNeighbor, HTMLElement.prototype);

        const mockBoard = {
            querySelector: vi.fn().mockReturnValue(mockNeighbor),
        } as any;

        const mockCurrentTarget = {
            getAttribute: vi.fn().mockReturnValue('1,1'),
            closest: vi.fn().mockReturnValue(mockBoard),
        } as any;

        const mockEvent = {
            key: 'ArrowDown',
            currentTarget: mockCurrentTarget,
            preventDefault: vi.fn(),
        } as any;

        result.current.handleKeyDown(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockBoard.querySelector).toHaveBeenCalledWith(
            '[data-pos="2,1"]',
        );
        expect(mockFocus).toHaveBeenCalled();
    });

    it('bounds navigation within grid limits', () => {
        const { result } = renderHook(() =>
            useGridNavigation({ rows: 3, cols: 3 }),
        );

        const mockCurrentTarget = {
            getAttribute: vi.fn().mockReturnValue('0,0'),
        } as any;

        const mockEvent = {
            key: 'ArrowUp',
            currentTarget: mockCurrentTarget,
        } as any;

        result.current.handleKeyDown(mockEvent);
        // Should return early (nextR === r)
    });

    it('handles WASD keys', () => {
        const { result } = renderHook(() =>
            useGridNavigation({ rows: 3, cols: 3 }),
        );

        const mockFocus = vi.fn();
        const mockNeighbor = { focus: mockFocus } as any;
        Object.setPrototypeOf(mockNeighbor, HTMLElement.prototype);

        const mockBoard = {
            querySelector: vi.fn().mockReturnValue(mockNeighbor),
        } as any;

        const mockCurrentTarget = {
            getAttribute: vi.fn().mockReturnValue('1,1'),
            closest: vi.fn().mockReturnValue(mockBoard),
        } as any;

        const mockEvent = {
            key: 'd',
            currentTarget: mockCurrentTarget,
            preventDefault: vi.fn(),
        } as any;

        result.current.handleKeyDown(mockEvent);
        expect(mockBoard.querySelector).toHaveBeenCalledWith(
            '[data-pos="1,2"]',
        );
    });
});

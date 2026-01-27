import { renderHook, act } from '@testing-library/react';
import { useKeys } from '../useKeys';

describe('useKeys hook', () => {
    let addSpy: jest.SpyInstance;
    let removeSpy: jest.SpyInstance;

    beforeEach(() => {
        addSpy = jest.spyOn(document, 'addEventListener');
        removeSpy = jest.spyOn(document, 'removeEventListener');
    });

    afterEach(() => {
        addSpy.mockRestore();
        removeSpy.mockRestore();
    });

    test('binds event listener on create', () => {
        const handler = jest.fn();
        const { result } = renderHook(() => useKeys());

        act(() => {
            result.current.create(handler);
        });

        expect(addSpy).toHaveBeenCalledWith('keydown', handler);
    });

    test('removes event listener on clear', () => {
        const handler = jest.fn();
        const { result } = renderHook(() => useKeys());

        act(() => {
            result.current.create(handler);
            result.current.clear();
        });

        expect(removeSpy).toHaveBeenCalledWith('keydown', handler);
    });

    test('uses specific handler for clear if provided', () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        const { result } = renderHook(() => useKeys());

        act(() => {
            result.current.create(handler1);
            result.current.clear(handler2);
        });

        expect(removeSpy).toHaveBeenCalledWith('keydown', handler2);
    });

    test('cleans up on unmount', () => {
        const handler = jest.fn();
        const { result, unmount } = renderHook(() => useKeys());

        act(() => {
            result.current.create(handler);
        });

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('keydown', handler);
    });

    test('does not error if clear called without handler and no handler set', () => {
        const { result } = renderHook(() => useKeys());

        expect(() => {
            act(() => {
                result.current.clear();
            });
        }).not.toThrow();
    });
});

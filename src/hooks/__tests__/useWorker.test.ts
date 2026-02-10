import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWorker } from '../useWorker';

describe('useWorker', () => {
    let mockWorker: any;
    const mockCreateWorker = vi.fn();

    beforeEach(() => {
        mockWorker = {
            postMessage: vi.fn(),
            terminate: vi.fn(),
            onmessage: null,
            onerror: null,
        };
        mockCreateWorker.mockReturnValue(mockWorker);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useWorker(mockCreateWorker));

        expect(result.current.result).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should start worker and send message when run is called', () => {
        const { result } = renderHook(() => useWorker(mockCreateWorker));
        const input = { data: 'test' };

        act(() => {
            result.current.run(input);
        });

        expect(mockCreateWorker).toHaveBeenCalled();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(mockWorker.postMessage).toHaveBeenCalledWith(input);
    });

    it('should handle successful worker response', () => {
        const onSuccess = vi.fn();
        const { result } = renderHook(() =>
            useWorker(mockCreateWorker, { onSuccess })
        );
        const input = { data: 'test' };

        act(() => {
            result.current.run(input);
        });

        const workerResult = { value: 42 };
        act(() => {
            if (mockWorker.onmessage) {
                mockWorker.onmessage({
                    data: { success: true, result: workerResult },
                } as MessageEvent);
            }
        });

        expect(result.current.result).toEqual(workerResult);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(onSuccess).toHaveBeenCalledWith(workerResult);
    });

    it('should handle error worker response', () => {
        const onError = vi.fn();
        const { result } = renderHook(() =>
            useWorker(mockCreateWorker, { onError })
        );
        const input = { data: 'test' };

        act(() => {
            result.current.run(input);
        });

        const errorMessage = 'Compute failed';
        act(() => {
            if (mockWorker.onmessage) {
                mockWorker.onmessage({
                    data: { success: false, error: errorMessage },
                } as MessageEvent);
            }
        });

        expect(result.current.result).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(onError).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle native worker error', () => {
        const onError = vi.fn();
        const { result } = renderHook(() =>
            useWorker(mockCreateWorker, { onError })
        );

        // Suppress console.error for this test
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        act(() => {
            result.current.run({});
        });

        act(() => {
            if (mockWorker.onerror) {
                mockWorker.onerror(new ErrorEvent('error'));
            }
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(
            'An error occurred in the background worker.'
        );
        expect(onError).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('should handle worker creation failure', () => {
        const failingCreateWorker = () => {
            throw new Error('Creation failed');
        };
        const { result } = renderHook(() => useWorker(failingCreateWorker));

        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        act(() => {
            result.current.run({});
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(
            'Failed to start calculation worker.'
        );

        consoleSpy.mockRestore();
    });

    it('should terminate worker on unmount', () => {
        const { result, unmount } = renderHook(() =>
            useWorker(mockCreateWorker)
        );

        act(() => {
            result.current.run({});
        });

        unmount();

        expect(mockWorker.terminate).toHaveBeenCalled();
    });

    it('should support custom message handler', () => {
        const onMessage = vi.fn((e, { setResult, setLoading }) => {
            setResult(e.data.custom);
            setLoading(false);
        });
        const { result } = renderHook(() =>
            useWorker(mockCreateWorker, { onMessage })
        );

        act(() => {
            result.current.run({});
        });

        act(() => {
            if (mockWorker.onmessage) {
                mockWorker.onmessage({
                    data: { custom: 'payload' },
                } as MessageEvent);
            }
        });

        expect(result.current.result).toBe('payload');
        expect(result.current.loading).toBe(false);
        expect(onMessage).toHaveBeenCalled();
    });

    it('should manual state setters', () => {
        const { result } = renderHook(() => useWorker(mockCreateWorker));

        act(() => {
            result.current.setResult('manual');
            result.current.setError('manual-error');
            result.current.setLoading(true);
        });

        expect(result.current.result).toBe('manual');
        expect(result.current.error).toBe('manual-error');
        expect(result.current.loading).toBe(true);
    });
});

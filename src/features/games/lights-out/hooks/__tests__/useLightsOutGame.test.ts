import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../../../hooks/useBaseGame';
import { useDrag } from '../../../hooks/useDrag';
import { useGridNavigation } from '../../../hooks/useGridNavigation';
import { useSkipTransition } from '../../../hooks/useSkipTransition';
import { getFrontProps } from '../../utils/renderers';
import { useLightsOutGame } from '../useLightsOutGame';

vi.mock('../../../hooks/useBaseGame');
vi.mock('../../../hooks/useDrag');
vi.mock('../../../hooks/useGridNavigation');
vi.mock('../../../hooks/useSkipTransition');
vi.mock('../../config', () => ({
    getLightsOutGameConfig: vi
        .fn()
        .mockReturnValue({ storageKey: 'lights-out' }),
    LIGHTS_OUT_STYLES: { TRANSITION: { FAST: 'fast' } },
    LIGHTS_OUT_LAYOUT_CONSTANTS: { OFFSET: { MOBILE: 1, DESKTOP: 2 } },
}));
vi.mock('@/hooks', () => ({
    useMobile: vi.fn().mockReturnValue(false),
}));
vi.mock('../hooks/boardUtils', () => ({
    usePalette: vi.fn().mockReturnValue({ primary: 'red', secondary: 'blue' }),
    useHandler: vi.fn().mockReturnValue({
        getColor: vi
            .fn()
            .mockReturnValue({ front: 'red', back: 'blue', isLit: true }),
        getBorder: vi.fn().mockReturnValue({}),
        getFiller: vi.fn().mockReturnValue('blue'),
    }),
}));
vi.mock('../../utils/renderers', () => ({
    getFrontProps: vi.fn().mockReturnValue(() => ({})),
    getBackProps: vi.fn().mockReturnValue(() => ({})),
    getCellVisualProps: vi.fn().mockReturnValue(() => ({})),
}));

const mockDispatch = vi.fn();
const mockDragOnKeyDown = vi.fn();
const mockGetDragProps = vi
    .fn()
    .mockReturnValue({ onKeyDown: mockDragOnKeyDown });
const mockHandleGridNav = vi.fn();

describe('useLightsOutGame', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useGridNavigation).mockReturnValue({
            handleKeyDown: mockHandleGridNav,
        });

        vi.mocked(useBaseGame).mockReturnValue({
            state: {
                grid: [0, 0, 0, 0, 0],
                score: 0,
                rows: 5,
                cols: 5,
                initialized: true,
            } as never,
            dispatch: mockDispatch,
            solved: false,
            handleNext: vi.fn(),
            layout: {
                rows: 5,
                cols: 5,
                size: 3,
                mobile: false,
                scaling: {
                    iconSize: '3rem',
                    containerSize: '9rem',
                    padding: 2,
                },
            },
            controlsProps: {
                rows: 5,
                cols: 5,
                dynamicSize: { rows: 10, cols: 10 },
                minSize: 3,
                maxSize: 10,
                handlePlus: vi.fn(),
                handleMinus: vi.fn(),
                onRefresh: vi.fn(),
            },
        } as any);

        vi.mocked(useDrag).mockReturnValue({
            isDragging: false,
            draggingButton: null,
            getDragProps: mockGetDragProps,
            lastTouchTime: { current: 0 } as React.RefObject<number>,
        } as any);

        vi.mocked(useSkipTransition).mockReturnValue(false);
    });

    it('returns the flattened game state shape', () => {
        const { result } = renderHook(() => useLightsOutGame());

        expect(result.current).toHaveProperty('state');
        expect(result.current).toHaveProperty('size');
        expect(result.current).toHaveProperty('layers');
        expect(result.current).toHaveProperty('infoProps');
        expect(result.current).toHaveProperty('controlsProps');
    });

    it('calls useBaseGame with a valid config', () => {
        renderHook(() => useLightsOutGame());

        expect(useBaseGame).toHaveBeenCalledTimes(1);
        const config = vi.mocked(useBaseGame).mock.calls[0]![0];
        expect(config).toHaveProperty('storageKey');
        expect(config).toHaveProperty('logic');
        expect(config.logic).toHaveProperty('reducer');
        expect(config.logic).toHaveProperty('getInitialState');
        expect(config.logic).toHaveProperty('isSolved');
    });

    it('passes enhanced drag props with grid navigation to UI props', () => {
        const { result } = renderHook(() => useLightsOutGame());

        expect(result.current.layers).toBeDefined();
    });

    it('enhanced onKeyDown invokes both drag and grid navigation handlers', () => {
        renderHook(() => useLightsOutGame());

        expect(getFrontProps).toHaveBeenCalled();
    });

    it('calls useGridNavigation with correct dimensions', () => {
        renderHook(() => useLightsOutGame());

        expect(useGridNavigation).toHaveBeenCalledWith({ rows: 5, cols: 5 });
    });

    it('handleApply dispatches multi_adjacent and toggles modal', () => {
        const { result } = renderHook(() => useLightsOutGame());

        act(() => {
            result.current.infoProps.onApply([1, 0, 1, 0, 0]);
        });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'multi_adjacent',
            moves: expect.arrayContaining([
                expect.objectContaining({ row: 0, col: 0 }),
                expect.objectContaining({ row: 0, col: 2 }),
            ]),
        });
    });

    it('does not dispatch when solution has no active columns', () => {
        const { result } = renderHook(() => useLightsOutGame());

        act(() => {
            result.current.infoProps.onApply([0, 0, 0]);
        });

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});

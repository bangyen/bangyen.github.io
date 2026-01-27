import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Snake from '../index';
import * as logic from '../logic';
import { useWindow, useTimer, useKeys, useMobile } from '../../../../hooks';

// Mocks
const mockCreateTimer = jest.fn();
const mockCreateKeys = jest.fn();

jest.mock('../../../../hooks', () => ({
    useWindow: jest.fn(() => ({ width: 400, height: 400 })),
    useTimer: jest.fn(() => ({ create: mockCreateTimer })),
    useKeys: jest.fn(() => ({ create: mockCreateKeys })),
    useMobile: jest.fn(() => false),
}));

let lastCellProps: any = null;
let lastControlHandler: any = null;

jest.mock('../../../../components/ui/CustomGrid', () => ({
    CustomGrid: ({ cellProps }: any) => {
        lastCellProps = cellProps;
        return <div data-testid="snake-grid">Grid</div>;
    },
}));

jest.mock('../../../../components/ui/Controls', () => ({
    Controls: ({ children, onAutoPlay, autoPlayEnabled, handler }: any) => {
        lastControlHandler = handler;
        return (
            <div data-testid="snake-controls">
                <button data-testid="autoplay-btn" onClick={onAutoPlay}>
                    Auto {autoPlayEnabled ? 'On' : 'Off'}
                </button>
                {children}
            </div>
        );
    },
    ArrowsButton: ({ handler }: any) => (
        <button data-testid="arrows-btn" onClick={() => handler('up')()} />
    ),
}));

jest.mock('../../../../components/layout/GlobalHeader', () => ({
    GlobalHeader: () => <div data-testid="global-header" />,
}));

describe('Snake Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Force a stable state
        jest.spyOn(logic, 'handleResize').mockReturnValue({
            velocity: 1,
            buffer: [],
            length: 3,
            rows: 10,
            cols: 10,
            head: 0,
            board: { 0: 3, 5: -1 },
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('full lifecycle and integration', () => {
        const { rerender } = render(<Snake />);

        expect(lastCellProps).toBeDefined();
        expect(lastCellProps(0, 0)).toBeDefined();

        // Interaction
        act(() => {
            lastControlHandler('left')();
        });
        act(() => {
            fireEvent.click(screen.getByTestId('arrows-btn'));
        });

        const keyHandler = mockCreateKeys.mock.calls[0][0];
        act(() => {
            keyHandler({ key: 'ArrowDown' });
        });

        const grid = screen.getByTestId('snake-grid');
        act(() => {
            fireEvent.pointerDown(grid.parentElement!, {
                clientX: 100,
                clientY: 200,
            });
        });

        jest.spyOn(logic, 'handleResize').mockReturnValue({
            velocity: 2,
            buffer: [],
            length: 3,
            rows: 10,
            cols: 10,
            head: 0,
            board: { 0: 3 },
        });
        rerender(<Snake />);
        act(() => {
            fireEvent.pointerDown(grid.parentElement!, {
                clientX: 200,
                clientY: 100,
            });
        });

        jest.spyOn(logic, 'getRandom').mockReturnValue(1);
        act(() => {
            fireEvent.click(screen.getByTestId('autoplay-btn'));
        });
        const nextIter = mockCreateTimer.mock.calls[0][0].repeat;
        act(() => {
            nextIter();
        });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });
    });
});

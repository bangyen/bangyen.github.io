import React from 'react';
import {
    render,
    screen,
    fireEvent,
    act,
    createEvent,
} from '@testing-library/react';
import Snake from '../index';
import * as logic from '../logic';
import { useTimer, useKeys, useMobile, useWindow } from '../../../../hooks';
import { COLORS } from '../../../../config/theme';

// Mock Hooks
jest.mock('../../../../hooks', () => ({
    useWindow: jest.fn(() => ({ height: 800, width: 800 })),
    useTimer: jest.fn(() => ({ create: jest.fn() })),
    useKeys: jest.fn(() => ({ create: jest.fn() })),
    useMobile: jest.fn(() => false),
}));

// Mock MUI
jest.mock('../../../../components/mui', () => ({
    Grid: (props: unknown) => (
        <div data-testid="mui-grid" {...(props as object)} />
    ),
}));

// Mock UI Components
jest.mock('../../../../components/ui/CustomGrid', () => ({
    CustomGrid: ({
        cellProps,
        rows,
        cols,
    }: {
        cellProps: any;
        rows: number;
        cols: number;
    }) => (
        <div data-testid="snake-grid">
            {Array.from({ length: rows * cols }).map((_, i) => {
                const r = Math.floor(i / cols);
                const c = i % cols;
                return (
                    <div
                        key={`cell-${i}`}
                        data-testid={`cell-${i}`}
                        style={cellProps(r, c)}
                    />
                );
            })}
        </div>
    ),
}));

jest.mock('../../../../components/ui/Controls', () => ({
    Controls: ({
        children,
        onAutoPlay,
        handler,
        autoPlayEnabled,
    }: {
        children: React.ReactNode;
        onAutoPlay: () => void;
        handler: (e: string) => () => void;
        autoPlayEnabled: boolean;
    }) => (
        <div data-testid="controls">
            <button onClick={onAutoPlay}>
                {autoPlayEnabled ? 'Stop AutoPlay' : 'Start AutoPlay'}
            </button>
            <button onClick={handler('up')}>Up</button>
            <button onClick={handler('down')}>Down</button>
            <button onClick={handler('left')}>Left</button>
            <button onClick={handler('right')}>Right</button>
            {children}
        </div>
    ),
    ArrowsButton: ({ handler }: { handler: (e: string) => () => void }) => (
        <div data-testid="arrows">
            <button onClick={handler('dir')}>Arrow</button>
        </div>
    ),
}));

jest.mock('../../../../components/layout/GlobalHeader', () => ({
    GlobalHeader: () => <div data-testid="header" />,
}));

// Mock Logic
jest.mock('../logic', () => ({
    handleAction: jest.fn(),
    handleResize: jest.fn(),
    getRandom: jest.fn(),
}));

describe('Snake Component', () => {
    let currentState: logic.SnakeState;

    beforeEach(() => {
        jest.clearAllMocks();

        // Define robust window mocks
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 800,
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 800,
        });

        currentState = {
            velocity: 1,
            buffer: [],
            length: 5,
            rows: 10,
            cols: 10,
            head: 0,
            board: {},
        };

        (logic.handleResize as jest.Mock).mockImplementation(
            () => currentState
        );
        (logic.handleAction as jest.Mock).mockImplementation(s => s);
        (logic.getRandom as jest.Mock).mockReturnValue(0);
        (useWindow as jest.Mock).mockReturnValue({ height: 800, width: 800 });
        (useMobile as jest.Mock).mockReturnValue(false);
    });

    test('renders correctly with initial state', () => {
        render(<Snake />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('snake-grid')).toBeInTheDocument();
    });

    test('colors grid cells correctly', () => {
        currentState = {
            ...currentState,
            rows: 2,
            cols: 2,
            board: {
                0: 5, // Snake body > 0
                1: -1, // Food < 0
            },
        };

        render(<Snake />);

        const snakeCell = screen.getByTestId('cell-0');
        const foodCell = screen.getByTestId('cell-1');
        const emptyCell = screen.getByTestId('cell-2');

        expect(snakeCell).toHaveStyle({ backgroundColor: COLORS.primary.main });
        expect(foodCell).toHaveStyle({ backgroundColor: COLORS.primary.dark });
        expect(emptyCell).toHaveStyle({ backgroundColor: 'inherit' });
    });

    test('handles tap steering (vertical to horizontal)', () => {
        currentState = {
            ...currentState,
            velocity: 2, // Down (Vertical)
            rows: 10,
            cols: 10,
        };

        render(<Snake />);
        const grid = screen.getByTestId('snake-grid');

        // Tap Right (dx > 0) -> 'arrowright'
        (logic.handleAction as jest.Mock).mockClear();
        const eventRight = createEvent.pointerDown(grid, { bubbles: true });
        Object.defineProperty(eventRight, 'clientX', { value: 600 });
        Object.defineProperty(eventRight, 'clientY', { value: 400 });
        fireEvent(grid, eventRight);

        expect(logic.handleAction).toHaveBeenCalled();
        const actionRight = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(actionRight.type).toBe('steer');
        expect(actionRight.payload.key).toBe('arrowright');

        // Tap Left (dx < 0) -> 'arrowleft'
        (logic.handleAction as jest.Mock).mockClear();
        const eventLeft = createEvent.pointerDown(grid, { bubbles: true });
        Object.defineProperty(eventLeft, 'clientX', { value: 200 });
        Object.defineProperty(eventLeft, 'clientY', { value: 400 });
        fireEvent(grid, eventLeft);

        expect(logic.handleAction).toHaveBeenCalled();
        const actionLeft = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(actionLeft.type).toBe('steer');
        expect(actionLeft.payload.key).toBe('arrowleft');
    });

    test('handles tap steering (horizontal to vertical)', () => {
        currentState = {
            ...currentState,
            velocity: 1, // Right (Horizontal)
            rows: 10,
            cols: 10,
        };

        render(<Snake />);
        const grid = screen.getByTestId('snake-grid');

        // Tap Down (dy > 0) -> 'arrowdown'
        (logic.handleAction as jest.Mock).mockClear();
        const eventDown = createEvent.pointerDown(grid, { bubbles: true });
        Object.defineProperty(eventDown, 'clientX', { value: 400 });
        Object.defineProperty(eventDown, 'clientY', { value: 600 });
        fireEvent(grid, eventDown);

        expect(logic.handleAction).toHaveBeenCalled();
        const actionDown = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(actionDown.type).toBe('steer');
        expect(actionDown.payload.key).toBe('arrowdown');

        // Tap Up (dy < 0) -> 'arrowup'
        (logic.handleAction as jest.Mock).mockClear();
        const eventUp = createEvent.pointerDown(grid, { bubbles: true });
        Object.defineProperty(eventUp, 'clientX', { value: 400 });
        Object.defineProperty(eventUp, 'clientY', { value: 200 });
        fireEvent(grid, eventUp);

        expect(logic.handleAction).toHaveBeenCalled();
        const actionUp = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(actionUp.type).toBe('steer');
        expect(actionUp.payload.key).toBe('arrowup');
    });

    test('handles tap steering with buffer', () => {
        const bufferState = {
            ...currentState,
            velocity: 1, // Right
            buffer: [2], // Queued Down
            rows: 10,
            cols: 10,
        };
        (logic.handleResize as jest.Mock).mockImplementation(() => bufferState);

        render(<Snake />);
        const grid = screen.getByTestId('snake-grid');

        // Tap Right (dx > 0) -> 'arrowright'
        (logic.handleAction as jest.Mock).mockClear();
        const event = createEvent.pointerDown(grid, { bubbles: true });
        Object.defineProperty(event, 'clientX', { value: 600 });
        Object.defineProperty(event, 'clientY', { value: 400 });
        fireEvent(grid, event);

        expect(logic.handleAction).toHaveBeenCalled();
        const action = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(action.type).toBe('steer');
        expect(action.payload.key).toBe('arrowright');
    });

    test('handles mobile layout calculation', () => {
        (useMobile as jest.Mock).mockReturnValue(true);
        (logic.handleResize as jest.Mock).mockClear();

        const { container } = render(<Snake />);
        expect(container).toBeInTheDocument();

        expect(logic.handleResize).toHaveBeenCalled();
    });

    test('updates state on size change', () => {
        render(<Snake />);
        (logic.handleAction as jest.Mock).mockClear();

        // Simulate resize
        (useWindow as jest.Mock).mockReturnValue({ height: 500, width: 500 });
        const { rerender } = render(<Snake />);
        rerender(<Snake />);

        expect(logic.handleAction).toHaveBeenCalled();
        expect((logic.handleAction as jest.Mock).mock.calls[0][1].type).toBe(
            'resize'
        );
    });

    test('handles timer tick (move)', () => {
        const createTimer = jest.fn();
        (useTimer as jest.Mock).mockReturnValue({ create: createTimer });

        render(<Snake />);
        (logic.handleAction as jest.Mock).mockClear();

        const config = createTimer.mock.calls[0][0];
        act(() => {
            config.repeat();
        });

        expect(logic.handleAction).toHaveBeenCalled();
        expect((logic.handleAction as jest.Mock).mock.calls[0][1].type).toBe(
            'move'
        );
    });

    test('handles random moves when autoplay enabled', () => {
        const createTimer = jest.fn();
        (useTimer as jest.Mock).mockReturnValue({ create: createTimer });
        (logic.getRandom as jest.Mock).mockReturnValue(1);

        render(<Snake />);

        fireEvent.click(screen.getByText('Start AutoPlay'));

        const config = createTimer.mock.calls[0][0];
        (logic.handleAction as jest.Mock).mockClear();
        act(() => {
            config.repeat();
        });

        expect(logic.handleAction).toHaveBeenCalledTimes(2);
    });

    test('handles keyboard controls', () => {
        const createKeys = jest.fn();
        (useKeys as jest.Mock).mockReturnValue({ create: createKeys });

        render(<Snake />);

        const handler = createKeys.mock.calls[0][0];
        (logic.handleAction as jest.Mock).mockClear();
        act(() => {
            handler({ key: 'ArrowUp' } as KeyboardEvent);
        });

        expect(logic.handleAction).toHaveBeenCalled();
        const action = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(action.type).toBe('steer');
        expect(action.payload.key).toBe('ArrowUp');
    });

    test('handles controls click', () => {
        render(<Snake />);
        (logic.handleAction as jest.Mock).mockClear();
        fireEvent.click(screen.getByText('Up'));

        expect(logic.handleAction).toHaveBeenCalled();
        const action = (logic.handleAction as jest.Mock).mock.calls[0][1];
        expect(action.type).toBe('steer');
        expect(action.payload.key).toBe('arrowup');
    });
});

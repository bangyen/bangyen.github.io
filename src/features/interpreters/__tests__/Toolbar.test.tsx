import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';

import { EditorContext, EditorContextType } from '../EditorContext';
import { Toolbar, handleToolbar, ToolbarPayload } from '../Toolbar';

// Mock components
vi.mock('@/components/ui/Controls', () => ({
    TooltipButton: ({
        title,
        onClick,
        disabled,
    }: {
        title: string;
        onClick: () => void;
        disabled?: boolean;
    }) => (
        <button
            data-testid={`btn-${title}`}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    ),
}));

// Mock icons
vi.mock('@/components/icons', () => ({
    FirstPageRounded: () => <span>First</span>,
    LastPageRounded: () => <span>Last</span>,
    NavigateBeforeRounded: () => <span>Prev</span>,
    NavigateNextRounded: () => <span>Next</span>,
    PlayArrowRounded: () => <span>Play</span>,
    PauseRounded: () => <span>Pause</span>,
}));

// Mock useMediaQuery
vi.mock('@/components/mui', () => ({
    useMediaQuery: vi.fn(() => true), // Desktop by default
}));

describe('Toolbar Component and handleToolbar', () => {
    const mockDispatch = vi.fn();
    const mockCreate = vi.fn();
    const mockClear = vi.fn();
    const mockNextIter = vi.fn();

    const mockPayload = {
        dispatch: mockDispatch,
        create: mockCreate,
        clear: mockClear,
        nextIter: mockNextIter,
        start: {},
    };

    beforeEach(() => {
        vi.clearAllMocks();
        window.confirm = vi.fn(() => true);
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    describe('handleToolbar', () => {
        test('handles run action', () => {
            const result = handleToolbar(
                {},
                {
                    type: 'run',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockCreate).toHaveBeenCalled();
            expect(result.pause).toBe(false);
        });

        test('handles stop action', () => {
            const result = handleToolbar(
                {},
                {
                    type: 'stop',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockClear).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles reset action with confirmation', () => {
            (window.confirm as Mock).mockReturnValue(true);
            const result = handleToolbar(
                {},
                {
                    type: 'reset',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(window.confirm).toHaveBeenCalled();
            expect(mockNextIter).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'clear' })
            );
            expect(result.pause).toBe(true);
        });

        test('handles reset action without confirmation', () => {
            (window.confirm as Mock).mockReturnValue(false);
            handleToolbar(
                {},
                {
                    type: 'reset',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockNextIter).not.toHaveBeenCalled();
        });

        test('handles timer action (next)', () => {
            handleToolbar(
                { end: false },
                {
                    type: 'timer',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'next' })
            );
        });

        test('handles timer action (stop)', () => {
            handleToolbar(
                { end: true },
                {
                    type: 'timer',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'stop' })
            );
        });

        test('handles prev action', () => {
            const result = handleToolbar(
                {},
                {
                    type: 'prev',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockNextIter).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'prev' })
            );
            expect(result.pause).toBe(true);
        });

        test('handles next action', () => {
            handleToolbar(
                {},
                {
                    type: 'next',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(mockNextIter).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'next' })
            );
        });

        test('handles share action', () => {
            handleToolbar(
                {},
                {
                    type: 'share',
                    payload: mockPayload as unknown as ToolbarPayload,
                }
            );
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
    });

    describe('Toolbar Component', () => {
        const renderToolbar = (contextValue: Partial<EditorContextType>) => {
            return render(
                <EditorContext.Provider
                    value={contextValue as EditorContextType}
                >
                    <Toolbar />
                </EditorContext.Provider>
            );
        };

        test('renders nothing without context', () => {
            const { container } = render(
                <EditorContext.Provider value={null}>
                    <Toolbar />
                </EditorContext.Provider>
            );
            expect(container).toBeEmptyDOMElement();
        });

        test('renders buttons correctly', () => {
            const context = {
                name: 'Test Lang',
                pause: true,
                dispatch: vi.fn(() => vi.fn()),
                fastForward: true,
            };
            renderToolbar(context);
            expect(screen.getByTestId('btn-Run')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Reset')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Fast Forward')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Previous')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Next')).toBeInTheDocument();
        });

        test('renders Pause button when not paused', () => {
            const context = {
                name: 'Test Lang',
                pause: false,
                dispatch: vi.fn(() => vi.fn()),
            };
            renderToolbar(context);
            expect(screen.getByTestId('btn-Pause')).toBeInTheDocument();
        });

        test('disables Fast Forward when flag is false', () => {
            const context = {
                name: 'Test Lang',
                pause: true,
                dispatch: vi.fn(() => vi.fn()),
                fastForward: false,
            };
            renderToolbar(context);
            expect(screen.getByTestId('btn-Fast Forward')).toBeDisabled();
        });
    });
});

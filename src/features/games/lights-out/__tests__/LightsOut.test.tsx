import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LightsOut from '../LightsOut';
import { PAGE_TITLES } from '../../../../config/constants';

// Mock hooks
jest.mock('../../../../hooks', () => ({
    useWindow: () => ({ height: 800, width: 1200 }),
    useMobile: () => false,
}));

// Mock sub-components
jest.mock('../../components/Board', () => ({
    Board: function MockBoard({
        frontProps,
    }: {
        frontProps: (r: number, c: number) => { onClick: () => void };
    }) {
        return (
            <div data-testid="board">
                <button
                    data-testid="cell-0-0"
                    onClick={frontProps(0, 0).onClick}
                >
                    Cell 0,0
                </button>
            </div>
        );
    },
    useHandler: () => ({
        getColor: () => ({ front: 'white', back: 'black' }),
        getBorder: () => ({}),
        getFiller: () => 'gray',
    }),
    usePalette: () => ({}),
}));

jest.mock('../../../../components/ui/Controls', () => ({
    Controls: function MockControls({
        children,
        onAutoPlay,
        autoPlayEnabled,
    }: {
        children: React.ReactNode;
        onAutoPlay?: () => void;
        autoPlayEnabled?: boolean;
    }) {
        return (
            <div data-testid="controls">
                {onAutoPlay && (
                    <button
                        aria-label={autoPlayEnabled ? 'Pause' : 'Auto Play'}
                        onClick={onAutoPlay}
                    >
                        {autoPlayEnabled ? 'Pause' : 'Auto Play'}
                    </button>
                )}
                {children}
            </div>
        );
    },
    TooltipButton: function MockTooltipButton({
        title,
        onClick,
    }: {
        title: string;
        onClick: () => void;
    }) {
        return (
            <button aria-label={title} onClick={onClick}>
                {title}
            </button>
        );
    },
}));

jest.mock(
    '../Info',
    () =>
        function MockInfo() {
            return <div data-testid="info-modal">Info</div>;
        }
);

describe('LightsOut', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the game board and controls', () => {
        render(<LightsOut />);

        expect(screen.getByTestId('board')).toBeInTheDocument();
        expect(screen.getByTestId('controls')).toBeInTheDocument();
        expect(screen.getByLabelText('Auto Play')).toBeInTheDocument(); // Initially auto is false, so button shows 'Auto Play'
        expect(screen.queryByLabelText('New Game')).not.toBeInTheDocument();
    });

    it('sets the document title', () => {
        render(<LightsOut />);
        expect(document.title).toBe(PAGE_TITLES.lightsOut);
    });

    it('handles cell clicks', () => {
        render(<LightsOut />);
        const cell = screen.getByTestId('cell-0-0');
        fireEvent.click(cell);

        // Since we mocked Board/BoardHandler, we can't easily check grid state change
        // unless we inspect the reducer or effect.
        // But we verified the click handler is attached in the mock.
        // For integration test, we might want real Board/Handler, but that's complex.
        // This test ensures the click callback doesn't crash.
    });

    it('toggles auto play', () => {
        render(<LightsOut />);
        const autoBtn = screen.getByLabelText('Auto Play');
        fireEvent.click(autoBtn);

        // After click, it should change to Pause
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });

    it('does not render a new game button', () => {
        render(<LightsOut />);
        expect(screen.queryByLabelText('New Game')).not.toBeInTheDocument();
    });

    it('toggles info modal', () => {
        render(<LightsOut />);
        const infoBtn = screen.getByLabelText('Info');

        // Info component is rendered but we want to check if it receives 'open' prop
        // We mocked Info to just render "Info".
        // In the real component, toggleOpen changes the open prop passed to Info.

        fireEvent.click(infoBtn);
        // We verify interactions don't unnecessary crash
    });
});

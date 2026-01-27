import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Program, Tape, Output, Register, DisplayModeToggle } from '../Display';
import { EditorContext } from '../EditorContext';

// Mocks
jest.mock('../../../components/mui', () => ({
    Box: ({ children, sx, ...props }: any) => <div data-testid="box" {...props}>{children}</div>,
    Typography: ({ children, ...props }: any) => <span data-testid="typography" {...props}>{children}</span>,
    Chip: ({ label }: any) => <div data-testid="chip">{label}</div>,
    IconButton: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('../components/Text', () => ({
    Text: ({ text, color }: any) => <span data-testid="text-comp" data-color={color}>{text}</span>,
}));

jest.mock('../../../components/ui/GlassCard', () => ({
    GlassCard: ({ children }: any) => <div data-testid="glass-card">{children}</div>,
}));

jest.mock('../../../components/icons', () => ({
    CodeRounded: () => <svg data-testid="icon-code" />,
    DataArrayRounded: () => <svg data-testid="icon-tape" />,
    TextFieldsRounded: () => <svg data-testid="icon-output" />,
    PlusOneRounded: () => <svg data-testid="icon-register" />,
    ViewModuleRounded: () => <svg data-testid="icon-module" />,
    ViewListRounded: () => <svg data-testid="icon-list" />,
}));

const mockContextValue = {
    code: 'ABC',
    index: 0,
    tape: [1, 2, 3],
    pointer: 1,
    tapeFlag: true,
    output: 'Hello',
    outFlag: true,
    register: 42,
    regFlag: true,
};

describe('Display Components', () => {
    const renderWithContext = (ui: React.ReactNode, contextValue: any = mockContextValue) => {
        return render(
            <EditorContext.Provider value={contextValue}>
                {ui}
            </EditorContext.Provider>
        );
    };

    describe('Program', () => {
        test('renders nothing if no context', () => {
            render(<Program />);
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders nothing if code undefined', () => {
            renderWithContext(<Program />, { ...mockContextValue, code: undefined });
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders standard mode', () => {
            renderWithContext(<Program />);
            expect(screen.getByText('Program')).toBeInTheDocument();
            expect(screen.getByTestId('icon-code')).toBeInTheDocument();
            // Check content. "ABC" -> "A", "B", "C". Plus spacer "\xA0".
            // mockContextValue.code is string "ABC".
            // Display: data={[...code]} -> ['A','B','C'].
            // plus child Text '\xA0'.
            // Total 4 Text comps.
            expect(screen.getAllByTestId('text-comp')).toHaveLength(4);
        });

        test('renders compact mode', () => {
            renderWithContext(<Program compact={true} />);
            expect(screen.getAllByTestId('chip')).toHaveLength(3);
        });
    });

    describe('Tape', () => {
        test('renders nothing if no context', () => {
            render(<Tape />);
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders nothing if flag false', () => {
            renderWithContext(<Tape />, { ...mockContextValue, tapeFlag: false });
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders standard mode', () => {
            renderWithContext(<Tape />);
            expect(screen.getByText('Tape')).toBeInTheDocument();
            // Tape: [1,2,3] + spacer -> 4.
            expect(screen.getAllByTestId('text-comp')).toHaveLength(4);
        });

        test('renders compact mode', () => {
            renderWithContext(<Tape compact={true} />);
            expect(screen.getAllByTestId('chip')).toHaveLength(3);
        });
    });

    describe('Output', () => {
        test('renders nothing if no context', () => {
            render(<Output />);
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders nothing if flag false', () => {
            renderWithContext(<Output />, { ...mockContextValue, outFlag: false });
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders standard mode (string)', () => {
            renderWithContext(<Output />);
            expect(screen.getByText('Output')).toBeInTheDocument();
            // Output 'Hello' (string) -> data=['Hello'].
            // Plus spacer -> 2.
            expect(screen.getAllByTestId('text-comp')).toHaveLength(2);
        });

        test('renders compact mode (array)', () => {
            renderWithContext(<Output compact={true} />, { ...mockContextValue, output: ['A', 'B'] });
            expect(screen.getAllByTestId('chip')).toHaveLength(2);
        });
    });

    describe('Register', () => {
        test('renders nothing if no context', () => {
            render(<Register />);
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders nothing if flag false', () => {
            renderWithContext(<Register />, { ...mockContextValue, regFlag: false });
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });

        test('renders value', () => {
            renderWithContext(<Register />);
            expect(screen.getByText('Register')).toBeInTheDocument();
            // Register 42. data=[42]. Spacer. -> 2.
            expect(screen.getAllByTestId('text-comp')).toHaveLength(2);
        });

        test('renders in compact mode', () => {
            renderWithContext(<Register compact={true} />);
            expect(screen.getAllByTestId('chip')).toHaveLength(1);
        });
    });

    describe('DisplayModeToggle', () => {
        test('toggles mode', () => {
            const setCompact = jest.fn();
            render(<DisplayModeToggle compactMode={false} setCompactMode={setCompact} />);

            const btn = screen.getByRole('button');
            fireEvent.click(btn);
            expect(setCompact).toHaveBeenCalledWith(true);
        });

        test('shows correct icon', () => {
            const { rerender } = render(<DisplayModeToggle compactMode={false} setCompactMode={() => { }} />);
            expect(screen.getByTestId('icon-module')).toBeInTheDocument();

            rerender(<DisplayModeToggle compactMode={true} setCompactMode={() => { }} />);
            expect(screen.getByTestId('icon-list')).toBeInTheDocument();
        });
    });
});

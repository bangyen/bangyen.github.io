import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { EditorContext } from '../EditorContext';
import { Program, Tape, Output, Register } from '../Display';

const theme = createTheme();

interface EditorContextType {
    name: string;
    tapeFlag: boolean;
    outFlag: boolean;
    regFlag: boolean;
    code: string[] | undefined;
    index: number;
    tape: number[];
    pointer: number;
    output: string[] | string;
    register: number;
    height: number;
    size: number;
    dispatch: jest.Mock;
    fastForward: boolean;
    pause: boolean;
}

// Mock EditorContext data
const mockEditorContext: EditorContextType = {
    name: 'Test Interpreter',
    tapeFlag: true,
    outFlag: true,
    regFlag: true,
    code: ['+', '-', '>', '<'],
    index: 2,
    tape: [0, 1, 2, 3],
    pointer: 1,
    output: ['Hello', 'World'],
    register: 42,
    height: 400,
    size: 20,
    dispatch: jest.fn(),
    fastForward: false,
    pause: false,
};

const EditorProvider = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
        <EditorContext.Provider value={mockEditorContext}>
            {children}
        </EditorContext.Provider>
    </ThemeProvider>
);

describe('Display Components', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Program', () => {
        test('renders program when code is defined', () => {
            render(
                <EditorProvider>
                    <Program />
                </EditorProvider>
            );

            expect(screen.getByText('Program')).toBeInTheDocument();
        });

        test('does not render when code is undefined', () => {
            const contextWithoutCode = {
                ...mockEditorContext,
                code: undefined,
            };

            render(
                <EditorContext.Provider value={contextWithoutCode}>
                    <Program />
                </EditorContext.Provider>
            );

            expect(screen.queryByText('Program')).not.toBeInTheDocument();
        });

        test('displays current instruction pointer', () => {
            render(
                <EditorProvider>
                    <Program />
                </EditorProvider>
            );

            expect(screen.getByText('Program')).toBeInTheDocument();
        });

        test('renders in compact mode', () => {
            render(
                <EditorProvider>
                    <Program compact={true} />
                </EditorProvider>
            );

            expect(screen.getByText('Program')).toBeInTheDocument();
        });
    });

    describe('Tape', () => {
        test('renders tape when tapeFlag is true', () => {
            render(
                <EditorProvider>
                    <Tape />
                </EditorProvider>
            );

            expect(screen.getByText('Tape')).toBeInTheDocument();
        });

        test('does not render when tapeFlag is false', () => {
            const contextWithoutTape = {
                ...mockEditorContext,
                tapeFlag: false,
            };

            render(
                <EditorContext.Provider value={contextWithoutTape}>
                    <Tape />
                </EditorContext.Provider>
            );

            expect(screen.queryByText('Tape')).not.toBeInTheDocument();
        });

        test('displays tape values', () => {
            render(
                <EditorProvider>
                    <Tape />
                </EditorProvider>
            );

            expect(screen.getByText('Tape')).toBeInTheDocument();
        });

        test('renders in compact mode', () => {
            render(
                <EditorProvider>
                    <Tape compact={true} />
                </EditorProvider>
            );

            expect(screen.getByText('Tape')).toBeInTheDocument();
        });
    });

    describe('Output', () => {
        test('renders output when outFlag is true', () => {
            render(
                <EditorProvider>
                    <Output />
                </EditorProvider>
            );

            expect(screen.getByText('Output')).toBeInTheDocument();
        });

        test('does not render when outFlag is false', () => {
            const contextWithoutOutput = {
                ...mockEditorContext,
                outFlag: false,
            };

            render(
                <EditorContext.Provider value={contextWithoutOutput}>
                    <Output />
                </EditorContext.Provider>
            );

            expect(screen.queryByText('Output')).not.toBeInTheDocument();
        });

        test('displays output values', () => {
            render(
                <EditorProvider>
                    <Output />
                </EditorProvider>
            );

            expect(screen.getByText('Output')).toBeInTheDocument();
        });

        test('renders in compact mode', () => {
            render(
                <EditorProvider>
                    <Output compact={true} />
                </EditorProvider>
            );

            expect(screen.getByText('Output')).toBeInTheDocument();
        });
    });

    describe('Register', () => {
        test('renders register when regFlag is true', () => {
            render(
                <EditorProvider>
                    <Register />
                </EditorProvider>
            );

            expect(screen.getByText('Register')).toBeInTheDocument();
        });

        test('does not render when regFlag is false', () => {
            const contextWithoutRegister = {
                ...mockEditorContext,
                regFlag: false,
            };

            render(
                <EditorContext.Provider value={contextWithoutRegister}>
                    <Register />
                </EditorContext.Provider>
            );

            expect(screen.queryByText('Register')).not.toBeInTheDocument();
        });

        test('displays register value', () => {
            render(
                <EditorProvider>
                    <Register />
                </EditorProvider>
            );

            expect(screen.getByText('Register')).toBeInTheDocument();
        });

        test('renders in compact mode', () => {
            render(
                <EditorProvider>
                    <Register compact={true} />
                </EditorProvider>
            );

            expect(screen.getByText('Register')).toBeInTheDocument();
        });
    });
});

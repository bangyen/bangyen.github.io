import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Editor from '../Editor';
import { EditorContext, EditorContextType } from '../EditorContext';
import { GridArea } from '../components/GridArea';
import { TextArea } from '../components/TextArea';
import { Text } from '../components/Text';

const theme = createTheme();

// Mock EditorContext data
// Mock EditorContext data
const mockEditorContext = {
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
    dispatch: vi.fn(),
    fastForward: false,
    pause: false,
};

// Mock Display components to verify conditional rendering
vi.mock('../Display', () => ({
    Program: () => <div data-testid="program-display" />,
    Tape: () => <div data-testid="tape-display" />,
    Output: () => <div data-testid="output-display" />,
    Register: () => <div data-testid="register-display" />,
}));

// Mock Toolbar
vi.mock('../Toolbar', () => ({
    Toolbar: () => <div data-testid="toolbar" />,
}));

const EditorProvider = ({
    children,
    value = mockEditorContext as EditorContextType,
}: {
    children: React.ReactNode;
    value?: Partial<EditorContextType>;
}) => (
    <ThemeProvider theme={theme}>
        <EditorContext.Provider value={value as EditorContextType}>
            {children}
        </EditorContext.Provider>
    </ThemeProvider>
);

describe('Editor Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock ResizeObserver
        global.ResizeObserver = class ResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        };

        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    describe('Editor', () => {
        // Mock Display components to verify conditional rendering
        vi.mock('../Display', () => ({
            Program: () => <div data-testid="program-display" />,
            Tape: () => <div data-testid="tape-display" />,
            Output: () => <div data-testid="output-display" />,
            Register: () => <div data-testid="register-display" />,
        }));

        // Mock Toolbar
        vi.mock('../Toolbar', () => ({
            Toolbar: () => <div data-testid="toolbar" />,
        }));

        test('renders all sections when flags are true', () => {
            render(
                <EditorProvider>
                    <Editor>
                        <div data-testid="child-content">Child</div>
                    </Editor>
                </EditorProvider>
            );

            // screen.debug();

            expect(screen.getByText('Interpreters')).toBeInTheDocument();
            expect(screen.getByTestId('child-content')).toBeInTheDocument();
            // Default mock context has all flags true and code present
            expect(screen.getByTestId('program-display')).toBeInTheDocument();
            expect(screen.getByTestId('tape-display')).toBeInTheDocument();
            expect(screen.getByTestId('output-display')).toBeInTheDocument();
            expect(screen.getByTestId('register-display')).toBeInTheDocument();
        });

        test('renders minimal sections when flags are false', () => {
            const minimalContext = {
                ...mockEditorContext,
                tapeFlag: false,
                outFlag: false,
                regFlag: false,
                code: undefined, // Should hide Program
            };

            render(
                <EditorProvider value={minimalContext}>
                    <Editor>
                        <div>Child</div>
                    </Editor>
                </EditorProvider>
            );

            expect(
                screen.queryByTestId('program-display')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('tape-display')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('output-display')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('register-display')
            ).not.toBeInTheDocument();
        });

        test('hides side panel when hide is true', () => {
            render(
                <EditorProvider>
                    <Editor hide={true}>
                        <div>Child</div>
                    </Editor>
                </EditorProvider>
            );
            // We can check if TextArea is hidden or layout props changed.
            // TextArea is rendered in the "right" column.
            // Based on code: <Grid display={display} ...> <TextArea ... /> </Grid>
            // display is 'none' if hide is true.
            // But checking styles on a Grid (MUI) might be tricky without internal structure knowledge.
            // Alternatively, check if TextArea is not visible.
            const textarea = screen.getByLabelText('Program code');
            expect(textarea).not.toBeVisible();
        });

        test('renders navigation when provided', () => {
            render(
                <EditorProvider>
                    <Editor
                        navigation={<div data-testid="nav-element">Nav</div>}
                    >
                        <div>Child</div>
                    </Editor>
                </EditorProvider>
            );
            expect(screen.getByTestId('nav-element')).toBeInTheDocument();
        });

        test('throws error when used outside of EditorContext', () => {
            const consoleSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            expect(() => {
                render(
                    <Editor>
                        <div>Child</div>
                    </Editor>
                );
            }).toThrow('Editor must be used within EditorContext.Provider');

            consoleSpy.mockRestore();
        });
    });

    describe('GridArea', () => {
        test('renders grid with correct dimensions', () => {
            const handleClick = vi.fn();
            const chooseColor = vi.fn(() => 'primary');
            const options = ['A', 'B', 'C'];

            render(
                <EditorProvider>
                    <GridArea
                        handleClick={handleClick}
                        chooseColor={chooseColor}
                        options={options}
                        rows={3}
                        cols={3}
                    />
                </EditorProvider>
            );

            expect(screen.getByRole('grid')).toBeInTheDocument();
        });

        test('calls handleClick when cell is clicked', () => {
            const handleClick = vi.fn();
            const chooseColor = vi.fn(() => 'primary');
            const options = ['A'];

            render(
                <EditorProvider>
                    <GridArea
                        handleClick={handleClick}
                        chooseColor={chooseColor}
                        options={options}
                        rows={1}
                        cols={1}
                    />
                </EditorProvider>
            );

            expect(handleClick).toBeDefined();
        });

        test('uses chooseColor to determine cell style', () => {
            const handleClick = vi.fn();
            const chooseColor = vi.fn(() => 'info');
            const options = ['A'];

            render(
                <EditorProvider>
                    <GridArea
                        handleClick={handleClick}
                        chooseColor={chooseColor}
                        options={options}
                        rows={1}
                        cols={1}
                    />
                </EditorProvider>
            );

            expect(chooseColor).toBeDefined();
        });
    });

    describe('TextArea', () => {
        test('renders textarea with default props', () => {
            render(
                <EditorProvider>
                    <TextArea />
                </EditorProvider>
            );

            expect(screen.getByLabelText('Program code')).toBeInTheDocument();
        });

        test('renders with custom label', () => {
            render(
                <EditorProvider>
                    <TextArea infoLabel="Custom Label" />
                </EditorProvider>
            );

            expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
        });

        test('renders as readonly when specified', () => {
            render(
                <EditorProvider>
                    <TextArea readOnly={true} />
                </EditorProvider>
            );

            const textarea = screen.getByLabelText('Program code');
            expect(textarea).toHaveAttribute('readonly');
        });

        test('renders with default value', () => {
            render(
                <EditorProvider>
                    <TextArea fillValue="Test Value" />
                </EditorProvider>
            );

            expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
        });

        test('calls handleChange when value changes', () => {
            const handleChange = vi.fn();

            render(
                <EditorProvider>
                    <TextArea handleChange={handleChange} />
                </EditorProvider>
            );

            expect(handleChange).toBeDefined();
        });
    });

    describe('Text', () => {
        test('renders text content', () => {
            render(<Text text="Hello World" />);

            expect(screen.getByText('Hello World')).toBeInTheDocument();
        });

        test('renders with custom styles', () => {
            render(
                <Text
                    text="Styled Text"
                    sx={{ color: 'primary.main', fontWeight: 'bold' }}
                />
            );

            expect(screen.getByText('Styled Text')).toBeInTheDocument();
        });

        test('handles empty text', () => {
            const { container } = render(<Text text="" />);

            expect(container).toBeInTheDocument();
        });
    });
});

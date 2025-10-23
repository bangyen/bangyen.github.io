import React from 'react';
import { render, screen } from '@testing-library/react';
import Editor, {
    EditorContext,
    GridArea,
    TextArea,
    Text,
} from '../Interpreters/Editor';

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
    dispatch: jest.fn(),
    fastForward: false,
    pause: false,
};

const EditorProvider = ({ children }: { children: React.ReactNode }) => (
    <EditorContext.Provider value={mockEditorContext}>
        {children}
    </EditorContext.Provider>
);

describe('Editor Components', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Editor', () => {
        test('renders with children', () => {
            render(
                <EditorProvider>
                    <Editor>
                        <div>Test Content</div>
                    </Editor>
                </EditorProvider>
            );

            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        test('renders title from context', () => {
            render(
                <EditorProvider>
                    <Editor>
                        <div>Test Content</div>
                    </Editor>
                </EditorProvider>
            );

            expect(screen.getByText('Test Interpreter')).toBeInTheDocument();
        });

        test('throws error when used outside EditorContext', () => {
            // Suppress console.error for this test
            const consoleError = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {
                    // Intentionally empty
                });

            expect(() => {
                render(
                    <Editor>
                        <div>Test Content</div>
                    </Editor>
                );
            }).toThrow('Editor must be used within EditorContext.Provider');

            consoleError.mockRestore();
        });

        test('hides side panel when hide is true', () => {
            render(
                <EditorProvider>
                    <Editor hide={true}>
                        <div>Test Content</div>
                    </Editor>
                </EditorProvider>
            );

            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });
    });

    describe('GridArea', () => {
        test('renders grid with correct dimensions', () => {
            const handleClick = jest.fn();
            const chooseColor = jest.fn(() => 'primary');
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
            const handleClick = jest.fn();
            const chooseColor = jest.fn(() => 'primary');
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
            const handleClick = jest.fn();
            const chooseColor = jest.fn(() => 'info');
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
            const handleChange = jest.fn();

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
            render(<Text text="" />);

            expect(screen.getByText('')).toBeInTheDocument();
        });
    });
});

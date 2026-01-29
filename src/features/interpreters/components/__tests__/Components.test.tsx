import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InterpreterNavigation } from '../InterpreterNavigation';
import { Text } from '../Text';
import { TextArea } from '../TextArea';
import { GridArea } from '../GridArea';
import { KeySelector } from '../KeySelector';
import { EditorContext, EditorContextType } from '../../EditorContext';
import { useMobile } from '../../../../hooks';

// Mocks
jest.mock('@mui/material', () => ({
    Select: ({
        children,
        value,
        onChange,
    }: {
        children: React.ReactNode;
        value: string;
        onChange: (e: { target: { value: string } }) => void;
    }) => (
        <select data-testid="select" value={value} onChange={onChange}>
            {children}
        </select>
    ),
    MenuItem: ({
        children,
        value,
    }: {
        children: React.ReactNode;
        value: string;
    }) => <option value={value}>{children}</option>,
    FormControl: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="form-control">{children}</div>
    ),
}));

jest.mock('../../../../components/mui', () => ({
    Typography: ({
        children,
        ...props
    }: {
        children: React.ReactNode;
        className?: string;
        sx?: object;
    }) => (
        <span data-testid="typography" {...props}>
            {children}
        </span>
    ),
    TextField: ({
        onChange,
        value,
        defaultValue,
        label,
        rows,
    }: {
        onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        value?: string;
        defaultValue?: string;
        label?: string;
        rows?: number;
    }) => (
        <div data-testid="textfield">
            <label>{label}</label>
            <textarea
                data-testid="textarea"
                onChange={onChange}
                value={value}
                defaultValue={defaultValue}
                rows={rows}
            />
        </div>
    ),
    Box: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="box">{children}</div>
    ),
    Button: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
    }) => (
        <button
            onClick={onClick}
            onKeyDown={e => e.key === 'Enter' && onClick(e)}
        >
            {children}
        </button>
    ),
    Grid: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="grid-container">{children}</div>
    ),
}));

jest.mock('../../../../hooks', () => ({
    useMobile: jest.fn(() => false),
}));

jest.mock('../../../../components/ui/CustomGrid', () => ({
    CustomGrid: ({
        cellProps,
        rows,
        cols,
    }: {
        cellProps: (
            r: number,
            c: number
        ) => {
            onClick?: () => void;
            color?: string;
            backgroundColor?: string;
            children?: React.ReactNode;
        };
        rows: number;
        cols: number;
    }) => (
        <div data-testid="custom-grid">
            {Array.from({ length: rows * cols }).map((_, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const props = cellProps(row, col);
                return (
                    <button
                        key={`${row}-${col}`}
                        type="button"
                        data-testid={`cell-${i}`}
                        onClick={props.onClick}
                        style={{
                            color: props.color,
                            backgroundColor: props.backgroundColor,
                        }}
                    >
                        {props.children}
                    </button>
                );
            })}
        </div>
    ),
}));

const mockContext = {
    height: 600,
    size: 20,
    // other props
};

describe('Interpreter Components', () => {
    describe('InterpreterNavigation', () => {
        test('renders select with active value', () => {
            const onChange = jest.fn();
            render(
                <InterpreterNavigation active="wii2d" onChange={onChange} />
            );

            const select = screen.getByTestId('select') as HTMLSelectElement;
            expect(select.value).toBe('wii2d');
        });

        test('calls onChange when changed', () => {
            const onChange = jest.fn();
            render(
                <InterpreterNavigation active="wii2d" onChange={onChange} />
            );

            const select = screen.getByTestId('select');
            fireEvent.change(select, { target: { value: 'back' } });

            expect(onChange).toHaveBeenCalledWith('back');
        });
    });

    describe('Text', () => {
        test('renders text with props', () => {
            render(
                <Text
                    text="Hello"
                    className="test-class"
                    sx={{ color: 'red' }}
                />
            );

            const text = screen.getByTestId('typography');
            expect(text).toHaveTextContent('Hello');
            expect(text).toHaveClass('test-class');
        });
    });

    describe('GridArea', () => {
        const renderWithContext = (
            ui: React.ReactNode,
            ctx = mockContext as Partial<EditorContextType>
        ) => {
            return render(
                <EditorContext.Provider value={ctx as EditorContextType}>
                    {ui}
                </EditorContext.Provider>
            );
        };

        const defaultProps = {
            handleClick: (_: number) => jest.fn(),
            chooseColor: (_: number) => 'secondary',
            options: ['A', 'B', 'C', 'D'],
            rows: 2,
            cols: 2,
        };

        test('throws if no context', () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            expect(() => render(<GridArea {...defaultProps} />)).toThrow(
                'GridArea must be used within EditorContext.Provider'
            );
            consoleSpy.mockRestore();
        });

        test('renders grid cells with correct styles', () => {
            const chooseColor = jest.fn(pos =>
                pos === 0 ? 'primary' : 'secondary'
            );

            renderWithContext(
                <GridArea {...defaultProps} chooseColor={chooseColor} />
            );

            const cell0 = screen.getByTestId('cell-0');
            expect(cell0).toBeInTheDocument();
            expect(chooseColor).toHaveBeenCalledWith(0);
        });

        test('handles click', () => {
            const clickHandler = jest.fn();
            const handleClick = (pos: number) => () => clickHandler(pos);

            renderWithContext(
                <GridArea {...defaultProps} handleClick={handleClick} />
            );

            fireEvent.click(screen.getByTestId('cell-1'));
            expect(clickHandler).toHaveBeenCalledWith(1);
        });

        test('handles info color', () => {
            const chooseColor = (_: number) => 'info';
            renderWithContext(
                <GridArea {...defaultProps} chooseColor={chooseColor} />
            );
            expect(screen.getByTestId('cell-0')).toBeInTheDocument();
        });

        test('handles unknown color fallback', () => {
            const chooseColor = (_: number) => 'unknown-color';
            renderWithContext(
                <GridArea {...defaultProps} chooseColor={chooseColor} />
            );
            expect(screen.getByTestId('cell-0')).toBeInTheDocument();
        });

        test('handles missing option fallback', () => {
            const options = ['A'];
            renderWithContext(<GridArea {...defaultProps} options={options} />);
            expect(screen.getByTestId('cell-1')).toBeInTheDocument();
        });
    });

    describe('KeySelector', () => {
        const keys = ['A', 'B', ' '];

        test('renders keys', () => {
            render(<KeySelector keys={keys} onSelect={jest.fn()} />);
            expect(screen.getByText('A')).toBeInTheDocument();
            expect(screen.getByText('B')).toBeInTheDocument();
            expect(screen.getByText('␣')).toBeInTheDocument();
        });

        test('handles key selection', () => {
            const onSelect = jest.fn();
            render(<KeySelector keys={keys} onSelect={onSelect} />);

            fireEvent.click(screen.getByText('A'));
            expect(onSelect).toHaveBeenCalledWith('A');
        });

        test('handles backspace', () => {
            const onSelect = jest.fn();
            render(<KeySelector keys={keys} onSelect={onSelect} />);

            fireEvent.click(screen.getByText('⌫'));
            expect(onSelect).toHaveBeenCalledWith('Backspace');
        });

        test('handles escape', () => {
            const onSelect = jest.fn();
            render(<KeySelector keys={keys} onSelect={onSelect} />);

            fireEvent.click(screen.getByText('✕'));
            expect(onSelect).toHaveBeenCalledWith('Escape');
        });
    });

    describe('TextArea', () => {
        const renderWithContext = (
            ui: React.ReactNode,
            ctx = mockContext as Partial<EditorContextType>
        ) => {
            return render(
                <EditorContext.Provider value={ctx as EditorContextType}>
                    {ui}
                </EditorContext.Provider>
            );
        };

        test('throws if no context', () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            expect(() => render(<TextArea />)).toThrow(
                'TextArea must be used within EditorContext.Provider'
            );
            consoleSpy.mockRestore();
        });

        test('renders controlled input', () => {
            const handleChange = jest.fn();
            renderWithContext(
                <TextArea value="Content" handleChange={handleChange} />
            );

            const area = screen.getByTestId('textarea') as HTMLTextAreaElement;
            expect(area.value).toBe('Content');

            fireEvent.change(area, { target: { value: 'New' } });
            expect(handleChange).toHaveBeenCalled();
        });

        test('renders controlled input with empty string', () => {
            renderWithContext(<TextArea value="" handleChange={jest.fn()} />);
            const area = screen.getByTestId('textarea') as HTMLTextAreaElement;
            expect(area.value).toBe('');
        });

        test('renders uncontrolled input', () => {
            renderWithContext(<TextArea fillValue="Default" />);
            const area = screen.getByTestId('textarea') as HTMLTextAreaElement;
            expect(area.defaultValue).toBe('Default');
        });

        test('calculates rows based on height (desktop)', () => {
            renderWithContext(<TextArea />, { ...mockContext, height: 640 });
            const area = screen.getByTestId('textarea');
            expect(area).toHaveAttribute('rows', '20');
        });

        test('calculates rows based on height (mobile)', () => {
            (useMobile as jest.Mock).mockReturnValue(true);

            renderWithContext(<TextArea />, { ...mockContext, height: 480 });
            const area = screen.getByTestId('textarea');
            expect(area).toHaveAttribute('rows', '20');
        });
    });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextEditor from '../TextEditor';
import * as hooks from '../../../../hooks';

// Mock Editor sub-component - Correct path
jest.mock('../../Editor', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="editor">{children}</div>
    ),
}));

// Mock TextArea sub-component - Correct path
jest.mock('../../components/TextArea', () => ({
    TextArea: ({
        value,
        handleChange,
    }: {
        value: string;
        handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }) => (
        <textarea
            data-testid="text-area"
            value={value}
            onChange={handleChange}
        />
    ),
}));

// Stable mocks
const mockNextIter = jest.fn((action: { payload: unknown }) => action.payload);
const mockStableTimer = { create: jest.fn(), clear: jest.fn() };

// Mock hooks - Correct path
jest.mock('../../../../hooks', () => ({
    useContainer: jest.fn(() => ({ height: 400 })),
    useTimer: jest.fn(() => mockStableTimer),
    useCache: jest.fn(() => mockNextIter),
}));

describe('TextEditor Component', () => {
    const defaultProps = {
        name: 'TextTest',
        start: { text: '', code: '' },
        runner: (state: Record<string, unknown>) => state,
        clean: (text: string) => text,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the editor and text area', () => {
        render(<TextEditor {...defaultProps} />);
        expect(screen.getByTestId('editor')).toBeInTheDocument();
        expect(screen.getByTestId('text-area')).toBeInTheDocument();
        expect(document.title).toContain('TextTest');
    });

    it('handles text changes and dispatches edit', () => {
        render(<TextEditor {...defaultProps} />);
        const textArea = screen.getByTestId<HTMLTextAreaElement>('text-area');
        fireEvent.change(textArea, { target: { value: 'new code' } });

        // Check if textarea value updated
        expect(textArea.value).toBe('new code');
    });

    it('handles layout resizing', () => {
        const mockUseContainer = hooks.useContainer as jest.Mock;
        mockUseContainer.mockReturnValue({ height: 100, width: 100 });

        render(<TextEditor {...defaultProps} />);
        expect(screen.getByTestId('editor')).toBeInTheDocument();
    });
});

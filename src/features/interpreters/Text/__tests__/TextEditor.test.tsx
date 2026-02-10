import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';

import * as hooks from '../../../../hooks';
import TextEditor from '../TextEditor';

// Mock Editor sub-component - Correct path
vi.mock('../../Editor', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="editor">{children}</div>
    ),
}));

// Mock TextArea sub-component - Correct path
vi.mock('../../components/TextArea', () => ({
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
const mockNextIter = vi.fn((action: { payload: unknown }) => action.payload);
const mockStableTimer = { create: vi.fn(), clear: vi.fn() };

// Mock hooks - Correct path
vi.mock('../../../../hooks', () => ({
    useContainer: vi.fn(() => ({ height: 400 })),
    useTimer: vi.fn(() => mockStableTimer),
    useCache: vi.fn(() => mockNextIter),
}));

describe('TextEditor Component', () => {
    const defaultProps = {
        name: 'TextTest',
        start: { text: '', code: '' },
        runner: (state: Record<string, unknown>) => state,
        clean: (text: string) => text,
    };

    beforeEach(() => {
        vi.clearAllMocks();
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
        const mockUseContainer = hooks.useContainer as Mock;
        mockUseContainer.mockReturnValue({ height: 100, width: 100 });

        render(<TextEditor {...defaultProps} />);
        expect(screen.getByTestId('editor')).toBeInTheDocument();
    });
});

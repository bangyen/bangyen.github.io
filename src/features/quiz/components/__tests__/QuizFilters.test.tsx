import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import QuizFilters from '../QuizFilters';
import { COLORS } from '../../../config/theme';

const mockSettings = {
    mode: 'mode1',
    maxQuestions: 10,
    filterLanguage: 'All',
    filterZone: 'All',
    filterConvention: 'All',
    filterSide: 'All',
    filterSwitch: 'All',
    filterLetter: '',
};

const mockConfig = {
    hasModeSelect: true,
    modes: [
        { value: 'mode1', label: 'Mode 1' },
        { value: 'mode2', label: 'Mode 2' },
        { value: 'toCountry', label: 'To Country' },
        { value: 'otherMode', label: 'Other Mode' },
    ],
    maxQuestionOptions: [5, 10, 20],
};

const mockOnChange = jest.fn();
const mockOnEnter = jest.fn();

const defaultProps = {
    selectedQuiz: 'cctld',
    settings: mockSettings,
    onSettingsChange: mockOnChange,
    activeConfig: mockConfig,
    commonSelectProps: {},
    onEnterKey: mockOnEnter,
};

describe('QuizFilters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper to check if a text exists (handling multiple matches due to MUI legends)
    const expectText = (text: string) => {
        const elements = screen.getAllByText(text);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();
    };

    test('renders Game Mode selector when activeConfig has modes', () => {
        render(<QuizFilters {...defaultProps} />);
        expectText('Game Mode');
    });

    test('renders placeholder when Game Mode is disabled', () => {
        const noModeConfig = {
            ...mockConfig,
            hasModeSelect: false,
            modes: null,
        };
        render(<QuizFilters {...defaultProps} activeConfig={noModeConfig} />);
        expect(screen.queryByText('Game Mode')).not.toBeInTheDocument();
    });

    test('renders CCTLD language filter', () => {
        render(<QuizFilters {...defaultProps} selectedQuiz="cctld" />);
        expectText('Language Filter');
    });

    test('renders Telephone zone filter', () => {
        render(<QuizFilters {...defaultProps} selectedQuiz="telephone" />);
        expectText('Zone Filter');
    });

    test('renders Vehicle convention filter', () => {
        render(<QuizFilters {...defaultProps} selectedQuiz="vehicle" />);
        expectText('Convention Filter');
    });

    test('renders Driving Side side filter when mode is toCountry', () => {
        const drivingSettings = { ...mockSettings, mode: 'toCountry' };
        render(
            <QuizFilters
                {...defaultProps}
                selectedQuiz="driving_side"
                settings={drivingSettings}
            />
        );
        expectText('Side Filter');
    });

    test('renders Driving Side switch filter when mode is not toCountry', () => {
        const drivingSettings = { ...mockSettings, mode: 'otherMode' };
        render(
            <QuizFilters
                {...defaultProps}
                selectedQuiz="driving_side"
                settings={drivingSettings}
            />
        );
        expectText('Switch Filter');
    });

    test('renders Letter Filter input', () => {
        render(<QuizFilters {...defaultProps} />);
        // TextField usually has a standard label linked
        const input = screen.getByLabelText('Filter by Letter(s)');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'abc' } });
        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterLetter: 'abc',
            })
        );
    });

    test('calls onEnterKey when Enter is pressed in Letter Filter', () => {
        render(<QuizFilters {...defaultProps} />);
        const input = screen.getByLabelText('Filter by Letter(s)');

        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(mockOnEnter).toHaveBeenCalled();
    });

    test('renders Question Count selector', () => {
        render(<QuizFilters {...defaultProps} />);
        expectText('# Questions');
    });

    test('calls onSettingsChange when Game Mode changes', () => {
        render(<QuizFilters {...defaultProps} />);

        const comboboxes = screen.getAllByRole('combobox');
        // Index 0: Game Mode (if active)
        const gameModeSelect = comboboxes[0];

        fireEvent.mouseDown(gameModeSelect);

        // Now dropdown is open, find "Mode 2"
        const option = screen.getByRole('option', { name: 'Mode 2' });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'mode2',
            })
        );
    });

    test('handles All option for maxQuestions', () => {
        render(<QuizFilters {...defaultProps} />);

        // maxQuestions is combobox index 2 (Game Mode, Language Filter, # Questions)
        // Wait, defaultProps has selectedQuiz='cctld', so Language Filter IS present.
        const comboboxes = screen.getAllByRole('combobox');
        const countSelect = comboboxes[2]; // 0: Mode, 1: Lang, 2: Count

        fireEvent.mouseDown(countSelect);

        const allOption = screen.getByRole('option', { name: 'All' });
        fireEvent.click(allOption);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                maxQuestions: 'All',
            })
        );
    });
});

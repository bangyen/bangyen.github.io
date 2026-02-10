import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { QuizType, QuizSettings, GameMode } from '../../types/quiz';
import QuizFilters from '../QuizFilters';

const mockSettings: QuizSettings = {
    mode: 'toCountry',
    maxQuestions: 10,
    allowRepeats: false,
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
        { value: 'toCountry' as GameMode, label: 'Mode 1' },
        { value: 'toCode' as GameMode, label: 'Mode 2' },
        { value: 'guessing' as GameMode, label: 'Other Mode' },
    ],
    maxQuestionOptions: [5, 10, 20],
};

const mockOnChange = vi.fn();
const mockOnEnter = vi.fn();

const defaultProps = {
    selectedQuiz: 'cctld' as QuizType,
    settings: mockSettings,
    onSettingsChange: mockOnChange,
    activeConfig: mockConfig,
    commonSelectProps: {},
    onEnterKey: mockOnEnter,
};

describe('QuizFilters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
            modes: [] as { value: GameMode; label: string }[],
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
        const drivingSettings = { ...mockSettings, mode: 'guessing' };
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
        const gameModeSelect = comboboxes[0]!;

        fireEvent.mouseDown(gameModeSelect);

        // Now dropdown is open, find "Mode 2"
        const option = screen.getByRole('option', { name: 'Mode 2' });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'toCode',
            })
        );
    });

    test('handles All option for maxQuestions', () => {
        render(<QuizFilters {...defaultProps} />);

        // maxQuestions is combobox index 2 (Game Mode, Language Filter, # Questions)
        const comboboxes = screen.getAllByRole('combobox');
        const countSelect = comboboxes[2]!;

        fireEvent.mouseDown(countSelect);

        const allOption = screen.getByRole('option', { name: 'All' });
        fireEvent.click(allOption);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                maxQuestions: 'All',
            })
        );
    });

    test('calls onSettingsChange when Language Filter changes (cctld)', () => {
        render(<QuizFilters {...defaultProps} selectedQuiz="cctld" />);
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[1]!); // Language Filter

        // CCTLD_LANGUAGES includes 'English'
        const option = screen.getByRole('option', { name: 'English' });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterLanguage: 'English',
            })
        );
    });

    test('calls onSettingsChange when Zone Filter changes (telephone)', () => {
        render(<QuizFilters {...defaultProps} selectedQuiz="telephone" />);
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[1]!); // Zone Filter

        // TELEPHONE_ZONES includes Zone 1
        const option = screen.getByRole('option', { name: /Zone 1/ });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterZone: expect.any(String) as unknown as string,
            })
        );
    });

    test('calls onSettingsChange when Convention Filter changes (vehicle)', () => {
        render(<QuizFilters {...defaultProps} selectedQuiz="vehicle" />);
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[1]!); // Convention Filter

        // VEHICLE_CONVENTIONS includes 'Vienna' or similar
        const option = screen.getAllByRole('option')[1]!; // Pick any option
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterConvention: expect.any(String) as unknown as string,
            })
        );
    });

    test('calls onSettingsChange when Side Filter changes (driving_side)', () => {
        render(
            <QuizFilters
                {...defaultProps}
                selectedQuiz="driving_side"
                settings={{ ...mockSettings, mode: 'toCountry' }}
            />
        );
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[1]!); // Side Filter

        const option = screen.getByRole('option', { name: 'Left' });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterSide: 'Left',
            })
        );
    });

    test('calls onSettingsChange when Switch Filter changes (driving_side)', () => {
        render(
            <QuizFilters
                {...defaultProps}
                selectedQuiz="driving_side"
                settings={{ ...mockSettings, mode: 'guessing' }}
            />
        );
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[1]!); // Switch Filter

        const option = screen.getByRole('option', {
            name: 'Switched historically',
        });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterSwitch: 'Switched',
            })
        );
    });

    test('calls onSettingsChange when Side Filter changes (driving_side)', () => {
        render(
            <QuizFilters
                {...defaultProps}
                selectedQuiz="driving_side"
                settings={{ ...mockSettings, mode: 'toCountry' }}
            />
        );
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[1]!);

        const option = screen.getByRole('option', { name: 'Left' });
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                filterSide: 'Left',
            })
        );
    });

    test('calls onEnterKey when Enter is pressed in Letter Filter', () => {
        render(<QuizFilters {...defaultProps} />);
        const input = screen.getByLabelText(/Filter by Letter/i);
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(mockOnEnter).toHaveBeenCalled();
    });

    test('calls onSettingsChange when Max Questions is set to All', () => {
        render(<QuizFilters {...defaultProps} />);
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[comboboxes.length - 1]!); // # Questions is last
        const option = screen.getByRole('option', { name: 'All' });
        fireEvent.click(option);
        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({ maxQuestions: 'All' })
        );
    });

    test('calls onSettingsChange when Max Questions is set to a number', () => {
        render(<QuizFilters {...defaultProps} />);
        const comboboxes = screen.getAllByRole('combobox');
        fireEvent.mouseDown(comboboxes[comboboxes.length - 1]!);
        const option = screen.getByRole('option', { name: '20' });
        fireEvent.click(option);
        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({ maxQuestions: 20 })
        );
    });

    test('renders nothing in Slot 2 for non-specialized quiz', () => {
        render(
            <QuizFilters {...defaultProps} selectedQuiz={'none' as QuizType} />
        );
        expect(screen.queryByText('Language Filter')).not.toBeInTheDocument();
        expect(screen.queryByText('Zone Filter')).not.toBeInTheDocument();
        expect(screen.queryByText('Convention Filter')).not.toBeInTheDocument();
        expect(screen.queryByText('Side Filter')).not.toBeInTheDocument();
    });

    test('handles non-Enter key in Letter Filter', () => {
        render(<QuizFilters {...defaultProps} />);
        const input = screen.getByLabelText(/Filter by Letter/i);
        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
        expect(mockOnEnter).not.toHaveBeenCalled();
    });

    test('handles empty settings for all specialized types', () => {
        const emptySettings = {
            mode: 'toCountry',
            maxQuestions: 10,
            allowRepeats: false,
        } as unknown as QuizSettings;
        const types: QuizType[] = [
            'cctld',
            'telephone',
            'vehicle',
            'driving_side',
        ];

        types.forEach(type => {
            const { unmount } = render(
                <QuizFilters
                    {...defaultProps}
                    settings={emptySettings}
                    selectedQuiz={type}
                />
            );
            expect(screen.getAllByText('# Questions').length).toBeGreaterThan(
                0
            );
            unmount();
        });

        // Specific case for driving_side toCountry branch
        render(
            <QuizFilters
                {...defaultProps}
                settings={
                    {
                        mode: 'toCountry',
                        maxQuestions: 10,
                    } as unknown as QuizSettings
                }
                selectedQuiz="driving_side"
            />
        );
        expect(screen.getAllByText('Side Filter').length).toBeGreaterThan(0);
    });
});

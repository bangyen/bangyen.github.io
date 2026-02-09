import React from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    Grid,
    InputLabel,
    TextField,
    Box,
    SelectProps,
} from '@mui/material';
import { COLORS } from '../../../config/theme';
import {
    CCTLD_LANGUAGES,
    TELEPHONE_ZONES,
    VEHICLE_CONVENTIONS,
    DRIVING_SIDE_FILTERS,
    DRIVING_SIDE_OPTIONS,
    QuizConfig,
} from '../config/quizConfig';
import { QuizSettings, QuizType, GameMode } from '../types/quiz';

interface QuizFiltersProps {
    selectedQuiz: QuizType;
    settings: QuizSettings;
    onSettingsChange: (newSettings: QuizSettings) => void;
    activeConfig: Pick<
        QuizConfig,
        'hasModeSelect' | 'modes' | 'maxQuestionOptions'
    >;
    commonSelectProps: Partial<SelectProps>;
    onEnterKey: () => void;
}

const QuizFilters: React.FC<QuizFiltersProps> = ({
    selectedQuiz,
    settings,
    onSettingsChange,
    activeConfig,
    commonSelectProps,
    onEnterKey,
}) => {
    return (
        <>
            {/* Slot 1: Game Mode */}
            {activeConfig.hasModeSelect && activeConfig.modes ? (
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Game Mode</InputLabel>
                        <Select
                            value={settings.mode}
                            label="Game Mode"
                            onChange={e => {
                                onSettingsChange({
                                    ...settings,
                                    mode: e.target.value as GameMode,
                                });
                            }}
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            {activeConfig.modes.map(
                                (m: { value: GameMode; label: string }) => (
                                    <MenuItem key={m.value} value={m.value}>
                                        {m.label}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>
            ) : (
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{ display: { xs: 'none', md: 'block' } }}
                >
                    <Box sx={{ height: 56 }} />
                </Grid>
            )}

            {/* Slot 2: Specialized Filters */}
            {selectedQuiz === 'cctld' && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Language Filter</InputLabel>
                        <Select
                            value={settings.filterLanguage ?? 'All'}
                            label="Language Filter"
                            onChange={e => {
                                onSettingsChange({
                                    ...settings,
                                    filterLanguage: e.target.value as string,
                                });
                            }}
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            {CCTLD_LANGUAGES.map(lang => (
                                <MenuItem key={lang} value={lang}>
                                    {lang}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}

            {selectedQuiz === 'telephone' && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Zone Filter</InputLabel>
                        <Select
                            value={settings.filterZone ?? 'All'}
                            label="Zone Filter"
                            onChange={e => {
                                onSettingsChange({
                                    ...settings,
                                    filterZone: e.target.value as string,
                                });
                            }}
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                            MenuProps={{
                                ...commonSelectProps.MenuProps,
                                PaperProps: {
                                    sx: {
                                        maxWidth: 250,
                                    },
                                },
                            }}
                        >
                            {TELEPHONE_ZONES.map(zone => (
                                <MenuItem
                                    key={zone.value}
                                    value={zone.value}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: 'block',
                                    }}
                                >
                                    {zone.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}

            {selectedQuiz === 'vehicle' && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Convention Filter</InputLabel>
                        <Select
                            value={settings.filterConvention ?? 'All'}
                            label="Convention Filter"
                            onChange={e => {
                                onSettingsChange({
                                    ...settings,
                                    filterConvention: e.target.value as string,
                                });
                            }}
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            {VEHICLE_CONVENTIONS.map(conv => (
                                <MenuItem key={conv.value} value={conv.value}>
                                    {conv.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}

            {selectedQuiz === 'driving_side' &&
                (settings.mode === 'toCountry' ? (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Side Filter</InputLabel>
                            <Select
                                value={settings.filterSide ?? 'All'}
                                label="Side Filter"
                                onChange={e => {
                                    onSettingsChange({
                                        ...settings,
                                        filterSide: e.target.value as string,
                                    });
                                }}
                                sx={{
                                    color: COLORS.text.primary,
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLORS.border.subtle,
                                    },
                                }}
                                {...commonSelectProps}
                            >
                                {DRIVING_SIDE_OPTIONS.map(f => (
                                    <MenuItem key={f.value} value={f.value}>
                                        {f.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                ) : (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Switch Filter</InputLabel>
                            <Select
                                value={settings.filterSwitch ?? 'All'}
                                label="Switch Filter"
                                onChange={e => {
                                    onSettingsChange({
                                        ...settings,
                                        filterSwitch: e.target.value as string,
                                    });
                                }}
                                sx={{
                                    color: COLORS.text.primary,
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLORS.border.subtle,
                                    },
                                }}
                                {...commonSelectProps}
                            >
                                {DRIVING_SIDE_FILTERS.map(f => (
                                    <MenuItem key={f.value} value={f.value}>
                                        {f.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                ))}

            {/* Slot 3: Letter Filter */}
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    fullWidth
                    label="Filter by Letter(s)"
                    value={settings.filterLetter}
                    onChange={e => {
                        onSettingsChange({
                            ...settings,
                            filterLetter: e.target.value,
                        });
                    }}
                    helperText="Comma separated (e.g. a, b)"
                    slotProps={{
                        inputLabel: {
                            style: { color: COLORS.text.secondary },
                        },
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            onEnterKey();
                        }
                    }}
                    sx={{
                        input: { color: COLORS.text.primary },
                        label: { color: COLORS.text.secondary },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                            backdropFilter: 'none',
                            '& fieldset': {
                                borderColor: COLORS.border.subtle,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.primary.main,
                            },
                        },
                    }}
                />
            </Grid>

            {/* Slot 4: Number of Questions */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                    <InputLabel># Questions</InputLabel>
                    <Select
                        value={settings.maxQuestions}
                        label="# Questions"
                        onChange={e => {
                            onSettingsChange({
                                ...settings,
                                maxQuestions:
                                    e.target.value === 'All'
                                        ? 'All'
                                        : Number(e.target.value),
                            });
                        }}
                        sx={{
                            color: COLORS.text.primary,
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.border.subtle,
                            },
                        }}
                        {...commonSelectProps}
                    >
                        {activeConfig.maxQuestionOptions.map((opt: number) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                        <MenuItem value="All">All</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </>
    );
};

export default QuizFilters;

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Button,
    Fade,
    TextField,
    Card,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import {
    CheckCircleRounded as CheckCircleIcon,
    CancelRounded as CancelIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, SHADOWS } from '../../../config/theme';
import {
    CCTLD_LANGUAGES,
    TELEPHONE_ZONES,
    VEHICLE_CONVENTIONS,
    DRIVING_SIDE_FILTERS,
    DRIVING_SIDE_OPTIONS,
    QUIZ_CONFIGS,
} from '../config/quizConfig';
import {
    QuizSettings,
    QuizType,
    Question,
    GameState,
    QuizItem,
    GameMode,
    CCTLD,
    DrivingSide,
    TelephoneCode,
    VehicleCode,
} from '../types/quiz';
import { useQuizFilter } from '../hooks/quiz';

import QuizLayout from '../components/QuizLayout';
import QuizSettingsView from '../components/QuizSettingsView';
import QuizSummaryView from '../components/QuizSummaryView';
import { SkippedBadge } from '../components';
import QuizGame from '../components/QuizGame';

// --- Components ---

const commonSelectProps = {
    MenuProps: {
        BackdropProps: {
            sx: { backdropFilter: 'none', backgroundColor: 'transparent' },
        },
    },
};

const WikipediaQuizPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive selected quiz from URL
    const selectedQuiz = useMemo((): QuizType => {
        const type = searchParams.get('type');
        if (type && QUIZ_CONFIGS[type as QuizType]) {
            return type as QuizType;
        }
        return 'cctld';
    }, [searchParams]);

    const [gameState, setGameState] = useState<GameState>('menu');

    // Initialize settings based on selected quiz
    const [settings, setSettings] = useState<QuizSettings>(
        QUIZ_CONFIGS[selectedQuiz].defaultSettings
    );

    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question<QuizItem>[]>([]);

    // Reset settings and game state when quiz type changes (via URL)
    useEffect(() => {
        setGameState('menu');
        setSettings(QUIZ_CONFIGS[selectedQuiz].defaultSettings);
    }, [selectedQuiz]);

    // URL sync
    const handleQuizChange = (
        _event: React.MouseEvent<HTMLElement>,
        newQuiz: QuizType | null
    ) => {
        if (newQuiz !== null) {
            setSearchParams({ type: newQuiz });
        }
    };

    const activeConfig = QUIZ_CONFIGS[selectedQuiz];

    // Update document title
    useEffect(() => {
        document.title = `${activeConfig.title} | Bangyen`;
    }, [activeConfig.title]);

    const filteredPool = useQuizFilter({
        data: activeConfig.data,
        quizType: selectedQuiz,
        settings,
    });

    const handleStart = () => {
        if (filteredPool.length > 0) {
            setGameState('playing');
        }
    };

    const handleEndGame = (history: Question<QuizItem>[], score: number) => {
        setLastHistory(history);
        setLastScore(score);
        setGameState('summary');
    };

    const handleBackToMenu = () => {
        setGameState('menu');
    };

    return (
        <QuizLayout title="Wikipedia Quizzes" infoUrl={activeConfig.infoUrl}>
            {gameState === 'menu' && (
                <Fade in>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Quiz Type Selector Above */}
                        <Box
                            sx={{
                                mb: 4,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                overflowX: 'auto',
                                pb: 1, // Add padding for scrollbar spacing if needed
                            }}
                        >
                            <ToggleButtonGroup
                                value={selectedQuiz}
                                exclusive
                                onChange={handleQuizChange}
                                aria-label="quiz selection"
                                sx={{
                                    backgroundColor:
                                        COLORS.interactive.disabled,
                                    borderRadius: SPACING.borderRadius.full,
                                    p: 0.5,
                                    '& .MuiToggleButton-root': {
                                        borderRadius: SPACING.borderRadius.full,
                                        px: { xs: 2, sm: 3 },
                                        py: 1,
                                        border: 'none',
                                        color: COLORS.text.secondary,
                                        fontSize: {
                                            xs: '0.8rem',
                                            sm: '0.9rem',
                                        },
                                        whiteSpace: 'nowrap',
                                        fontWeight: 'medium',
                                        textTransform: 'none',
                                        '&.Mui-selected': {
                                            backgroundColor:
                                                COLORS.primary.main,
                                            color: COLORS.text.primary,
                                            boxShadow: SHADOWS.md,
                                            '&:hover': {
                                                backgroundColor:
                                                    COLORS.primary.light,
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor:
                                                COLORS.interactive.disabled,
                                        },
                                    },
                                }}
                            >
                                <ToggleButton value="cctld">
                                    Domains
                                </ToggleButton>
                                <ToggleButton value="driving_side">
                                    Driving Side
                                </ToggleButton>
                                <ToggleButton value="telephone">
                                    Telephone
                                </ToggleButton>
                                <ToggleButton value="vehicle">
                                    Plates
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <QuizSettingsView
                            settings={settings}
                            onUpdate={setSettings}
                            onStart={handleStart}
                            maxQuestionOptions={activeConfig.maxQuestionOptions}
                            title="Quiz Settings"
                        >
                            {/* Slot 1: Game Mode (Now First) */}
                            {activeConfig.hasModeSelect &&
                            activeConfig.modes ? (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Game Mode</InputLabel>
                                        <Select
                                            value={settings.mode || ''}
                                            label="Game Mode"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    mode: e.target
                                                        .value as GameMode,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {activeConfig.modes.map(m => (
                                                <MenuItem
                                                    key={m.value}
                                                    value={m.value}
                                                >
                                                    {m.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ) : (
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: { xs: 'none', md: 'block' },
                                    }}
                                >
                                    <Box sx={{ height: 56 }} />
                                </Grid>
                            )}

                            {/* Slot 2: Specialized Filters */}
                            {selectedQuiz === 'cctld' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Language Filter</InputLabel>
                                        <Select
                                            value={
                                                settings.filterLanguage || 'All'
                                            }
                                            label="Language Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterLanguage:
                                                        e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {CCTLD_LANGUAGES.map(lang => (
                                                <MenuItem
                                                    key={lang}
                                                    value={lang}
                                                >
                                                    {lang}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {selectedQuiz === 'telephone' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Zone Filter</InputLabel>
                                        <Select
                                            value={settings.filterZone || 'All'}
                                            label="Zone Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterZone: e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
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
                                                        textOverflow:
                                                            'ellipsis',
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
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            Convention Filter
                                        </InputLabel>
                                        <Select
                                            value={
                                                settings.filterConvention ||
                                                'All'
                                            }
                                            label="Convention Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterConvention:
                                                        e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {VEHICLE_CONVENTIONS.map(conv => (
                                                <MenuItem
                                                    key={conv.value}
                                                    value={conv.value}
                                                >
                                                    {conv.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {selectedQuiz === 'driving_side' &&
                                (settings.mode === 'toCountry' ? (
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Side Filter</InputLabel>
                                            <Select
                                                value={
                                                    settings.filterSide || 'All'
                                                }
                                                label="Side Filter"
                                                onChange={e =>
                                                    setSettings({
                                                        ...settings,
                                                        filterSide:
                                                            e.target.value,
                                                    })
                                                }
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    '.MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor:
                                                                COLORS.border
                                                                    .subtle,
                                                        },
                                                }}
                                                {...commonSelectProps}
                                            >
                                                {DRIVING_SIDE_OPTIONS.map(f => (
                                                    <MenuItem
                                                        key={f.value}
                                                        value={f.value}
                                                    >
                                                        {f.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                ) : (
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                Switch Filter
                                            </InputLabel>
                                            <Select
                                                value={
                                                    settings.filterSwitch ||
                                                    'All'
                                                }
                                                label="Switch Filter"
                                                onChange={e =>
                                                    setSettings({
                                                        ...settings,
                                                        filterSwitch:
                                                            e.target.value,
                                                    })
                                                }
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    '.MuiOutlinedInput-notchedOutline':
                                                        {
                                                            borderColor:
                                                                COLORS.border
                                                                    .subtle,
                                                        },
                                                }}
                                                {...commonSelectProps}
                                            >
                                                {DRIVING_SIDE_FILTERS.map(f => (
                                                    <MenuItem
                                                        key={f.value}
                                                        value={f.value}
                                                    >
                                                        {f.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                ))}

                            {/* Slot 3: Letter Filter */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Filter by Letter(s)"
                                    value={settings.filterLetter}
                                    onChange={e =>
                                        setSettings({
                                            ...settings,
                                            filterLetter: e.target.value,
                                        })
                                    }
                                    helperText="Comma separated (e.g. a, b)"
                                    InputLabelProps={{
                                        style: { color: COLORS.text.secondary },
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleStart();
                                        }
                                    }}
                                    sx={{
                                        input: { color: COLORS.text.primary },
                                        label: { color: COLORS.text.secondary },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor:
                                                    COLORS.border.subtle,
                                            },
                                            '&:hover fieldset': {
                                                borderColor:
                                                    COLORS.primary.main,
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Slot 4: Question Limit (Now Last) */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Question Limit</InputLabel>
                                    <Select
                                        value={settings.maxQuestions || 'All'}
                                        label="Question Limit"
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                maxQuestions: e.target.value as
                                                    | number
                                                    | 'All',
                                            })
                                        }
                                        sx={{
                                            color: COLORS.text.primary,
                                            '.MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor:
                                                        COLORS.border.subtle,
                                                },
                                        }}
                                        {...commonSelectProps}
                                    >
                                        <MenuItem value="All">All</MenuItem>
                                        {activeConfig.maxQuestionOptions.map(
                                            opt => (
                                                <MenuItem key={opt} value={opt}>
                                                    {opt}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </QuizSettingsView>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleStart}
                                disabled={filteredPool.length === 0}
                                sx={{
                                    px: 8,
                                    py: 1.5,
                                    fontSize: '1.2rem',
                                    borderRadius: SPACING.borderRadius.full,
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em',
                                    minWidth: 300,
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        backgroundColor:
                                            COLORS.interactive.disabled,
                                        color: COLORS.interactive.disabledText,
                                    },
                                }}
                            >
                                {filteredPool.length === 0
                                    ? 'No Questions Found'
                                    : `Start Quiz (${filteredPool.length})`}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            )}

            {gameState === 'playing' && (
                <QuizGame
                    quizType={selectedQuiz}
                    settings={settings}
                    initialPool={filteredPool}
                    onEndGame={handleEndGame}
                    onBackToMenu={handleBackToMenu}
                />
            )}

            {gameState === 'summary' && (
                <QuizSummaryView<QuizItem>
                    score={lastScore}
                    history={lastHistory}
                    onRestart={handleStart}
                    onBackToMenu={handleBackToMenu}
                    renderHistoryItem={q => (
                        <Card
                            key={q.id}
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                bgcolor:
                                    q.pointsEarned === 1
                                        ? COLORS.surface.success
                                        : q.pointsEarned === 0.5
                                          ? COLORS.surface.warning
                                          : COLORS.surface.error,
                                border: `1px solid ${COLORS.border.subtle} `,
                                flexShrink: 0,
                            }}
                        >
                            <Box
                                sx={{ textAlign: 'left', flex: 1, minWidth: 0 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 1,
                                    }}
                                >
                                    {q.item.flag && (
                                        <img
                                            src={q.item.flag}
                                            alt={`Flag of ${q.item.country} `}
                                            style={{
                                                height: '16px',
                                                width: 'auto',
                                                borderRadius: '1px',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        noWrap
                                    >
                                        {selectedQuiz === 'driving_side'
                                            ? q.item.country
                                            : settings.mode === 'toCountry'
                                              ? (
                                                    q.item as
                                                        | CCTLD
                                                        | TelephoneCode
                                                        | VehicleCode
                                                ).code
                                              : q.item.country}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    noWrap
                                >
                                    Answer:{' '}
                                    {selectedQuiz === 'driving_side'
                                        ? (q.item as DrivingSide).side
                                        : settings.mode === 'toCountry'
                                          ? q.item.country
                                          : (
                                                q.item as
                                                    | CCTLD
                                                    | TelephoneCode
                                                    | VehicleCode
                                            ).code}
                                </Typography>
                                {activeConfig.renderFeedbackOrigin && (
                                    <Box sx={{ mt: 0.5, opacity: 0.8 }}>
                                        {activeConfig.renderFeedbackOrigin(
                                            q.item
                                        )}
                                    </Box>
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    flexShrink: 0,
                                    ml: 2,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            q.pointsEarned === 1
                                                ? COLORS.data.green
                                                : q.pointsEarned === 0.5
                                                  ? COLORS.data.amber
                                                  : COLORS.data.red,
                                        fontWeight:
                                            q.pointsEarned > 0
                                                ? 'bold'
                                                : 'normal',
                                        maxWidth: '150px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: 'block',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {(() => {
                                        const answer = q.userAnswer?.trim();
                                        if (!answer) return <SkippedBadge />;

                                        let normalizedAnswer = answer;
                                        if (selectedQuiz === 'cctld') {
                                            if (settings.mode === 'toCode') {
                                                normalizedAnswer = (
                                                    normalizedAnswer.startsWith(
                                                        '.'
                                                    )
                                                        ? normalizedAnswer
                                                        : '.' + normalizedAnswer
                                                ).toLowerCase();
                                            } else {
                                                normalizedAnswer =
                                                    normalizedAnswer.toUpperCase();
                                            }
                                        } else if (
                                            selectedQuiz === 'telephone'
                                        ) {
                                            if (settings.mode === 'toCode') {
                                                normalizedAnswer =
                                                    normalizedAnswer.startsWith(
                                                        '+'
                                                    )
                                                        ? normalizedAnswer.toUpperCase()
                                                        : '+' +
                                                          normalizedAnswer.toUpperCase();
                                            } else {
                                                normalizedAnswer =
                                                    normalizedAnswer.toUpperCase();
                                            }
                                        } else if (selectedQuiz === 'vehicle') {
                                            normalizedAnswer =
                                                normalizedAnswer.toUpperCase();
                                        } else if (
                                            selectedQuiz === 'driving_side'
                                        ) {
                                            normalizedAnswer =
                                                normalizedAnswer.toUpperCase();
                                        }

                                        return (
                                            <Typography
                                                component="span"
                                                variant="inherit"
                                            >
                                                {normalizedAnswer}
                                                {q.pointsEarned === 0.5 &&
                                                    ' (0.5 pts)'}
                                            </Typography>
                                        );
                                    })()}
                                </Typography>
                                {q.pointsEarned === 1 ? (
                                    <CheckCircleIcon
                                        fontSize="small"
                                        color="success"
                                    />
                                ) : q.pointsEarned === 0.5 ? (
                                    <CheckCircleIcon
                                        fontSize="small"
                                        sx={{
                                            color: COLORS.data.amber,
                                        }}
                                    />
                                ) : (
                                    q.userAnswer?.trim() && (
                                        <CancelIcon
                                            fontSize="small"
                                            color="error"
                                        />
                                    )
                                )}
                            </Box>
                        </Card>
                    )}
                />
            )}
        </QuizLayout>
    );
};

export default WikipediaQuizPage;

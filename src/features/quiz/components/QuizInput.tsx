import React from 'react';
import { Box, TextField, Stack, Button, Fade } from '@mui/material';
import { COLORS, SPACING } from '../../../config/theme';
import { QUIZ_UI_CONSTANTS } from '../config/quizConfig';

/**
 * Props for QuizInput component.
 *
 * @template T - Type of question data
 */
interface QuizInputProps<T> {
    /** Current input value */
    inputValue: string;
    /** Whether to show correct/incorrect feedback */
    showFeedback: boolean;
    /** Whether to show hint */
    showHint: boolean;
    /** Whether to hide input field (for non-text quizzes) */
    hideInput: boolean;
    /** Whether to hide hint button */
    hideHint: boolean;
    /** Placeholder text for input field */
    inputPlaceholder: string;
    /** Current question data */
    currentQuestion: T | null;
    /** Ref for input field (for focus management) */
    inputRef?: React.RefObject<HTMLInputElement | null>;
    /** Ref for next button (for keyboard navigation) */
    nextButtonRef?: React.RefObject<HTMLButtonElement | null>;
    /** Handler for input value changes */
    onInputChange: (value: string) => void;
    /** Handler for form submission */
    onSubmit: (e?: React.SyntheticEvent) => void;
    /** Handler for skip/next button */
    onSkip: () => void;
    /** Handler for hint toggle */
    onToggleHint: () => void;
    /** Function to render hint content for current question */
    renderHint: (item: T) => React.ReactNode;
    /** Optional custom action buttons to insert between Skip and Hint */
    renderCustomActions?: React.ReactNode;
}

/**
 * Generic quiz input component with answer field, action buttons, and hint display.
 *
 * Features:
 * - Text input with submit functionality
 * - Skip/Next button (label changes based on feedback state)
 * - Optional hint toggle with fade-in animation
 * - Customizable action buttons
 * - Keyboard navigation support via refs
 * - Responsive layout with max-width constraints
 *
 * @template T - Type of question data
 *
 * @param props - Component props
 * @returns Quiz input UI with form and action buttons
 *
 * @example
 * ```tsx
 * <QuizInput
 *   inputValue={answer}
 *   showFeedback={isCorrect !== null}
 *   showHint={showHint}
 *   hideInput={false}
 *   hideHint={false}
 *   inputPlaceholder="Enter your answer..."
 *   currentQuestion={question}
 *   onInputChange={setAnswer}
 *   onSubmit={handleSubmit}
 *   onSkip={handleSkip}
 *   onToggleHint={() => setShowHint(!showHint)}
 *   renderHint={(q) => <Typography>{q.hint}</Typography>}
 * />
 * ```
 */
export function QuizInput<T>({
    inputValue,
    showFeedback,
    showHint,
    hideInput,
    hideHint,
    inputPlaceholder,
    currentQuestion,
    inputRef,
    nextButtonRef,
    onInputChange,
    onSubmit,
    onSkip,
    onToggleHint,
    renderHint,
    renderCustomActions,
}: QuizInputProps<T>) {
    return (
        <>
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {!hideInput && (
                    <TextField
                        slotProps={{
                            htmlInput: { 'aria-label': 'Answer input' },
                        }}
                        inputRef={inputRef}
                        value={inputValue}
                        onChange={e => {
                            onInputChange(e.target.value);
                        }}
                        placeholder={inputPlaceholder}
                        disabled={showFeedback}
                        autoComplete="off"
                        sx={{
                            input: {
                                textAlign: 'center',
                                fontSize: '1.2rem',
                            },
                            width: '100%',
                            maxWidth: QUIZ_UI_CONSTANTS.QUESTION_CARD.MAX_WIDTH,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: COLORS.border.subtle,
                                },
                                '&:hover fieldset': {
                                    borderColor: COLORS.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: COLORS.primary.main,
                                },
                                '&.Mui-disabled fieldset': {
                                    borderColor: `${COLORS.border.subtle} !important`,
                                },
                            },
                        }}
                        variant="outlined"
                    />
                )}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        mt: 4,
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: QUIZ_UI_CONSTANTS.QUESTION_CARD.MAX_WIDTH,
                    }}
                >
                    <Button
                        ref={nextButtonRef}
                        variant="outlined"
                        sx={{
                            py: QUIZ_UI_CONSTANTS.ACTION_BUTTON.PY,
                            flex: 1,
                            borderColor: COLORS.border.subtle,
                            color: COLORS.text.secondary,
                            whiteSpace: 'nowrap',
                            fontSize: QUIZ_UI_CONSTANTS.ACTION_BUTTON.FONT_SIZE,
                            '&.Mui-disabled': {
                                borderColor: COLORS.border.subtle,
                                opacity: 0.6,
                            },
                        }}
                        onClick={onSkip}
                    >
                        {showFeedback ? 'Next' : 'Skip'}
                    </Button>
                    {renderCustomActions}
                    {!hideHint && (
                        <Button
                            variant="outlined"
                            onClick={onToggleHint}
                            disabled={showFeedback}
                            sx={{
                                py: QUIZ_UI_CONSTANTS.ACTION_BUTTON.PY,
                                flex: 1,
                                borderColor: COLORS.border.subtle,
                                whiteSpace: 'nowrap',
                                fontSize:
                                    QUIZ_UI_CONSTANTS.ACTION_BUTTON.FONT_SIZE,
                                '&.Mui-disabled': {
                                    borderColor: COLORS.border.subtle,
                                    opacity: 0.6,
                                },
                            }}
                        >
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </Button>
                    )}
                    {!hideInput && (
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                py: QUIZ_UI_CONSTANTS.ACTION_BUTTON.PY,
                                flex: 1,
                                whiteSpace: 'nowrap',
                                fontSize:
                                    QUIZ_UI_CONSTANTS.ACTION_BUTTON.FONT_SIZE,
                                '&.Mui-disabled': {
                                    backgroundColor:
                                        COLORS.interactive.disabled,
                                    color: COLORS.interactive.disabledText,
                                    borderColor: 'transparent',
                                },
                            }}
                            disabled={!inputValue || showFeedback}
                        >
                            Submit
                        </Button>
                    )}
                </Stack>
            </Box>

            {showHint && !showFeedback && (
                <Fade in>
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: SPACING.borderRadius.sm,
                            border: `1px dashed ${COLORS.primary.main}40`,
                            width: '100%',
                            maxWidth: QUIZ_UI_CONSTANTS.QUESTION_CARD.MAX_WIDTH,
                        }}
                    >
                        {currentQuestion && renderHint(currentQuestion)}
                    </Box>
                </Fade>
            )}
        </>
    );
}

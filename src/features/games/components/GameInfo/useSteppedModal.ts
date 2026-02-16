import { useState, useCallback } from 'react';

interface SteppedModalControls {
    /** Current zero-based step index. */
    step: number;
    /** Advance to the next step, or close the modal on the final step. */
    handleNext: () => void;
    /** Go back to the previous step (no-op on step 0). */
    handleBack: () => void;
}

/**
 * Encapsulates the step-navigation state for a multi-step modal.
 *
 * Extracted from `GameInfo` so the component focuses solely on
 * rendering while this hook owns the progression logic. Calling
 * `handleNext` on the final step delegates to `onClose` so the
 * modal can dismiss itself.
 */
export function useSteppedModal(
    totalSteps: number,
    onClose: () => void,
): SteppedModalControls {
    const [step, setStep] = useState(0);

    const handleNext = useCallback(() => {
        setStep(prev => {
            if (prev < totalSteps - 1) return prev + 1;
            onClose();
            return prev;
        });
    }, [totalSteps, onClose]);

    const handleBack = useCallback(() => {
        setStep(prev => (prev > 0 ? prev - 1 : prev));
    }, []);

    return { step, handleNext, handleBack };
}

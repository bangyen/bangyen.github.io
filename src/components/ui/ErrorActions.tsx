import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { errorButtonSx } from './ErrorCard.styles';

import { ERROR_TEXT, ERROR_ICONS } from '@/config/constants';

const { recovery: RecoveryIcon, back: BackIcon, home: HomeIcon } = ERROR_ICONS;

interface ErrorButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    sx?: object;
}

/** Button to trigger a soft reset of an error boundary. */
export function TryAgainButton({ children, onClick }: ErrorButtonProps) {
    return (
        <Button
            variant="contained"
            startIcon={<RecoveryIcon />}
            onClick={onClick}
            sx={errorButtonSx}
        >
            {children || ERROR_TEXT.labels.tryAgain}
        </Button>
    );
}

/** Button to trigger a full page reload. */
export function ReloadButton({ onClick }: ErrorButtonProps) {
    return (
        <Button
            variant="contained"
            startIcon={<RecoveryIcon />}
            onClick={
                onClick ||
                (() => {
                    globalThis.location.reload();
                })
            }
            sx={errorButtonSx}
        >
            {ERROR_TEXT.labels.reloadPage}
        </Button>
    );
}

/** Button to navigate back in history. */
export function GoBackButton({ onClick }: ErrorButtonProps) {
    return (
        <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={onClick}
            sx={errorButtonSx}
        >
            {ERROR_TEXT.labels.goBack}
        </Button>
    );
}

/** Outlined button to exit a modal or return to a safe state. */
export function ReturnToGameButton({ onClick }: ErrorButtonProps) {
    return (
        <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={onClick}
            sx={errorButtonSx}
        >
            {ERROR_TEXT.labels.returnToGame}
        </Button>
    );
}

/** Outlined button to navigate back to the home page. */
export function ReturnToHomeButton() {
    return (
        <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={errorButtonSx}
        >
            {ERROR_TEXT.labels.returnToHome}
        </Button>
    );
}

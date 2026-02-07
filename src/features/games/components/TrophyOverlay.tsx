import React from 'react';
import { Box } from '@mui/material';
import { EmojiEventsRounded } from '../../../components/icons';
import { ANIMATIONS } from '../../../config/theme';

interface TrophyOverlayProps {
    show: boolean;
    onClick: () => void;
    size: number;
    iconSizeRatio: number;
    primaryColor: string;
    secondaryColor: string;
    useSecondary?: boolean;
    sx?: object;
}

export function TrophyOverlay({
    show,
    onClick,
    size,
    iconSizeRatio,
    primaryColor,
    secondaryColor,
    useSecondary = false,
    sx,
}: TrophyOverlayProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: show ? 1 : 0,
                transform: show ? 'scale(1)' : 'scale(0.5)',
                visibility: show ? 'visible' : 'hidden',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
                zIndex: 10,
                ...ANIMATIONS.presets.glass,
                backdropFilter: 'blur(4px) saturate(180%)',
                backgroundColor: 'transparent',
                ...sx,
            }}
        >
            <EmojiEventsRounded
                sx={{
                    fontSize: `${(size * iconSizeRatio).toString()}rem`,
                    color: useSecondary ? secondaryColor : primaryColor,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                }}
            />
        </Box>
    );
}

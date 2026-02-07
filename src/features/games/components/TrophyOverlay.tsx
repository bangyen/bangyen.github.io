import React from 'react';
import { Box } from '../../../components/mui';
import { EmojiEventsRounded } from '../../../components/icons';

interface TrophyOverlayProps {
    show: boolean;
    onReset?: () => void;
    size: number;
    iconSizeRatio: number;
    primaryColor?: string;
    secondaryColor?: string;
    useSecondary?: boolean;
}

export function TrophyOverlay({
    show,
    onReset,
    size,
    iconSizeRatio,
    primaryColor,
    secondaryColor,
    useSecondary = false,
}: TrophyOverlayProps) {
    return (
        <Box
            onClick={onReset}
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
                backgroundColor: 'transparent',
            }}
        >
            {size > 0 && (
                <EmojiEventsRounded
                    sx={{
                        fontSize: `${(size * iconSizeRatio).toString()}rem`,
                        color: useSecondary ? secondaryColor : primaryColor,
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                    }}
                />
            )}
        </Box>
    );
}

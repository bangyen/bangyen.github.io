import React, { useState, useEffect } from 'react';

import { EmojiEventsRounded } from '@/components/icons';
import { Box } from '@/components/mui';

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
    const [isInteractive, setIsInteractive] = useState(false);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setIsInteractive(true);
            }, 500);
            return () => {
                clearTimeout(timer);
            };
        } else {
            setIsInteractive(false);
        }
    }, [show]);

    return (
        <Box
            onClick={e => {
                if (isInteractive && onReset) {
                    e.stopPropagation();
                    onReset();
                }
            }}
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
                cursor: isInteractive ? 'pointer' : 'default',
                zIndex: 10,
                backgroundColor: 'transparent',
                pointerEvents: show ? 'auto' : 'none',
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

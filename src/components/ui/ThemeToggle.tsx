import React from 'react';

import { LightModeRounded, DarkModeRounded, DevicesRounded } from '../icons';
import { TooltipButton } from './TooltipButton';

import { useThemeContext } from '@/hooks/useTheme';

export function ThemeToggle() {
    const { mode, toggleTheme } = useThemeContext();

    const getToggleConfig = () => {
        switch (mode) {
            case 'light':
                return {
                    title: 'Switch to dark mode',
                    Icon: DarkModeRounded,
                };
            case 'dark':
                return {
                    title: 'Switch to system theme',
                    Icon: DevicesRounded,
                };
            case 'system':
                return {
                    title: 'Switch to light mode',
                    Icon: LightModeRounded,
                };
        }
    };

    const { title, Icon } = getToggleConfig();

    return (
        <TooltipButton
            title={title}
            onClick={toggleTheme}
            color="inherit"
            Icon={Icon}
        />
    );
}

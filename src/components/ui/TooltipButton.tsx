import React from 'react';

import { Tooltip, IconButton } from '../mui';

type IconComponent = React.ElementType;

interface TooltipButtonProps {
    Icon: IconComponent;
    title: string;
    size?: 'small' | 'medium' | 'large' | 'inherit';
    [key: string]: unknown;
}

export function TooltipButton({
    Icon,
    title,
    size = 'large',
    ...rest
}: TooltipButtonProps) {
    const iconButtonSize = size === 'inherit' ? undefined : size;

    return (
        <Tooltip title={title}>
            <span>
                <IconButton size={iconButtonSize} aria-label={title} {...rest}>
                    <Icon fontSize="inherit" aria-hidden="true" />
                </IconButton>
            </span>
        </Tooltip>
    );
}

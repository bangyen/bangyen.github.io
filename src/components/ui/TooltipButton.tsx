import type { IconButtonProps } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import React from 'react';

type IconComponent = React.ElementType;

/**
 * Tooltip-wrapped icon button used throughout the app header and controls.
 *
 * Extends MUI's `IconButtonProps` so callers get full type safety on
 * pass-through props (e.g. `onClick`, `sx`, `disabled`) instead of falling
 * through an untyped index signature.
 *
 * The extra anchor / router-link props (`href`, `target`, `rel`, `to`)
 * and `component` are declared explicitly to support the polymorphic
 * `component="a"` / `component={Link}` pattern without requiring a
 * generic type parameter at every call site.
 */
export interface TooltipButtonProps extends Omit<
    IconButtonProps,
    'children' | 'size'
> {
    Icon: IconComponent;
    title: string;
    size?: 'small' | 'medium' | 'large' | 'inherit';
    /** Polymorphic root element (e.g. `"a"`, React Router `Link`). */
    component?: React.ElementType;
    /** Anchor href when `component="a"`. */
    href?: string;
    /** Anchor target when `component="a"`. */
    target?: string;
    /** Anchor rel when `component="a"`. */
    rel?: string;
    /** React Router `to` prop when `component={Link}`. */
    to?: string;
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

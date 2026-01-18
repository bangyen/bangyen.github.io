import React from 'react';
import { Typography } from '../../../components/mui';
import type { SxProps, Theme } from '@mui/material/styles';

export interface TextProps {
    text: string | number;
    sx?: SxProps<Theme>;
    [key: string]: unknown;
}

export function Text({ text, ...props }: TextProps) {
    return (
        <Typography
            {...props}
            sx={{
                fontSize: 'inherit',
                fontWeight: 'inherit',
                fontFamily: 'inherit',
                userSelect: 'none',
                lineHeight: 1,
                display: 'inline',
                ...props.sx,
            }}
        >
            {text}
        </Typography>
    );
}

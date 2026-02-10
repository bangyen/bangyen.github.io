import type { SxProps, Theme } from '@mui/material/styles';
import React from 'react';

import { Typography } from '@/components/mui';

export interface TextProps {
    text: string | number;
    sx?: SxProps<Theme>;
    [key: string]: unknown;
}

export function Text({ text, ...props }: TextProps) {
    return (
        <Typography
            {...props}
            sx={
                [
                    {
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        userSelect: 'none',
                        lineHeight: 1,
                        display: 'inline',
                    },
                    ...(Array.isArray(props.sx)
                        ? (props.sx as SxProps<Theme>[])
                        : [props.sx as SxProps<Theme>]),
                ] as SxProps<Theme>
            }
        >
            {text}
        </Typography>
    );
}

import { Box, styled } from '@mui/material';

import { BOARD_STYLES } from '../config/constants';

export const ContentContainer = styled(Box)({
    flex: 1,
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
});

export interface BoardContainerBaseProps {
    customPadding?: { mobile: string | number; desktop: string | number };
    customBorderRadius?: string | number;
    customBorder?: string;
}

export const BoardContainerBase = styled(Box, {
    shouldForwardProp: prop =>
        !['customPadding', 'customBorderRadius', 'customBorder'].includes(
            prop as string,
        ),
})<BoardContainerBaseProps>(
    ({ theme, customPadding, customBorderRadius, customBorder }) => ({
        position: 'relative',
        width: 'fit-content',
        userSelect: 'none',
        padding: customPadding?.mobile ?? BOARD_STYLES.PADDING.MOBILE,
        [theme.breakpoints.up('sm')]: {
            padding: customPadding?.desktop ?? BOARD_STYLES.PADDING.DESKTOP,
        },
        borderRadius: customBorderRadius ?? BOARD_STYLES.BORDER_RADIUS,
        border: customBorder ?? BOARD_STYLES.BORDER,
    }),
);

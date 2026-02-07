import React from 'react';
import { Box, Grid } from '../../../components/mui';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { COLORS } from '../../../config/theme';
import { useMobile } from '../../../hooks';

interface GamePageLayoutProps {
    children: React.ReactNode;
    controls: React.ReactNode;
    infoUrl?: string;
    title?: string;
    background?: string;
    paddingBottom?: string | object;
    contentSx?: object;
}

export function GamePageLayout({
    children,
    controls,
    infoUrl,
    _title, // Reserved for future use
    background = COLORS.surface.background,
    paddingBottom = { xs: '80px', md: '120px' },
    contentSx = {},
}: GamePageLayoutProps & { _title?: string }) {
    const _mobile = useMobile('sm');

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                background,
                position: 'relative',
                overflow: 'hidden',
                height: '100vh',
                transition: 'background 0.5s ease-in-out',
            }}
        >
            <GlobalHeader showHome={true} infoUrl={infoUrl} />
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    pb: paddingBottom,
                    ...contentSx,
                }}
            >
                {children}
            </Box>
            {controls}
        </Grid>
    );
}

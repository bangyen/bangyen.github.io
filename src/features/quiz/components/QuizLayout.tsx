import { Box, Typography, Grid } from '@mui/material';

import { Grid as MuiGrid } from '../../../components/mui';
import { COLORS, TYPOGRAPHY } from '../../../config/theme';

interface QuizLayoutProps {
    title: string;
    subtitle?: string;
    infoUrl: string;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
}

import { GlobalHeader } from '../../../components/layout/GlobalHeader';

const QuizLayout: React.FC<QuizLayoutProps> = ({
    title,
    subtitle,
    infoUrl,
    children,
    headerContent,
}) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: COLORS.surface.background,
            }}
        >
            <GlobalHeader showHome={true} infoUrl={infoUrl} />
            <Grid
                container
                flex={1}
                flexDirection="column"
                alignItems="center"
                sx={{
                    py: 4, // Reduced from 8 since we have a header now
                    px: { xs: 2, sm: 4 },
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        mb: 6,
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: 800,
                        mx: 'auto',
                        marginBottom: 0,
                    }}
                >
                    <MuiGrid
                        container={true}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ marginBottom: 4 }}
                    >
                        <MuiGrid
                            size={{ xs: 'grow', sm: 'auto' }}
                            sx={{
                                display: 'flex',
                                justifyContent: {
                                    xs: 'flex-start',
                                    sm: 'flex-start',
                                },
                                mb: 0,
                                minWidth: 0,
                            }}
                        >
                            {!headerContent ? (
                                <Typography
                                    variant="h1"
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                                        fontSize: TYPOGRAPHY.fontSize.h2,
                                    }}
                                >
                                    {title}
                                </Typography>
                            ) : (
                                <>
                                    <Box
                                        sx={{
                                            display: 'block',
                                        }}
                                    >
                                        <Typography
                                            variant="h1"
                                            sx={{
                                                color: COLORS.text.primary,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight.bold,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.h2,
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: {
                                                xs: 'flex',
                                                sm: 'none',
                                            },
                                            justifyContent: 'flex-end',
                                            width: '100%',
                                        }}
                                    >
                                        {headerContent}
                                    </Box>
                                </>
                            )}
                        </MuiGrid>
                        {headerContent && (
                            <MuiGrid
                                size={{ xs: 0, sm: 'auto' }}
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    flex: 1,
                                    justifyContent: 'center',
                                    px: 4,
                                }}
                            >
                                {headerContent}
                            </MuiGrid>
                        )}
                    </MuiGrid>

                    {subtitle && (
                        <Typography
                            variant="h5"
                            sx={{
                                color: COLORS.text.secondary,
                                marginTop: 2,
                                marginBottom: 4,
                                fontWeight: TYPOGRAPHY.fontWeight.normal,
                                fontSize: TYPOGRAPHY.fontSize.subheading,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {children}
            </Grid>
        </Box>
    );
};

export default QuizLayout;

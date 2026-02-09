import React from 'react';
import { Box, Typography } from '../../../../components/mui';
import { COLORS, TYPOGRAPHY } from '../../../../config/theme';
import { RESEARCH_STYLES } from '../../constants';

interface ImageMappingViewProps {
    imageMapping: { state: string; toggle: string }[];
    isFullSubspace: boolean;
}

export const ImageMappingView: React.FC<ImageMappingViewProps> = ({
    imageMapping,
    isFullSubspace,
}) => {
    if (imageMapping.length === 0) return null;

    return (
        <Box
            sx={{
                minWidth: 0,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: COLORS.primary.main,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    display: 'block',
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_XS,
                }}
            >
                {isFullSubspace ? 'Chasing Table' : 'Image Basis'}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    px: 1,
                    mb: 0.5,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        flex: 1,
                        color: COLORS.text.secondary,
                        fontSize: '0.55rem',
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        letterSpacing: 0.5,
                    }}
                >
                    BOTTOM RESIDUAL
                </Typography>
                <Box sx={{ width: 25 }} />
                <Typography
                    variant="caption"
                    sx={{
                        flex: 1,
                        color: COLORS.text.secondary,
                        fontSize: '0.55rem',
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        letterSpacing: 0.5,
                        textAlign: 'right',
                    }}
                >
                    TOP CORRECTION
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    pr: 1,
                }}
            >
                {imageMapping.map(m => (
                    <Box
                        key={m.state}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_XS,
                            p: 1,
                            px: 1.25,
                            backgroundColor: RESEARCH_STYLES.GLASS.DARK,
                            borderRadius: RESEARCH_STYLES.LAYOUT.CARD_RADIUS,
                            color: COLORS.text.primary,
                            border: `1px solid ${RESEARCH_STYLES.BORDER.VERY_SUBTLE}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                color: COLORS.data.green,
                                flex: 1,
                                wordBreak: 'break-all',
                            }}
                        >
                            {m.state}
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                color: COLORS.text.secondary,
                                mx: 1,
                            }}
                        >
                            →
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                color: COLORS.primary.main,
                                flex: 1,
                                textAlign: 'right',
                                wordBreak: 'break-all',
                            }}
                        >
                            {m.toggle}
                        </Box>
                    </Box>
                ))}
                {!isFullSubspace && (
                    <Box
                        sx={{
                            p: 1,
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: COLORS.text.secondary,
                                fontStyle: 'italic',
                                fontSize: '0.6rem',
                            }}
                        >
                            ... and other reachable combinations
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

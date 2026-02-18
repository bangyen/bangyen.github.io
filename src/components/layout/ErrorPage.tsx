import { Box, Fade, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { HomeRounded, ArrowBackRounded } from '@/components/icons';
import { ErrorCard } from '@/components/ui/ErrorCard';
import {
    errorContainerSx,
    errorButtonSx,
} from '@/components/ui/ErrorCard.styles';
import { PAGE_TITLES } from '@/config/constants';

/**
 * Full-page 404 error component shown when a route is not found.
 *
 * Lives in the layout layer because it is a router-level concern,
 * rendered via the route table rather than belonging to any feature.
 */
export function ErrorPage(): React.ReactElement {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = PAGE_TITLES.error;
    }, []);

    return (
        <Box sx={errorContainerSx}>
            <Fade in timeout={1000}>
                <div>
                    <ErrorCard
                        title="Page Not Found"
                        message="This page doesn't exist or has been moved."
                    >
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackRounded />}
                            onClick={() => {
                                void navigate(-1);
                            }}
                            sx={errorButtonSx}
                        >
                            Go Back
                        </Button>
                        <Button
                            component={Link}
                            to="/"
                            variant="outlined"
                            startIcon={<HomeRounded />}
                            sx={errorButtonSx}
                        >
                            Return to Home
                        </Button>
                    </ErrorCard>
                </div>
            </Fade>
        </Box>
    );
}

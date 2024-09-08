import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import { HomeButton } from '../helpers';

export default function Error() {
    document.title
        = 'Page Not Found | Bangyen';
    return (
        <Grid
            container
            direction='column'
            height='100vh'>
            <Grid
                flex={1}
                display='flex'
                justifyContent='center'
                alignItems='center'>
                    <Typography
                        sx={{
                        typography: {
                            xs: 'h5',
                            sm: 'h4',
                            md: 'h3'
                        }
                    }}>
                    This page isn't available.
                </Typography>
            </Grid>
            <Grid
                position='absolute'
                bottom={30}
                left='50%'
                transform='translateX(-50%)'
                display='flex'
                justifyContent='center'>
                <HomeButton />
            </Grid>
        </Grid>
    );
}
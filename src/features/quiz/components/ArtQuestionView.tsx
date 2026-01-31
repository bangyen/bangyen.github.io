import React from 'react';
import { Box } from '@mui/material';
import { ArtItem } from '../types/quiz';

interface ArtQuestionViewProps {
    item: ArtItem;
}

const ArtQuestionView: React.FC<ArtQuestionViewProps> = ({ item }) => {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                component="img"
                src={item.imageUrl}
                alt="Artwork for the quiz"
                sx={{
                    maxHeight: { xs: 300, sm: 400 },
                    maxWidth: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                    mb: 2,
                    display: 'block',
                    objectFit: 'contain',
                }}
            />
        </Box>
    );
};

export default ArtQuestionView;

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box } from '../../../components/mui';
import { StunStep, Suffolk, WII2D, Back } from '..';
import { InterpreterNavigation } from '../components/InterpreterNavigation';
import { PAGE_TITLES } from '../../../config/constants';
import { COLORS, SPACING } from '../../../config/theme';

export default function Interpreters(): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const active = searchParams.get('type') || 'stun-step';

    useEffect(() => {
        document.title = PAGE_TITLES.interpreters;
    }, []);

    const handleChange = (newValue: string) => {
        setSearchParams({ type: newValue });
    };

    const renderInterpreter = () => {
        const navigation = (
            <InterpreterNavigation active={active} onChange={handleChange} />
        );

        switch (active) {
            case 'stun-step':
                return <StunStep navigation={navigation} />;
            case 'suffolk':
                return <Suffolk navigation={navigation} />;
            case 'wii2d':
                return <WII2D navigation={navigation} />;
            case 'back':
                return <Back navigation={navigation} />;
            default:
                return <StunStep navigation={navigation} />;
        }
    };

    return (
        <Box
            sx={{
                minHeight: { xs: '50vh', md: '100vh' },
                background: COLORS.surface.background,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: SPACING.maxWidth.lg,
                    margin: '0 auto',
                }}
            >
                {renderInterpreter()}
            </Box>
        </Box>
    );
}

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box } from '../../../components/mui';
import { StunStep, Suffolk, WII2D, Back } from '..';
import { InterpreterNavigation } from '../components/InterpreterNavigation';
import { PAGE_TITLES } from '../../../config/constants';
import { COLORS, SPACING } from '../../../config/theme';

import { GlobalHeader } from '../../../components/layout/GlobalHeader';

export default function Interpreters(): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const active = searchParams.get('type') || 'stun-step';

    useEffect(() => {
        document.title = PAGE_TITLES.interpreters;
    }, []);

    const handleChange = (newValue: string) => {
        setSearchParams({ type: newValue });
    };

    // Map interpreter types to their display names for the wiki URL
    const getInterpreterName = (type: string): string => {
        const nameMap: Record<string, string> = {
            'stun-step': 'Stun Step',
            suffolk: 'Suffolk',
            wii2d: 'WII2D',
            back: 'Back',
        };
        return nameMap[type] || 'Stun Step';
    };

    const infoUrl = `https://esolangs.org/wiki/${getInterpreterName(active).replace(' ', '_')}`;

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
                height: { xs: '100dvh', md: '100vh' },
                width: '100%',
                boxSizing: 'border-box',
                background: COLORS.surface.background,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <GlobalHeader showHome={true} infoUrl={infoUrl} />
            <Box
                sx={{
                    width: '100%',
                    maxWidth: SPACING.maxWidth.lg,
                    margin: '0 auto',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                }}
            >
                {renderInterpreter()}
            </Box>
        </Box>
    );
}

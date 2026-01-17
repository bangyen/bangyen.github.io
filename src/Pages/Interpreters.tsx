import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box } from '../components/mui';
import { Stun_Step, Suffolk, WII2D, Back } from '../Interpreters';
import { InterpreterNavigation } from '../components/InterpreterNavigation';
import { PAGE_TITLES } from '../config/constants';
import { COLORS } from '../config/theme';

export default function Interpreters(): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const active = searchParams.get('type') || 'Stun_Step';

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
            case 'Stun_Step':
                return <Stun_Step navigation={navigation} />;
            case 'Suffolk':
                return <Suffolk navigation={navigation} />;
            case 'WII2D':
                return <WII2D navigation={navigation} />;
            case 'Back':
                return <Back navigation={navigation} />;
            default:
                return <Stun_Step navigation={navigation} />;
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: COLORS.surface.background,
            }}
        >
            {renderInterpreter()}
        </Box>
    );
}

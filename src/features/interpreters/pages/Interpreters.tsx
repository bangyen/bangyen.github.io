import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { StunStep, Suffolk, WII2D, Back } from '..';
import { InterpreterErrorBoundary } from '../components/InterpreterErrorBoundary';
import { InterpreterNavigation } from '../components/InterpreterNavigation';

import { PageLayout } from '@/components/layout/PageLayout';
import { PAGE_TITLES, ROUTES } from '@/config/constants';
import { SPACING } from '@/config/theme';

export default function Interpreters(): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const active = searchParams.get('type') ?? ROUTES.interpreters.StunStep;

    useEffect(() => {
        document.title = PAGE_TITLES.interpreters;
    }, []);

    const handleChange = (newValue: string) => {
        setSearchParams({ type: newValue });
    };

    // Map interpreter types to their display names for the wiki URL
    const getInterpreterName = (type: string): string => {
        const nameMap: Record<string, string> = {
            [ROUTES.interpreters.StunStep]: 'Stun Step',
            [ROUTES.interpreters.Suffolk]: 'Suffolk',
            [ROUTES.interpreters.WII2D]: 'WII2D',
            [ROUTES.interpreters.Back]: 'Back',
        };
        return nameMap[type] ?? 'Stun Step';
    };

    const infoUrl = `https://esolangs.org/wiki/${getInterpreterName(active).replace(' ', '_')}`;

    const renderInterpreter = () => {
        const navigation = (
            <InterpreterNavigation active={active} onChange={handleChange} />
        );

        switch (active) {
            case ROUTES.interpreters.StunStep:
                return <StunStep navigation={navigation} />;
            case ROUTES.interpreters.Suffolk:
                return <Suffolk navigation={navigation} />;
            case ROUTES.interpreters.WII2D:
                return <WII2D navigation={navigation} />;
            case ROUTES.interpreters.Back:
                return <Back navigation={navigation} />;
            default:
                return <StunStep navigation={navigation} />;
        }
    };

    return (
        <PageLayout
            infoUrl={infoUrl}
            containerSx={{
                height: { xs: '100dvh', md: '100vh' },
            }}
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
            <InterpreterErrorBoundary>
                {renderInterpreter()}
            </InterpreterErrorBoundary>
        </PageLayout>
    );
}

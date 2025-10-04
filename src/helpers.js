import { Tooltip, IconButton, Paper, Box } from '@mui/material';
import { useState, useCallback } from 'react';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import { getSpace } from './calculate';
import {
    COMPONENTS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
} from './config/constants';

import {
    HomeRounded,
    CloseRounded,
    GamepadRounded,
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded,
} from '@mui/icons-material';

/**
 * TooltipButton component provides accessible icon buttons with tooltips
 * for improved user experience and screen reader support.
 */
export function TooltipButton(props) {
    const { Icon, title, ...rest } = props;

    return (
        <Tooltip title={title}>
            <IconButton size="large" aria-label={title} {...rest}>
                <Icon fontSize="inherit" aria-hidden="true" />
            </IconButton>
        </Tooltip>
    );
}

/**
 * HomeButton component provides accessible navigation to home page
 * with proper ARIA labels and keyboard navigation support.
 */
export function HomeButton({ hide, ...rest }) {
    if (hide) return null;

    return (
        <TooltipButton
            to="/"
            key="Home"
            title="Navigate to Home"
            component={Link}
            Icon={HomeRounded}
            aria-label="Navigate to Home page"
            {...rest}
        />
    );
}

function Cell({ size, children, ...rest }) {
    const remSize = `${size}rem`;
    const radius = `${size / 4}rem`;

    const props = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius,
        height: remSize,
        width: remSize,
        fontSize: `${size * 0.4}rem`,
        fontWeight: TYPOGRAPHY.fontWeight.semiBold,
        fontFamily: 'monospace',
        transition: ANIMATIONS.transition,
    };

    const combined = {
        ...props,
        ...rest,
    };

    return <Box {...combined}>{children}</Box>;
}

function Row(props) {
    const { cols, size, index, spacing, cellProps } = props;

    const WrappedCell = (_, j) => (
        <Cell {...cellProps(index, j)} key={`${index}_${j}`} size={size} />
    );

    return (
        <Grid container size={12} spacing={spacing} justifyContent="center">
            {Array.from({ length: cols }, WrappedCell)}
        </Grid>
    );
}

/**
 * CustomGrid component provides accessible grid layout with proper
 * ARIA roles and semantic structure for screen readers.
 */
export function CustomGrid(props) {
    const { size, rows, cols, cellProps, ...rest } = props;

    const auto = getSpace(size);
    const { space = auto } = props;
    const rem = `${space}rem`;

    const getRow = useCallback(
        (_, i) => (
            <Row
                index={i}
                cols={cols}
                size={size}
                spacing={rem}
                key={`row_${i}`}
                cellProps={cellProps}
            />
        ),
        [cols, size, rem, cellProps]
    );

    return (
        <Grid
            container
            size={12}
            spacing={rem}
            alignItems="center"
            role="grid"
            aria-label={`Grid with ${rows} rows and ${cols} columns`}
            {...rest}
        >
            {Array.from({ length: rows }, getRow)}
        </Grid>
    );
}

/**
 * Navigation component provides accessible navigation controls
 * with proper ARIA landmarks and keyboard navigation support.
 */
export function Navigation({ children, ...rest }) {
    return (
        <Paper
            elevation={0}
            component="nav"
            role="navigation"
            aria-label="Game controls navigation"
            sx={{
                transform: 'translateX(-50%)',
                position: 'absolute',
                borderRadius: SPACING.borderRadius.medium,
                padding: 2,
                bottom: 50,
                left: '50%',
                zIndex: 10,
                ...COMPONENTS.navigation,
                ...rest,
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 0, // Allow shrinking on mobile
                }}
            >
                {children}
            </Grid>
        </Paper>
    );
}

/**
 * Controls component provides accessible game controls with proper
 * keyboard navigation and screen reader announcements.
 */
export function Controls({ handler }) {
    const [show, setShow] = useState(false);
    const opacity = show ? 0.8 : 1;

    return (
        <Navigation opacity={opacity}>
            <HomeButton hide={show} />
            <Arrows show={show} setShow={setShow} handler={handler} />
        </Navigation>
    );
}

/**
 * Arrows component provides accessible directional controls with
 * proper ARIA labels and keyboard navigation support.
 */
function Arrows({ show, setShow, handler }) {
    const flip = useCallback(() => setShow(!show), [show, setShow]);

    if (!show)
        return (
            <TooltipButton
                title="Show Game Controls"
                Icon={GamepadRounded}
                onClick={flip}
                aria-label="Show game controls"
            />
        );

    return (
        <Grid role="group" aria-label="Directional controls">
            <Grid width="100%" display="flex" justifyContent="center">
                <TooltipButton
                    title="Move Up"
                    Icon={KeyboardArrowUpRounded}
                    onClick={handler('up')}
                    aria-label="Move up"
                />
            </Grid>
            <Grid>
                <TooltipButton
                    title="Move Left"
                    Icon={KeyboardArrowLeftRounded}
                    onClick={handler('left')}
                    aria-label="Move left"
                />
                <IconButton
                    size="large"
                    onClick={flip}
                    aria-label="Hide controls"
                >
                    <CloseRounded fontSize="inherit" aria-hidden="true" />
                </IconButton>
                <TooltipButton
                    title="Move Right"
                    Icon={KeyboardArrowRightRounded}
                    onClick={handler('right')}
                    aria-label="Move right"
                />
            </Grid>
            <Grid width="100%" display="flex" justifyContent="center">
                <TooltipButton
                    title="Move Down"
                    Icon={KeyboardArrowDownRounded}
                    onClick={handler('down')}
                    aria-label="Move down"
                />
            </Grid>
        </Grid>
    );
}

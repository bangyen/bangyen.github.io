import { Tooltip, IconButton, Paper, Box } from "@mui/material";
import { useState, useCallback } from "react";
import Grid from '@mui/material/Grid2';
import { Link } from "react-router-dom";
import {
    HomeRounded,
    CloseRounded,
    GamepadRounded,
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded
} from '@mui/icons-material';

function getSpace(size) {
    return size / 20;
}

export function convertPixels(
        size, height, width,
        pHeight, pWidth) {
    const space = getSpace(size);
    const pixel = 16 * (size + space);
    const rows  = Math.floor(pHeight * height / pixel);
    const cols  = Math.floor(pWidth  * width  / pixel);

    return {rows, cols};
}

export function TooltipButton(props) {
    const {Icon, title, ...rest} = props;

    return (
        <Tooltip title={title}>
            <IconButton
                    {...rest}
                    size='large'>
                <Icon fontSize='inherit' />
            </IconButton>
        </Tooltip>
    );
}

export function HomeButton({hide}) {
    if (hide)
        return null;

    return (
        <TooltipButton
            to="/"
            key='Home'
            title='Home'
            component={Link}
            Icon={HomeRounded} />
    );
}

function Cell(size) {
    return ({children, ...rest}) => {
        const rem = `${size}rem`;

        return (
            <Box
                {...rest}
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={rem}
                width={rem}
                borderRadius={
                    `${size / 5}rem`}>
                {children}
            </Box>
        );
    };
}

function Row({spacing, children}) {
    return (
        <Grid
            container
            size={12}
            spacing={spacing}
            justifyContent="center">
            {children}
        </Grid>
    );
}

export function CustomGrid({
        size,
        rows,
        cols,
        Wrapper,
        space = true
    }) {
    if (space === true)
        space = getSpace(size);

    const rem = `${space}rem`;

    return (
        <Grid
            container
            size={12}
            spacing={rem}
            alignItems="center">
            {[...Array(rows)]
                .map((_, i) => (
                    <Row
                        key={`row_${i}`}
                        spacing={rem}>
                        {[...Array(cols)]
                            .map((_, j) => (
                                <Wrapper
                                    key={`${i}_${j}`}
                                    Cell={Cell(size)}
                                    row={i}
                                    col={j} />
                            ))}
                    </Row>
                ))}
        </Grid>
    );
}

export function Controls({velocity}) {
    const [show, setShow] = useState(false);

    return (
        <Paper
            elevation={1}
            sx={{
                left: "50%",
                transform: "translateX(-50%)",
                position: "absolute",
                borderRadius: 2,
                padding: 1,
                bottom: 50,
            }}>
            <Grid
                container
                spacing={2}>
                <HomeButton
                    hide={show} />
                <Arrows
                    show={show}
                    setShow={setShow}
                    velocity={velocity} />
            </Grid>
        </Paper>
    );
}

function Arrows({show, setShow, velocity}) {
    const flip = useCallback(
        () => setShow(!show),
        [show, setShow]);

    const move = useCallback(
        (value) => {
            return () => {
                if (velocity.current + value)
                    velocity.current = value;
            };
        }, [velocity]);

    if (!show)
        return (
            <TooltipButton
                title='Controls'
                Icon={GamepadRounded}
                onClick={flip} />
        );

    return (
        <Grid>
            <Grid
                width='100%'
                display='flex'
                justifyContent='center'>
                <TooltipButton
                    title='Up'
                    Icon={KeyboardArrowUpRounded}
                    onClick={move(-2)} />
            </Grid>
            <Grid>
                <TooltipButton
                    title='Left'
                    Icon={KeyboardArrowLeftRounded}
                    onClick={move(-1)} />
                <TooltipButton
                    title='Close'
                    Icon={CloseRounded}
                    onClick={flip} />
                <TooltipButton
                    title='Right'
                    Icon={KeyboardArrowRightRounded}
                    onClick={move(1)} />
            </Grid>
            <Grid
                width='100%'
                display='flex'
                justifyContent='center'>
                <TooltipButton
                    title='Down'
                    Icon={KeyboardArrowDownRounded}
                    onClick={move(2)} />
            </Grid>
        </Grid>
    );
}

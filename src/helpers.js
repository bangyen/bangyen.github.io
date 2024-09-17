import { Tooltip, IconButton, Paper, Box } from "@mui/material";
import { useState, useCallback } from "react";
import Grid from '@mui/material/Grid2';
import { Link } from "react-router-dom";
import { getSpace } from "./calculate";
import {
    HomeRounded,
    CloseRounded,
    GamepadRounded,
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded
} from '@mui/icons-material';

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

function Cell({
        size, children, ...rest}) {
    const remSize = `${size}rem`;
    const radius  = `${size / 5}rem`;

    const props = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        height: remSize,
        width: remSize
    };

    const combined = {
        ...props,
        ...rest};

    return (
        <Box {...combined}>
            {children}
        </Box>
    );
}

function Row(props) {
    const {
        cols,
        size,
        index,
        spacing,
        cellProps
    } = props;

    const WrappedCell
        = (_, j) => (
            <Cell
                {...cellProps(index, j)}
                key={`${index}_${j}`}
                size={size} />
        );
 
    return (
        <Grid
            container
            size={12}
            spacing={spacing}
            justifyContent="center">
            {Array.from(
                { length: cols },
                WrappedCell)}
        </Grid>
    );
}

export function CustomGrid(props) {
    const {
        size,
        rows,
        cols,
        cellProps
    } = props;

    const auto = getSpace(size);
    const { space = auto } = props;
    const rem  = `${space}rem`;

    const getRow = useCallback(
        (_, i) => (
            <Row
                index={i}
                cols={cols}
                size={size}
                spacing={rem}
                key={`row_${i}`}
                cellProps={cellProps} />
        ), [cols, size, rem, cellProps]);

    return (
        <Grid
            container
            size={12}
            spacing={rem}
            alignItems="center">
            {Array.from(
                { length: rows },
                getRow)}
        </Grid>
    );
}

export function Controls({handler}) {
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
                    handler={handler} />
            </Grid>
        </Paper>
    );
}

function Arrows({show, setShow, handler}) {
    const flip = useCallback(
        () => setShow(!show),
        [show, setShow]);

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
                    onClick={handler('up')} />
            </Grid>
            <Grid>
                <TooltipButton
                    title='Left'
                    Icon={KeyboardArrowLeftRounded}
                    onClick={handler('left')} />
                <IconButton
                        size='large'
                        onClick={flip}>
                    <CloseRounded
                        fontSize='inherit' />
                </IconButton>
                <TooltipButton
                    title='Right'
                    Icon={KeyboardArrowRightRounded}
                    onClick={handler('right')} />
            </Grid>
            <Grid
                width='100%'
                display='flex'
                justifyContent='center'>
                <TooltipButton
                    title='Down'
                    Icon={KeyboardArrowDownRounded}
                    onClick={handler('down')} />
            </Grid>
        </Grid>
    );
}

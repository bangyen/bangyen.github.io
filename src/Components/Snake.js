import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import {
    convertPixels,
    GenericGrid,
    CustomButton,
    HomeButton
} from './helpers';
import { useWindow, useTimer, useKeys } from './hooks';
import {
    GamepadRounded,
    CloseRounded,
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded
} from '@mui/icons-material';

function Arrows({show, setShow}) {
    const flip
        = () =>
            setShow(!show);

    if (!show)
        return (
            <CustomButton
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
                <CustomButton
                    title='Up'
                    Icon={KeyboardArrowUpRounded}
                    onClick={flip} />
            </Grid>
            <Grid>
                <CustomButton
                    title='Left'
                    Icon={KeyboardArrowLeftRounded}
                    onClick={flip} />
                <CustomButton
                    title='Close'
                    Icon={CloseRounded}
                    onClick={flip} />
                <CustomButton
                    title='Right'
                    Icon={KeyboardArrowRightRounded}
                    onClick={flip} />
            </Grid>
            <Grid
                width='100%'
                display='flex'
                justifyContent='center'>
                <CustomButton
                    title='Down'
                    Icon={KeyboardArrowDownRounded}
                    onClick={flip} />
            </Grid>
        </Grid>
    );
}

export default function Snake() {
    const [show, setShow] = useState(false);
    const {width, height} = useWindow();
    const {setRepeat} = useTimer(200);

    const size   = 5;
    const rWidth = 0.9;
    const rHeight
        = 0.85 - show * 0.05;

    const {rows, cols}
        = convertPixels(
            size, rHeight, rWidth,
            height,  width);

    const Wrapper = ({Cell, row, col}) => (
        <Cell
            size={size}
            backgroundColor="secondary.light" />
    );

    return (
        <Grid
            container
            height='100vh'
            flexDirection='column'>
            <Grid
                flex={1}
                display='flex'
                justifyContent='center'
                alignItems='center'>
                <GenericGrid
                    size={size}
                    rows={rows}
                    cols={cols}
                    Wrapper={Wrapper} />
            </Grid>
            <Grid
                container
                spacing={2}
                margin={4}
                display='flex'
                justifyContent='center'
                alignItems='center'>
                <HomeButton
                    hide={show} />
                <Arrows
                    show={show}
                    setShow={setShow} />
            </Grid>
        </Grid>
    );
}
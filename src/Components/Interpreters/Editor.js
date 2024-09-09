import Tooltip  from '@mui/material/Tooltip';
import Grid     from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import { convertPixels, TooltipButton, CustomGrid } from '../helpers';
import { useContainer } from '../hooks';

import {
    Typography,
    TextField,
    Box
} from '@mui/material';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    LastPageRounded,
    HomeRounded,
    StopRounded,
    InfoRounded,
    CodeRounded,
    DataArrayRounded,
    PlusOneRounded,
    TextFieldsRounded,
    // SquareRounded
} from '@mui/icons-material';

import React, {
    useMemo,
    createContext,
    useContext
} from 'react';

export const EditorContext = createContext();

export default function Editor({children}) {
    const { name, container }
        = useContext(EditorContext);

    return (
        <Grid container
                height="100vh"
                display="flex"
                flexDirection="column"
                spacing={2}
                paddingTop="5vh"
                paddingBottom="5vh"
                paddingLeft="5vw"
                paddingRight="5vw">
            <Grid container
                    justifyContent="space-between"
                    alignItems="center">
                <Grid size="grow"
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'block'
                            }
                        }}>
                    <Typography
                        variant="h2">
                        {name}
                    </Typography>
                </Grid>
                <Toolbar />
            </Grid>
            <Grid
                flex={1}
                ref={container}
                sx={{
                    overflowY: 'auto',
                }}
                display="flex"
                paddingTop="2vh"
                paddingBottom="2vh"
                alignItems="center">
                {children}
            </Grid>
            <Program  />
            <Output   />
            <Tape     />
            <Register />
        </Grid>
    );
}

function Toolbar() {
    const { name, dispatch }
        = useContext(EditorContext);

    const link = 'https://esolangs.org/wiki/'
        + name.replace(' ', '_');

    return [
        <TooltipButton
            key='Run'
            title='Run'
            onClick={dispatch('run')}
            Icon={PlayArrowRounded} />,
        <TooltipButton
            key='Stop'
            title='Stop'
            onClick={dispatch('stop')}
            Icon={StopRounded} />,
        <TooltipButton
            key='Previous'
            title='Previous'
            onClick={dispatch('prev')}
            Icon={NavigateBeforeRounded} />,
        <TooltipButton
            key='Next'
            title='Next'
            onClick={dispatch('next')}
            Icon={NavigateNextRounded} />,
        <TooltipButton
            key='Fast Forward'
            title='Fast Forward'
            onClick={dispatch('ff')}
            Icon={LastPageRounded} />,
        <TooltipButton
            key='Info'
            href={link}
            title='Info'
            Icon={InfoRounded} />,
        <TooltipButton
            to="/"
            key='Home'
            title='Home'
            component={Link}
            Icon={HomeRounded} />
    ];
}

function Program() {
    const { code, ind }
        = useContext(EditorContext);

    if (code === undefined)
        return (null);

    return (
        <Values
            Icon={CodeRounded}
            title="Program"
            arr={[...code]}
            ptr={ind}>
            <Text
                text={"\xA0"} />
        </Values>
    );
    }

function Tape() {
    const { tape, ptr, tapeFlag }
        = useContext(EditorContext);

    if (!tapeFlag)
        return (null);

    return (
        <Values
            Icon={DataArrayRounded}
            title="Tape"
            arr={tape}
            ptr={ptr} />
    );
}

function Output() {
    const { out, outFlag }
        = useContext(EditorContext);

    if (!outFlag)
        return (null);

    return (
        <Values
            Icon={TextFieldsRounded}
            title="Output"
            arr={[out]}>
            <Text
                text={'\xA0'} />
        </Values>
    );
}

function Register() {
    const { acc, accFlag }
        = useContext(EditorContext);

    if (!accFlag)
        return (null);

    return (
        <Values
            Icon={PlusOneRounded}
            title="Register"
            arr={[acc]} />
    );
}

function Values(props) {
    const {
        Icon,
        title,
        arr,
        ptr,
        children
    } = props;

    const values = arr.map((val, ind) => {
        const color = ptr === ind
            ? 'info' : 'inherit';

        return (
            <Text
                key={title + ind}
                color={color}
                text={val} />
        );
    });

    return (
        <Scrollable>
            <Tooltip title={title}>
                <Icon />
            </Tooltip>
            {values}
            {children}
        </Scrollable>
    );
}

export function Text(props) {
    return (
        <Typography
                {...props}
                variant='h4'>
            {props.text}
        </Typography>
    );
}

function Scrollable(props) {
    return (
        <Box sx={{
            overflowX: 'auto',
            width: '100%'
        }}>
            <Grid container
                    spacing={4}
                    sx={{
                        marginBottom: 2,
                        alignItems: 'center',
                        minWidth: 'max-content'
                    }}>
                {props.children}
            </Grid>
        </Box>
    );
}

export function GridArea({
        handleChange,
        chooseColor,
        options
    }) {
    const { size, container }
        = useContext(EditorContext);

    let {height, width}
        = useContainer(container);

    height *= 0.8;
    width  *= 0.9;

    const {rows, cols} = useMemo(() => 
        convertPixels(
            size, height, width),
        [size, height, width]
    );

    const Wrapper = ({Cell, row, col}) => {
        const pos    = cols * row + col;
        const color  = chooseColor(pos);
        const value  = options[pos];

        const text   = `${color}.contrastText`;
        const select = `${color}.light`;
        const hover  = `${color}.main`;

        return (
            <Cell
                color={text}
                backgroundColor={select}
                onClick={handleChange(pos)}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: hover
                    }
                }}>
                <Text text={value} />
            </Cell>
        );
    };

    return (
        <CustomGrid
            Wrapper={Wrapper}
            size={size}
            rows={rows}
            cols={cols} />
    );
}

export function TextArea() {
    const { handleChange }
        = useContext(EditorContext);

    return (
        <TextField
            variant="outlined"
            label="Program code"
            defaultValue="Hello, World!"
            slotProps={{
                inputLabel: {shrink: true}
            }}
            fullWidth
            multiline
            onChange={handleChange}
            sx={{
                height: '100%',
                '& .MuiInputBase-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                },
                '& .MuiInputBase-input': {
                    fontFamily: 'monospace'
                }
        }}/>
    );
}

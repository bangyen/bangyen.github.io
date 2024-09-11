import Grid     from '@mui/material/Grid2';
import { Link } from 'react-router-dom';

import { Program, Output, Tape, Register } from './Display';
import { TooltipButton, CustomGrid } from '../helpers';

import {
    Typography,
    TextField
} from '@mui/material';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    LastPageRounded,
    HomeRounded,
    StopRounded,
    InfoRounded
} from '@mui/icons-material';

import React, {
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

export function Text(props) {
    return (
        <Typography
                {...props}
                variant='h4'>
            {props.text}
        </Typography>
    );
}

export function GridArea({
        handleClick,
        chooseColor,
        options,
        rows,
        cols
    }) {
    const { size }
        = useContext(EditorContext);

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
                onClick={handleClick(pos)}
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

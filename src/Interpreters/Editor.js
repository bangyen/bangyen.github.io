
import { Program, Output, Tape, Register } from './Display';
import { Toolbar } from './Toolbar';
import { CustomGrid } from '../helpers';
import Grid from '@mui/material/Grid2';

import {
    Typography,
    TextField
} from '@mui/material';

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

export function GridArea({
        handleClick,
        chooseColor,
        options,
        rows,
        cols
    }) {
    const { size }
        = useContext(EditorContext);

    const cellProps = (row, col) => {
        const pos    = cols * row + col;
        const color  = chooseColor(pos);
        const value  = options[pos];

        const text   = `${color}.contrastText`;
        const select = `${color}.light`;
        const hover  = `${color}.main`;

        return {
            color: text,
            backgroundColor: select,
            onClick: handleClick(pos),
            children: (
                <Text text={value} />
            ),
            sx: {
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: hover
                }
            }
        };
    };

    return (
        <CustomGrid
            cellProps={cellProps}
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

export function Text({
        text, ...props}) {
    return (
        <Typography
                {...props}
                variant='h4'>
            {text}
        </Typography>
    );
}

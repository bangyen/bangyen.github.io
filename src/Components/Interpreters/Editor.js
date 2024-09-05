import Tooltip from '@mui/material/Tooltip';
import Grid    from '@mui/material/Grid2';

import {
    Typography,
    IconButton,
    TextField
} from '@mui/material';

export function CustomButton(props) {
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

export function Monospace(props) {
    return (
        <Typography
                {...props}
                variant='h4'>
            {props.text}
        </Typography>
    );
}

export function Scrollable(props) {
    return (
        <Grid container
                spacing={4}
                overflow="auto"
                flexWrap="nowrap"
                alignItems="center">
            {props.children}
        </Grid>
    );
}

export function TextEditor({value, handleChange}) {
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
            value={value}
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

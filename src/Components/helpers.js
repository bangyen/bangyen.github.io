import { Tooltip, IconButton, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Link } from "react-router-dom";
import { HomeRounded } from "@mui/icons-material";

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
        Wrapper
    }) {
    const space = getSpace(size);
    const rem   = `${space}rem`;

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

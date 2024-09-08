import Grid from '@mui/material/Grid2';
import { CustomGrid, Controls } from '../helpers';

export default function Snowman() {
    const Wrapper = ({Cell, row, col}) => {
        return (
            <Cell
                size={5}
                backgroundColor='secondary.light' />
        );
    };

    return (
        <Grid
            container
            height='100vh'
            flexDirection='column'
            position="relative">
            <Grid
                flex={1}
                display='flex'
                justifyContent='center'
                alignItems='center'>
                <CustomGrid
                    size={5}
                    rows={5}
                    cols={5}
                    Wrapper={Wrapper} />
            </Grid>
            <Controls
                velocity={{}} />
        </Grid>
    );
}

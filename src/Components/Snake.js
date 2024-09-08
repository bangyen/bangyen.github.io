import Grid from '@mui/material/Grid2';
import {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useMemo,
    useCallback
} from 'react';
import {
    convertPixels,
    CustomGrid,
    TooltipButton,
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
import { Paper } from '@mui/material';

function Controls({velocity}) {
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

function modulo(a, b) {
    return (a + b) % b;
}

function getRandom(max) {
    return Math.floor(
        Math.random() * max);
}

function addRandom(
        rows, cols, exclude) {
    const max = rows * cols;
    let pos = getRandom(max);

    while (pos in exclude)
        if (++pos >= max)
            pos = 0;

    return {...exclude, [pos]: -1};
}

function changeAll(cells, change) {
    const newCells = {};

    for (const cell in cells) {
        const value = cells[cell];

        if (value + change > 0)
            newCells[cell]
                = value + change;
        else if (value < 0)
            newCells[cell] = value;
    }

    return newCells;
}

function velocityHandler(direction) {
    const {
        velocity,
        buffer,
        move
    } = direction;

    return (event) => {
        let change;

        if (!event)
            return;

        switch (event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                change = -2;
                break;
            case 'arrowdown':
            case 's':
                change = 2;
                break;
            case 'arrowleft':
            case 'a':
                change = -1;
                break;
            case 'arrowright':
            case 'd':
                change = 1;
                break;
            default:
                return;
        }

        if (velocity.current + change) {
            if (move.current) {
                velocity.current = change;
                move.current     = false;
            } else {
                buffer.current = change;
            }
        }
    };
}

function moveHandler(position, board, direction) {
    const {
        rows,   cols,
        length, cells,
        setCells
    } = board;
    const {velocity, buffer, move} = direction;

    return () => {
        let newCells = changeAll(cells, -1);
        let head     = position.current;
        let change   = velocity.current;

        const max  = rows * cols;
        const size = length.current;
        const next = buffer.current;

        if (change % 2 === 0) {
            const sign
                = change > 0 ? 1 : -1;
            change = sign * cols;
        }

        if (change % cols) {
            const mod = head % cols;
            const col = mod + change;
            const sum = modulo(col, cols)
                + head - mod;

            head = sum;
        } else {
            const sum = head + change;
            head = modulo(sum, max);
        }

        if (head in newCells) {
            if (newCells[head] > 0) {
                const value = newCells[head];
                newCells[head] = size;

                newCells
                    = changeAll(
                        newCells, -value);
            } else {
                newCells[head] = size;
                newCells = changeAll(newCells, 1);

                newCells
                    = addRandom(
                        rows, cols, newCells);
            }

            length.current = newCells[head];
        } else {
            newCells[head] = size;
        }

        if (next) {
            velocity.current = next;
            buffer.current   = null;
        }

        position.current = head;
        move.current     = !next;
        setCells(newCells);
    };
}

export default function Snake() {
    const {width, height} = useWindow();
    const {setRepeat} = useTimer(50);
    const setHandler  = useKeys();

    const length   = useRef(3);
    const move     = useRef(true);
    const buffer   = useRef(null);
    const position = useRef(0);
    const velocity = useRef(1);
    const [cells, setCells]
        = useState({});

    const size = 3;

    const {rows, cols} = useMemo(() => 
        convertPixels(
            3, 1, 1,
            height, width),
        [height, width]
    );

    const direction = useMemo(() => ({
        velocity, buffer, move
    }), []);
    const board = useMemo(() => ({
        rows,   cols,
        length, cells,
        setCells
    }), [rows, cols, length, cells]);

    const handleVelocity = useCallback(
        () => velocityHandler(direction),
        [direction]
    );
    const handleMove = useCallback(
        () => moveHandler(
            position, board, direction),
        [position, board, direction]
    );

    useEffect(() => {
        document.title = 'Snake | Bangyen';
    }, []);

    useEffect(() => {
        const total   = rows * cols;
        const newHead = getRandom(total);
        const newCells
            = {[newHead]:
                length.current};

        setCells(addRandom(
            rows, cols, newCells));
        position.current = newHead;
    }, [rows, cols, length]);

    useLayoutEffect(() => {
        setRepeat(handleMove);
    }, [setRepeat, handleMove]);

    useEffect(() => {
        setHandler(handleVelocity);
    }, [setHandler, handleVelocity]);

    const Wrapper = ({Cell, row, col}) => {
        const index = row * cols + col;
        let color = 'inherit';

        if (index in cells) {
            if (cells[index] > 0)
                color = 'secondary.light';
            else
                color = 'primary.light';
        }

        return (
            <Cell
                size={size}
                backgroundColor={color} />
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
                    size={size}
                    rows={rows}
                    cols={cols}
                    Wrapper={Wrapper} />
            </Grid>
            <Controls
                velocity={velocity} />
        </Grid>
    );
}
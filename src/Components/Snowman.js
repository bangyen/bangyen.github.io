import { button, home, arrows } from './helper';
import { move } from './helper';
import React from 'react';
import {
    FaMale,
    FaWalking,
    FaSnowman,
    FaCircle,
    FaTree
} from 'react-icons/fa';
import {
    BsArrowsMove,
    BsQuestion
} from 'react-icons/bs';

export default class Snowman extends React.Component {
    constructor(props: Props) {
        super(props);

        this.pos = 0;
        this.size = 7;
        this.square = this.size
            * this.size;
        this.stroll = false;

        this.font = n =>
            `calc(var(--board) / ${n})`;
        this.move = this.move.bind(this);
        this.icon = {
            size: this.font(4 * this.size)
        };

        this.random = n => {
            const val = Math.random() * n;
            return Math.floor(val);
        };

        this.state = {
            board: [...Array(9).keys()]
                .map(n => this.setup(n)),
            icon: <FaMale {...this.icon} />,
            info: false,
            dir: false
        };
    }

    componentDidMount() {
        document.title = ' Snowman | Bangyen';
        document.addEventListener(
            'keydown',
            this.move,
            false);
    }

    componentWillUnmount() {
        document.removeEventListener(
            'keydown',
            this.move,
            false);
    }

    move(e) {
        const { board, info } = this.state;
        const size = this.size;
        const grid = board[4];
        let pos = this.pos;
        let flip = false;
        let icon;
        let a, b;

        if (info)
            return;

        switch (e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                icon = FaMale;
                [a, b] = [-1, 0];
                break;
            case 'arrowdown':
            case 's':
                icon = FaMale;
                [a, b] = [1, 0];
                break;
            case 'arrowleft':
            case 'a':
                flip = true;
                [a, b] = [0, -1];
                break;
            case 'arrowright':
            case 'd':
                icon = FaWalking;
                [a, b] = [0, 1];
                break;
            default:
                return;
        }

        const shift = (n, w) => {
            return move({
                vel: [a, b],
                old: size,
                wrap: w,
                pos: n
            });
        };

        const check = (m = 1) => {
            let num = 4;
            let res = pos;
            let two = pos;

            for (let k = 0; k < m; k++) {
                res = shift(res, false);
                two = shift(two);
            }

            if (res !== two)
                num += 3 * a + b;

            return [board[num], two];
        };

        if (flip)
            icon = <div className='flip'>
                <FaWalking {...this.icon} />
            </div>;
        else
            icon = React.createElement(
                icon, this.icon);

        let [ballGrid, ball] = check();
        let type = ballGrid[ball];
        let change = true;

        if (type % 3 === 0) {
            let [spaceGrid, space] = check(2);
            let after = spaceGrid[space];

            type /= 3;

            if (Math.abs(after) === 1) {
                if (type > 7) {
                    if (type % 3) {
                        spaceGrid[space] *= 15;
                        ballGrid[ball] /= 5;
                    } else {
                        spaceGrid[space] *= 9;
                        ballGrid[ball] /= 3;
                    }

                    change = false;
                } else {
                    spaceGrid[space] *= 3 * type;
                    ballGrid[ball] = 1;
                }

                if (after < 0) {
                    spaceGrid[space] *= -1;

                    if (spaceGrid[space] !== 21)
                        spaceGrid[space] += 6;
                }
            } else if (after % 3 === 0) {
                after /= 3;

                if (after > type
                    && after % type
                    && after % 3) {
                    ballGrid[ball] = 1;
                    spaceGrid[space] *= type;

                    if (after === 35)
                        spaceGrid[space] = 5;
                } else {
                    change = false;
                }
            } else if (after % 7 === 0) {
                change = false;
            }
        } else if (type === 5
                || type % 7 === 0) {
            change = false;
        }

        if (change) {
            if (pos === shift(pos, false)) {
                const arr = [...Array(3)]
                    .map(_ => this.setup());

                if (a === -1) {
                    board.splice(6, 3);
                    board.splice(0, 0, ...arr);
                } else if (a === 1) {
                    board.splice(0, 3);
                    board.push(...arr);
                } else if (b === -1) {
                    for (let k in arr) {
                        board.splice(3 * (2 - k) + 2, 1);
                        board.splice(3 * (2 - k),
                            0, arr[k]);
                    }
                } else {
                    for (let k in arr) {
                        board.splice(3 * (2 - k), 1);
                        board.splice(3 * (2 - k) + 2,
                            0, arr[k]);
                    }
                }
            }

            grid[pos] /= 2;
            this.pos = ball;
            board[4][ball] *= 2;
        }

        this.setState({ icon });
    }

    /* 1: Grass
     * -1: Snow
     * 2: Player
     * 3 * 3: Snowball
     * 3 * 5: Medium Snowball
     * 3 * 7: Large Snowball
     * 3 * 3 * 5: Small + Medium
     * 3 * 3 * 7: Small + Large
     * 3 * 5 * 7: Medium + Large
     * 5: Full Snowman
     * 7: Obstacle
     */
    setup(ind) {
        const s = this.square;
        const board = [...Array(s)];
        let num;

        for (let k in board) {
            const n = this.random(2);
            board[k] = n ? 1 : -1;
        }

        if (ind === 4) {
            const n =
                this.random(this.square);

            board[n] *= 2;
            this.pos = n;
        }

        for (let k = 0; k < 2; k++) {
            num = this.random(s);

            if (Math.abs(board[num]) === 1)
                board[num] = 9;
            else
                k--;
        }

        while (Math.abs(board[num]) !== 1)
            num = this.random(s);

        board[num] *= 7;
        return board;
    }

    convert(val, num, css) {
        const { board } = this.state;
        const grid = board[4];

        const s = this.size;
        let size = this.font(4 * s);
        let icon;

        if (val % 2 === 0) {
            icon = this.state.icon;
        } else if (val % 3 === 0) {
            size = n => `calc(${n / 4} * ${css})`;
            const adj = (s, t, b) =>
                <FaCircle size={size(s)} />;

            icon = [];

            if (val % 9 === 0)
                icon.push(adj(0.7));
            if (val % 5 === 0)
                icon.push(adj(1));
            if (val % 7 === 0)
                icon.push(adj(1.3));
        } else if (val === 5) {
            icon = <FaSnowman size={size} />;
        } else if (val % 7 === 0) {
            icon = <FaTree size={size} />;
        } else {
            icon = '\xa0\xa0';
        }

        const rad = 'var(--radius)';
        const quo = Math.floor(num / s);
        const mod = num % s;

        let style = {
            borderTopLeftRadius: rad,
            borderTopRightRadius: rad,
            borderBottomLeftRadius: rad,
            borderBottomRightRadius: rad,
            height: css,
            width: css,
            cursor: 'default',
            color: val > 2 && val !== 7
                ? 'white' : 'black'
        };

        const edge = (f) => {
            if (f(grid[num])) {
                if (quo > 0 && f(grid[num - s])) {
                    style = {
                        ...style,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    };
                }

                if (quo < s - 1 && f(grid[num + s])) {
                    style = {
                        ...style,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    };
                }

                if (mod > 0 && f(grid[num - 1])) {
                    style = {
                        ...style,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    };
                }

                if (mod < s - 1 && f(grid[num + 1])) {
                    style = {
                        ...style,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    };
                }
            }
        };

        edge(n => n > 0);
        edge(n => n < 0);

        return <td className='cell select'
                bgcolor={val > 0
                    ? 'green' : 'white'}
                style={style}>
            {icon}
        </td>;
    }

    getTable() {
        const size = this.size;
        const { board } = this.state;
        const grid = board[4];

        const cellSize = this.font(size);
        const under = this.font(size / (size - 1));

        const cells = grid.map((v, n) =>
            this.convert(v, n, cellSize));
        const row = n => <tr>
            {cells.slice(size * n,
                size * (n + 1))}
        </tr>;

        return <>
            <table style={{
                    zIndex: 0,
                    position: 'absolute',
                    borderSpacing: 0,
                    width: under,
                    height: under
                }}>
                {[...Array(size - 1).keys()].map(i => <tr>{
                    [...Array(size - 1).keys()].map(j => {
                        const bool = n =>
                            grid[size * i + j + n] < 0;
                        let count = 0;

                        count += bool(0);
                        count += bool(1);
                        count += bool(size);
                        count += bool(size + 1);

                        return <td style={{
                            backgroundColor: count > 1
                                ? 'white' : 'green'
                        }}></td>;
                    })
                }</tr>)}
            </table>
            <table style={{
                    zIndex: 1,
                    backgroundClip: 'border-box',
                    borderSpacing: 0,
                    width: 'var(--board)',
                    height: 'var(--board)'
                }}>
                <tbody>
                    {[...Array(size).keys()]
                        .map(n => row(n))}
                </tbody>
            </table>
        </>;
    }

    render() {
        const { info, dir } = this.state;
        let content, buttons;

        if (info)
            content = <div>
                <ul style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: this.font(1.1),
                        fontSize: this.font(25)
                    }}>
                    <code>
                        <li>Snowballs grow when
                            pushed through snow</li>
                        <li>Smaller snowballs can be
                            stacked on bigger snowballs</li>
                        <li>Stacking small, medium, and large
                            snowballs creates a snowman</li>
                    </code>
                </ul>
            </div>;
        else
            content = this.getTable();

        if (dir)
            buttons = arrows.bind(this)(c =>
                () => this.move({ key: c }));
        else
            buttons = <>
                {home(true)}
                {button(BsArrowsMove, 'Controls',
                    () => this.setState({ dir: true }),
                    true
                )}
                {button(BsQuestion, 'Help',
                    () => this.setState(
                        { info: !info }),
                    true)}
            </>;

        return <header className='app'>
            {content}
                <div style={{
                    zIndex: 2,
                    position: 'absolute',
                    bottom: '1vh'
                }}>
                {buttons}
            </div>
        </header>;
    }
}
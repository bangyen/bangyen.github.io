import { move } from './helper';
import React from 'react';
import {
    FaMale,
    FaWalking,
    FaSnowman,
    FaCircle,
    FaTree
} from 'react-icons/fa';

export default class Snowman extends React.Component {
    constructor(props: Props) {
        super(props);

        this.size = 5;
        this.square = this.size
            * this.size;
        this.move = this.move.bind(this);
        this.font = n =>
            `calc(var(--board) / ${4 * n})`;
        this.hist = [];

        this.random = n => {
            const val = Math.random() * n;
            return Math.floor(val);
        };

        this.state = {
            board: this.setup(),
            icon: <FaMale size={
                this.font(this.size)} />
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
        clearInterval(this.timerID);
        document.removeEventListener(
            'keydown',
            this.move,
            false);
    }

    move(e) {
        const { board } = this.state;
        const key = e.key.toLowerCase();
        let back = false;
        let icon;
        let vel;

        if (key === 'w') {
            icon = <FaMale />;
            vel = [-1, 0];
        } else if (key === 's') {
            icon = <FaMale />;
            vel = [1, 0];
        } else if (key === 'a') {
            icon = <div className='flip'>
                <FaWalking />
            </div>;
            vel = [0, -1];
        } else if (key === 'd') {
            icon = <FaWalking />;
            vel = [0, 1];
        } else if (key === 'z'
            && this.hist.length) {
            const arr = this.hist.pop();
            this.pos = arr.pop();
            back = true;

            this.setState({
                board: arr
            });
        } else {
            return;
        }

        const obj = n => {
            return {
                pos: n,
                old: this.size,
                wrap: false,
                vel
            };
        };

        if (!back)
            this.hist.push(
                [...board, this.pos]);

        const ball = move(obj(this.pos));
        let change = true;
        let type = board[ball];

        if (type % 3 === 0) {
            const space = move(obj(ball));
            let after = board[space];
            type /= 3;

            if (Math.abs(after) === 1) {
                if (type > 7) {
                    if (type % 3 === 0) {
                        board[space] *= 9;
                        board[ball] /= 3;
                    } else if (type % 5 === 0) {
                        board[space] *= 15;
                        board[ball] /= 5;
                    }

                    change = false;
                    this.hist.push(
                        this.hist.length - 1);
                } else {
                    board[space] *= 3 * type;
                    board[ball] = 1;
                }

                if (after < 0) {
                    board[space] *= -1;

                    if (board[space] !== 21)
                        board[space] += 6;
                }
            } else if (after % 3 === 0) {
                after /= 3;

                if (after > type
                        && after % type
                        && after % 3) {
                    board[ball] = 1;
                    board[space] *= type;

                    if (after === 35)
                        board[space] = 5;
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
            board[this.pos] /= 2;
            this.pos = ball;
            board[ball] *= 2;
        } else {
            this.hist.pop();
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
    setup() {
        const s = this.square;
        const board = [...Array(s)];
        const sizes = [3, 5, 7];
        let num;

        for (let k in board) {
            const n = this.random(3);
            board[k] = n ? 1 : -1;
        }

        this.pos = this.random(s);
        board[this.pos] *= 2;

        for (let k = 0; k < 3; k++) {
            num = this.random(s);

            if (Math.abs(board[num]) === 1)
                board[num] = 3 * sizes[k];
            else
                k--;
        }

        while (Math.abs(board[num]) !== 1)
            num = this.random(s);

        board[num] *= 7;
        return board;
    }

    convert(val, ind, css) {
        const { board } = this.state;
        const s = this.size;
        const size = this.font(s);
        let icon;

        if (val % 2 === 0) {
            icon = this.state.icon;
        } else if (val % 3 === 0) {
            const size = (s, b) => <div style={{
                marginBottom: `calc(
                    ${-b / 4} * ${css})`
            }}>
                <FaCircle size={`calc(
                    ${s / 4} * ${css})`} />
            </div>;

            const bot = val > 21
                ? 0.6 : 0;
            icon = [];
            val /= 3;

            if (val % 3 === 0)
                icon.push(size(0.7, bot));
            if (val % 5 === 0)
                icon.push(size(1, bot * (7 / 6)));
            if (val % 7 === 0)
                icon.push(size(1.3, 0));
        } else if (val === 5) {
            icon = <FaSnowman size={size}/>;
        } else if (val % 7 === 0) {
            icon = <FaTree size={size}/>;
        } else {
            icon = '';
        }

        const rad = 'var(--radius)';
        const quo = Math.floor(ind / s);
        const mod = ind % s;

        let style = {
            borderTopLeftRadius: rad,
            borderTopRightRadius: rad,
            borderBottomLeftRadius: rad,
            borderBottomRightRadius: rad,
            height: `calc(${css})`,
            width: `calc(${css})`,
            cursor: 'default',
            color: val > 2
                ? 'white' : 'black'
        };

        const edge = (f) => {
            if (f(board[ind])) {
                if (quo > 0 && f(board[ind - s])) {
                    style = {
                        ...style,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    };
                }

                if (quo < s - 1 && f(board[ind + s])) {
                    style = {
                        ...style,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    };
                }

                if (mod > 0 && f(board[ind - 1])) {
                    style = {
                        ...style,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    };
                }

                if (mod < s - 1 && f(board[ind + 1])) {
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

    getTable(css) {
        const { board } = this.state;
        const size = this.size;
        const cellSize = `${css} / ${size}`;
        const under = `calc(${css}
            / ${size} * ${size - 1})`;

        const cells = this.state.board
            .map((v, n) => this.convert(v, n, cellSize));
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
                            board[size * i + j + n] < 0;
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
                    width: css,
                    height: css
                }}>
                <tbody>
                    {[...Array(size).keys()]
                        .map(n => row(n))}
                </tbody>
            </table>
        </>;
    }

    render() {
        const len = 'var(--board)';

        return <header className='app'>
            {this.getTable(len)}
        </header>;
    }
}
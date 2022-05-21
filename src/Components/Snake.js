import {Link} from 'react-router-dom';
import React from 'react';

function createArr() {
    let x = window.innerHeight;
    let y = window.innerWidth;

    x = Math.floor(x / 50);
    y = Math.floor(y / 50);
    const arr = [...Array(x)]
        .map(_ => Array(y).fill(0));

    const a = Math.floor(Math.random() * x);
    const b = Math.floor(Math.random() * y);
    arr[a][b] = -1;

    return arr;
}

export default class Snake extends React.Component {
    constructor(props: Props) {
        super(props);

        this.updateDim =
            this.updateDim
                .bind(this);
        this.changeDir =
            this.changeDir
                .bind(this);

        const arr = createArr();
        this.state = {
            row: arr.length,
            col: arr[0].length,
            len: 3,
            pos: [0, 0],
            vel: [0, 1],
            move: true,
            buff: null,
            arr
        }
    }

    randomPos() {
        const arr = [...this.state.arr];
        const row = this.state.row;
        const col = this.state.col;
        let x, y;

        do {
            x = Math.floor(Math.random() * row);
            y = Math.floor(Math.random() * col);
        } while (arr[x][y]);

        arr[x][y] = -1;
        this.setState({arr});
    }

    updateDim() {
        const arr = createArr();

        this.setState({
            row: arr.length,
            col: arr[0].length,
            arr});
    }

    changeDir(e) {
        const s = e.key.toLowerCase();
        const old = this.state.vel;
        let vel;

        if (s === 'arrowleft' || s === 'a')
            vel = [0, -1];
        else if (s === 'arrowright' || s === 'd')
            vel = [0, 1];
        else if (s === 'arrowup' || s === 'w')
            vel = [-1, 0];
        else if (s === 'arrowdown' || s === 's')
            vel = [1, 0];
        else
            return;

        if (old[0] + vel[0] &&
                old[0] !== vel[0])
            if (this.state.move)
                this.setState({
                    move: false,
                    vel});
            else
                this.setState({
                    buff: vel});
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.move(), 100);
        document.title = 'Snake | Bangyen';
        document.addEventListener(
            'keydown',
            this.changeDir,
            false);
        this.updateDim();
        window.addEventListener(
            'resize', this.updateDim);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        document.removeEventListener(
            'keydown',
            this.changeDir,
            false);
        window.removeEventListener(
            'resize', this.updateDim);
    }

    move() {
        let [x, y] = this.state.pos;
        const [a, b] = this.state.vel;
        const {row, col} = this.state;
        let arr = this.state.arr
            .map(a => a.map(
                n => n > 0 ? n - 1 : n
            ));

        x = (x + a + row) % row;
        y = (y + b + col) % col;

        if (arr[x][y] > 0) {
            const num = arr[x][y];
            this.setState({len: this.state.len - num});
            arr = arr.map(a => a.map(
                n => n > num ? n - num : -(n < 0)));
        } else if (arr[x][y] < 0) {
            this.setState({len: this.state.len + 1});
            this.randomPos();
            arr = this.state.arr.map(a => a.map(
                n => n > 0 ? n + 1 : -(n < 0)));
        }

        arr[x][y] = this.state.len;
        const buff = this.state.buff;
        if (buff)
            this.setState({
                buff: null,
                vel: buff});

        this.setState({
            move: !buff,
            pos: [x, y],
            arr
        });
    }

    render() {
        return (
            <header className='App-header'>
                <table style={{height: '85vh', width: '95vw'}}
                        className='grid'>
                    <tbody>
                        {this.state.arr.map((a, row) =>
                            (<tr key={row.toString()}>{
                                a.map((val, col) =>
                                <td key={`${row}-${col}`}
                                    className='cell select'
                                    bgcolor={val > 0 ? 'white' :
                                        val < 0 ? 'red' : 'black'}
                                        style={{cursor: 'default'}}>
                                    <div>&nbsp;</div>
                                </td>)
                            }</tr>)
                        )}
                    </tbody>
                </table>
                <Link to='/' style={{marginBottom: '20px'}}>
                    <button className='custom'
                            type='button'>
                        🏠&#xfe0e;
                    </button>
                </Link>
            </header>
        );
    }
}
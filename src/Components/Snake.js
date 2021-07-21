import React from 'react';
import {Link} from 'react-router-dom';

function createArr() {
    let x = window.innerHeight;
    let y = window.innerWidth;

    x = Math.round(x / 50);
    y = Math.round(y / 50);
    let arr = [...Array(x)]
        .map(_ => Array(y).fill(0));

    let a = Math.floor(Math.random() * x);
    let b = Math.floor(Math.random() * y);
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

        let arr = createArr();
        this.state = {
            row: arr.length,
            col: arr[0].length,
            len: 3,
            pos: [0, 0],
            vel: [0, 1],
            arr: arr,
            move: true,
            buff: null
        }
    }

    randomPos() {
        let arr = [...this.state.arr];
        let row = this.state.row;
        let col = this.state.col;
        let x, y;

        do {
            x = Math.floor(Math.random() * row);
            y = Math.floor(Math.random() * col);
        } while (arr[x][y]);

        arr[x][y] = -1;
        this.setState({arr: arr});
    }

    updateDim() {
        let arr = createArr();

        this.setState({
            row: arr.length,
            col: arr[0].length,
            arr: arr});
    }

    changeDir(e) {
        let s = e.key.toLowerCase();
        let old = this.state.vel;
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
                    vel: vel,
                    move: false});
            else
                this.setState({
                    buff: vel});
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.move(), 100);
        document.title = 'Snake';
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
        let [a, b] = this.state.vel;
        let {row, col} = this.state;
        let arr = this.state.arr
            .map(a => a.map(
                n => n > 0 ? n - 1 : n
            ));

        x = (x + a + row) % row;
        y = (y + b + col) % col;

        if (arr[x][y] > 0) {
            let num = arr[x][y];
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
        let buff = this.state.buff;
        if (buff)
            this.setState({
                buff: null,
                vel: buff});

        this.setState({
            move: !buff,
            pos: [x, y],
            arr: arr
        });
    }

    render() {
        return (
            <header className='App-header'>
                <table style={{height: '85vh', width: '95vw'}}>
                    <tbody>
                        {this.state.arr.map((a, row) =>
                            (<tr key={row.toString()}>{
                                a.map((val, col) =>
                                <td key={`${row}-${col}`}
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
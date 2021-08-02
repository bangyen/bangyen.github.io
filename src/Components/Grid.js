import {emptyArray, pairEquals, includes} from '../helpers';
import Buttons from './Buttons';
import React from 'react';
import run from '../Interpreters/back';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        let size = 5;
        this.changeText =
            this.changeText
                .bind(this);

        this.state = {
            grid: emptyArray(size),
            size,
            tape: [],
            cell: 0,
            select: null,
            pointer: null,
            breaks: []
        };
    }

    runCode(mode) {
        return function() {
            if (this.state.grid.every(
                    e => !e.includes('*'))) {
                alert('No halt instruction detected!');
                this.setState({select: null});
                return;
            }

            if (this.state.pointer === null) {
                this.func = run(this.state.grid);
                if (mode !== 'run') {
                    this.setState({
                        pointer: [0, 0],
                        select: null,
                        tape: [0],
                        cell: 0
                    });
                    return;
                }
            }

            let temp;
            this.setState({select: null});

            if (mode === 'run')
                do {
                    temp = this.func();
                } while (!(includes(
                    this.state.breaks,
                    temp.pos) || temp.end));
            else if (mode === 'fore')
                temp = this.func();
            else if (mode === 'back')
                temp = this.func(true);

            let {pos, end, tape, cell} = temp;

            this.setState({
                pointer: end ? null : pos,
                tape: tape,
                cell: cell
            });
        }.bind(this);
    }

    changeText(e) {
        let {select, breaks} = this.state;

        if (select !== null) {
            let arr = this.state.grid;
            let [row, col] = select;
            let value;

            if (e.key.toLowerCase() === 'b') {
                if (includes(breaks, select))
                    breaks = breaks.filter(p =>
                        !pairEquals(p, select));
                else
                    breaks.push(select);

                this.setState({breaks: breaks});
                return;
            } else if (e.key.length === 1) {
                value = e.key;
            } else if (e.key === 'Backspace'
                    || e.key === 'Delete') {
                value = ' ';
            } else if (e.key.includes('Arrow')) {
                if (e.key.includes('Left'))
                    col -= 1;
                else if (e.key.includes('Right'))
                    col += 1;
                else if (e.key.includes('Up'))
                    row -= 1;
                else
                    row += 1;

                let size = this.state.size;
                row = (row + size) % size;
                col = (col + size) % size;
                this.setState({
                    select: [row, col]});

                return;
            } else {
                return;
            }

            arr[row][col] = value;
            this.setState({grid: arr});
        }
    }

    changeColor(pos) {
        return function() {
            let select = this.state.select;
            select = pairEquals(select, pos)
                ? null : pos;
            this.setState({select: select});
        };
    }

    chooseColor(pos) {
        let {select, pointer, breaks}
            = this.state;

        if (pairEquals(select, pos))
            return 'grey';
        else if (pairEquals(pointer, pos))
            return 'red';
        else if (includes(breaks, pos))
            return 'yellow';

        return 'white';
    }

    componentDidMount() {
        document.title = 'Interpreter';
        document.addEventListener(
            'keydown',
            this.changeText,
            false);
    }

    componentWillUnmount() {
        document.removeEventListener(
            'keydown',
            this.changeText,
            false);
    }

    tile(val, row, col) {
        let pos = [row, col];

        return <td
                key={`${row}-${col}`}
                onClick={this.changeColor(pos).bind(this)}
                bgcolor={this.chooseColor(pos)}>
            <div>&nbsp;{val}&nbsp;</div>
        </td>;
    }

    render() {
        return (
            <header className='App-header'>
                <div className='split left'>
                    <div className='centered'>
                        <table>
                            <tbody>
                                {this.state.grid.map((arr, row) =>
                                    (<tr key={row.toString()}>{
                                        arr.map((val, col) =>
                                        this.tile(val, row, col))
                                    }</tr>)
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='split right'>
                    <div className='centered'>
                        <code>Instructions:</code>
                        <ul style={{fontSize: '75%', textAlign: 'left'}}>
                            <li>Click to select/unselect</li>
                            <li>Type to change selected cell</li>
                            <li>
                                Commands located&nbsp;
                                <a href='https://esolangs.org/wiki/Back'>here</a>
                            </li>
                        </ul>
                        <Buttons
                            run={(m) => this.runCode(m)}
                            set={(s) => this.setState(s)}
                            arr={this.state.grid}
                        />
                        <br />
                        <code>Output:</code>
                        <br />
                        <div className='output'>
                            <code>&nbsp;</code>
                            {this.state.tape.map((val, ind) => {
                                let color = this.state.cell === ind
                                    ? 'red' : 'white';
                                return <code
                                        key={ind.toString()}
                                        style={{color: color}}>
                                    {val}&nbsp;
                                </code>;})}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
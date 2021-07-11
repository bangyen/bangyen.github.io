import {emptyArray, pairEquals} from './helpers';
import Buttons from './Buttons';
import React from 'react';
import run from './back';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.changeText =
            this.changeText
                .bind(this);
        let size = 5;

        this.state = {
            output: {tape: []},
            grid: emptyArray(size),
            size,
            curr: {
                select: null,
                pointer: null,
                breaks: []
            }
        };
    }

    runCode(mode) {
        return function() {
            let curr = this.state.curr;
            curr.select = null;

            if (this.state.grid.every(e => !e.includes('*'))) {
                alert('No halt instruction detected!');
                this.setState({curr: curr});
                return;
            }

            if (curr.pointer === null) {
                this.func = run(this.state.grid);
                if (mode !== 'run') {
                    curr.pointer = [0, 0];
                    this.setState({
                        curr: curr,
                        output: {
                            tape: [0],
                            cell: 0
                        }
                    });
                    return;
                }
            }

            let temp;
            this.setState({curr: curr});

            if (mode === 'run')
                do {
                    temp = this.func();
                } while (!temp.end);
            else if (mode === 'fore')
                temp = this.func();
            else if (mode === 'back')
                temp = this.func(true);

            let {pos, end, tape, cell} = temp;
            curr.pointer = end ? null : pos;

            this.setState({
                curr: curr,
                output: {
                    tape: tape,
                    cell: cell
                }
            });
        }.bind(this);
    }

    changeText(e) {
        let obj = this.state.curr;

        if (obj.select !== null) {
            let arr = this.state.grid;
            let [row, col] = obj.select;
            let value;

            if (e.key.length === 1) {
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
                obj.select = [row, col];
                this.setState({curr: obj});

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
            let curr = this.state.curr;
            curr.select =
                pairEquals(
                        curr.select,
                        pos)
                    ? null : pos;
            this.setState({curr: curr});
        };
    }

    chooseColor(pos) {
        let curr = this.state.curr;

        if (pairEquals(
                curr.select,
                pos))
            return 'grey';
        else if (pairEquals(
                curr.pointer,
                pos))
            return 'red';

        return 'white';
    }

    componentDidMount() {
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
                                    (<tr>{
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
                            {this.state.output.tape.map((val, ind) => {
                                let color = this.state.output.cell === ind
                                    ? 'red' : 'white';
                                return <code style={{color: color}}>
                                    {val}&nbsp;
                                </code>;})}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
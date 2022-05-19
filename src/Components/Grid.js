import {button, find, emptyArray} from './helper';
import {Link} from 'react-router-dom';
import React from 'react';

export default class Grid extends React.Component {
    constructor(props: Props) {
        super(props);

        this.changeColor = this.changeColor.bind(this);
        this.changeText  = this.changeText.bind(this);
        let size = 5;

        this.state = {
            ...this.props.start,
            grid: emptyArray(size),
            select: null,
            pos:    null,
            breaks: []
        };
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

    runCode(mode) {
        return function() {
            if (this.state.pos === null) {
                this.func = this.props.run(
                    this.state.grid);

                if (mode !== 'run') {
                    this.setState({
                        ...this.props.start,
                        select: null,
                    });
                    return;
                }
            }

            this.setState({select: null});
            let temp;

            if (mode === 'run')
                do {
                    temp = this.func();
                } while (!(this.state
                               .breaks
                               .includes(temp.pos)
                    || temp.end));
            else if (mode === 'next')
                temp = this.func();
            else if (mode === 'prev')
                temp = this.func(true);

            this.setState(temp);
        }.bind(this);
    }

    changeText(e) {
        let {select, breaks} = this.state;

        if (select !== null) {
            let arr  = this.state.grid;
            let size = arr.length;
            let value;

            if (e.key.toLowerCase() === 'b') {
                if (breaks.includes(select))
                    breaks = breaks.filter(p =>
                        p !== select);
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
                let area = Math.pow(size, 2);

                if (e.key.includes('Left')
                        && select % size)
                    select -= 1;
                else if (e.key.includes('Right')
                        && (select + 1) % size)
                    select += 1;
                else if (e.key.includes('Up')
                        && select > (size - 1))
                    select -= size;
                else if (e.key.includes('Down')
                        && select < (area - size))
                    select += size;

                this.setState({select: select});
                return;
            } else {
                return;
            }

            find(arr, select)[select % size] = value;
            this.setState({grid: arr});
        }
    }

    changeColor(pos) {
        return function() {
            let select = this.state.select;
            select = select === pos
                ? null : pos;
            this.setState({select: select});
        }.bind(this);
    }

    chooseColor(cell) {
        let {select, pos, breaks}
            = this.state;

        if (cell === select)
            return 'grey';
        else if (cell === pos)
            return 'red';
        else if (breaks.includes(cell))
            return 'yellow';

        return 'white';
    }

    getTable() {
        let grid = this.state.grid;
        let table = emptyArray(grid.length);
        let pos;

        for (let i in table) {
            for (let j in table) {
                pos = grid.length * Number(i) + Number(j);
                table[i][j] = <td key={`${i}-${j}`}
                            onClick={this.changeColor(pos)}
                            bgcolor={this.chooseColor(pos)}>
                        <div>
                            &nbsp;{grid[i][j]}&nbsp;
                        </div>
                    </td>;
            }
        }

        table = table.map((arr, row) =>
                <tr key={row.toString()}>
                    {arr}
                </tr>
            );

        return <div className='split left'>
                <div className='centered'>
                    <table>
                        <tbody>
                            {table}
                        </tbody>
                    </table>
                </div>
            </div>;
    }

    getInfo() {
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        return <ul style={{
                    fontSize: '75%',
                    textAlign: 'left'}}>
                <li>Click to select/unselect</li>
                <li>Type to change selected cell</li>
                <li>Press (b) to use breakpoints</li>
                <li>
                    {name} commands located&nbsp;
                    <a href={link}>here</a>
                </li>
            </ul>;
    }

    getButtons() {
        let arr = this.state.grid;
        let obj = this.props.start;

        let change = function (num) {
            return function() {
                if (!num)
                    return;

                let diff = emptyArray(num);

                for (let i in diff)
                    for (let j in diff[0])
                        if (arr[i])
                            diff[i][j] = arr[i][j];
                        else
                            diff[i][j] = ' ';

                this.setState({grid: diff});
            }.bind(this);
        }.bind(this);

        return (<div>
                {button('▶', this.runCode('run'))}
                {button('\xa0❮\xa0', this.runCode('prev'))}
                {button('\xa0❯\xa0', this.runCode('next'))}
                {button('✖', () => this.setState({
                    ...obj, pos: null
                }))}
                <br />
                {button('➕\ufe0e', change(arr.length + 1))}
                {button('➖\ufe0e', change(arr.length - 1))}
                {button('📥\ufe0e', () => {
                    navigator.clipboard.writeText(
                        arr.map(x => x.join('')).join('\n')
                )})}
                <Link to='/'>
                    <button className='custom'
                            type='button'>
                        🏠&#xfe0e;
                    </button>
                </Link>
            </div>);
    }

    getTape() {
        if (!this.props.tape)
            return (null);

        let tape = this.state.tape;
        let text = tape.map((val, ind) => {
            let color = this.state.cell === ind
                ? 'red' : 'white';
            return <code key={ind.toString()}
                         style={{color: color}}>
                    &nbsp;{val}
                </code>;});

        return <div className='output'>
                <code>
                    Tape:{text}
                </code>
            </div>;
    }

    getOutput() {
        if (this.props.out)
            return <div className='output'>
                    <code>
                        Output:
                        {this.state.out === ''
                            ? '' : ' '}
                        {this.state.out}
                    </code>
                </div>;

        return (null);
    }

    getRegister() {
        if (this.props.reg)
            return <div className='output'>
                    <code>
                        Register: {this.state.acc}
                    </code>
                </div>;

        return (null);
    }

    render() {
        return (
            <header className='App-header'>
                {this.getTable()}
                <div className='split right'>
                    <div className='centered'>
                        <code>Instructions:</code>
                        {this.getInfo()}
                        {this.getButtons()}
                        <br />
                        {this.getTape()}
                        {this.getOutput()}
                        {this.getRegister()}
                    </div>
                </div>
            </header>
        );
    }
}
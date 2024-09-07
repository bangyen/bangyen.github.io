import {
    getDim, move
} from '../oldHelpers';
import React from 'react';

import Editor, {GridArea} from './Editor';

export default class GridEditor extends React.Component {
    constructor(props) {
        super(props);

        this.changeColor = this.changeColor.bind(this);
        this.changeText = this.changeText.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.chooseColor = this.chooseColor.bind(this);
        this.stack = () => {
            const stack = getDim();
            this.setState({stack});
        };

        const size = 5;

        this.state = {
            ...this.props.start,
            grid: ' '.repeat(size * size),
            size,
            select: null,
            pos:    null,
            breaks: [],
            text: false,
            edit: false,
            stack: getDim()
        };
    }

    componentDidMount() {
        document.title = this.props.name
            + ' Interpreter | Bangyen';
        document.addEventListener(
            'keydown',
            this.changeText);
        window.addEventListener(
            'resize', this.stack);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        document.removeEventListener(
            'keydown',
            this.changeText);
        window.removeEventListener(
            'resize', this.stack);
    }

    runCode(mode) {
        return function() {
            if (this.state.edit) {
                this.clean();
                return;
            } else if (this.state.text) {
                this.setState({text: false});
                return;
            }

            if (this.state.pos === null) {
                const {grid, size} = this.state;
                const {run, start} = this.props;
                this.func = run(grid, size);

                this.setState({
                    ...start,
                    select: null,
                });

                if (mode !== 'run')
                    return;
            }

            clearInterval(this.timerID);
            let temp;

            if (mode === 'run') {
                const move = () => {
                    this.setState(this.func());
                    const {pos, end, breaks}
                        = this.state;

                    if (breaks.includes(pos) || end)
                        clearInterval(this.timerID);
                };

                this.timerID = setInterval(move, 200);
            } else if (mode === 'next') {
                temp = this.func();
            } else {
                temp = this.func(true);
            }

            this.setState(temp);
        }.bind(this);
    }

    changeText(e) {
        let {select, breaks, text} = this.state;

        if (select !== null && !text) {
            let { grid: str, size } = this.state;
            let value;

            if (e.key.toLowerCase() === 'b') {
                if (breaks.includes(select))
                    breaks = breaks.filter(p =>
                        p !== select);
                else
                    breaks.push(select);

                this.setState({breaks});
                return;
            } else if (e.key.length === 1) {
                value = e.key;
            } else if (e.key === 'Backspace'
                    || e.key === 'Delete') {
                value = ' ';
            } else if (e.key.includes('Arrow')) {
                let vel;

                if (e.key.includes('Left'))
                    vel = [0, -1];
                else if (e.key.includes('Right'))
                    vel = [0, 1];
                else if (e.key.includes('Up'))
                    vel = [-1, 0];
                else if (e.key.includes('Down'))
                    vel = [1, 0];

                select = move({
                    pos: select,
                    old: size,
                    vel
                });

                this.setState({select});
                return;
            } else {
                return;
            }

            str = str.substring(0, select)
                + value
                + str.substring(select + 1);
            this.setState({grid: str});
        }
    }

    changeColor(pos) {
        return function() {
            let select = this.state.select;
            select = select === pos
                ? null : pos;
            this.setState({select});
        }.bind(this);
    }

    chooseColor(cell) {
        const {select, pos, breaks}
            = this.state;

        if (cell === select)
            return 'primary';
        else if (cell === pos)
            return 'info';
        else if (breaks.includes(cell))
            return 'warning';

        return 'secondary';
    }

    clean() {
        const {grid, size} = this.state;
        let val = grid
            .split('\n')
            .map(v => v.trimEnd())
            .filter(v => v !== '');

        if (!val.length)
            val = Array(size)
                .fill(' '.repeat(size));

        const max = Math.max(val.length,
            ...val.map(v => v.length));

        while (val.length < max)
            val.push('');

        val = val.map(v => {
            const len = v.length;

            if (len < max)
                v += ' '.repeat(max - len);
            else
                v = v.substring(0, max);

            return v;
        });

        this.setState({
            ...this.props.start,
            grid: val.join(''),
            size: max,
            pos: null,
            select: null,
            text: false,
            edit: false
        });
    }

    getTable(css) {
        const {grid, size, edit} = this.state;

        if (this.state.text) {
            let value = '';

            if (edit) {
                value = grid;
            } else {
                if (grid !== ' '.repeat(size * size)) {
                    const empty = ' '.repeat(size);
                    const split = [...Array(size).keys()]
                        .map(v => grid.substring(
                            size * v, size * (v + 1)))
                        .filter(v => v !== empty);
                    const len = split.length;

                    for (let i = 0; i < len; i++) {
                        value += split[i].trimEnd();

                        if (i + 1 !== len)
                            value += '\n';
                    }
                }
            }

            const row = value.split('\n')
                             .length;
            const changeGrid = (e) =>
                this.setState({
                    grid: e.target.value,
                    edit: true
                });

            return <form>
                <label>
                    <textarea
                        value={value}
                        placeholder='Input program here...'
                        onChange={changeGrid}
                        onPaste={changeGrid}
                        rows={row}
                        style={{
                            width: css,
                            minHeight: `calc(${css} / 3)`
                        }}
                    />
                </label>
            </form>;
        }

        css = `max(${css}, ${size} * min(10vh, 10vw))`;
        const cellSize = `calc(${css}/${size}`;

        let table = [...Array(size)]
            .map(x => Array(size));
        let pos;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                pos = size * i + j;
                table[i][j] = <td key={`${i}-${j}`}
                        className='cell select pointer'
                        onClick={this.changeColor(pos)}
                        bgcolor={this.chooseColor(pos)}
                        style={{
                            borderRadius:
                                `calc(${cellSize} / 10)`,
                            maxHeight: cellSize,
                            maxWidth: cellSize
                        }}>
                    <div>
                        &nbsp;{grid[pos]}&nbsp;
                    </div>
                </td>;
            }
        }

        return <table style={{
                    borderSpacing:
                        `calc(${cellSize} / 30)`,
                    fontSize:
                        `calc(${cellSize} / 4)`,
                    margin: 'auto',
                    width: css,
                    height: css
                }}>
            <tbody>
                {table.map((arr, row) =>
                    <tr key={'row' + row}>
                        {arr}
                    </tr>
                )}
            </tbody>
        </table>;
    }

    getInfo(css) {
        let {name, link} = this.props;
        link = 'https://esolangs.org/wiki/'
            + (link ? link : name);

        return <ul style={{
                    fontSize: '75%',
                    width: `calc(${css} / 1.25)`,
                    margin: 'auto',
                    padding: '3vh',
                    textAlign: 'left'
                }}>
                <code>
                    <li>Click to select/unselect</li>
                    <li>Type to change selected cell</li>
                    <li>Press <b>b</b> to use breakpoints</li>
                    <li>Hover over buttons for usage</li>
                    <li>
                        Commands located&nbsp;
                        <a href={link}>here</a>
                    </li>
                </code>
            </ul>;
    }

    changeSize(num) {
        let {
            grid, size,
            select, text
        } = this.state;

        return function() {
            if (!num || text)
                return;

            clearInterval(this.timerID);
            let arr = '';

            if (select !== null)
                select = move({
                    pos: select,
                    vel: [0, 0],
                    old: size,
                    size: num,
                    wrap: false
                });

            for (let i = 0; i < num; i++)
                for (let j = 0; j < num; j++)
                    if (i < size && j < size)
                        arr += grid[size * i + j];
                    else
                        arr += ' ';

            this.setState({
                ...this.props.start,
                grid: arr,
                size: num,
                pos: null,
                select
            });
        }.bind(this);
    }

    render() {
        return (
            <Editor
                state={this.state}
                props={this.props}
                getButtons={this.getButtons}
                handleChange={() => {}}>
                <GridArea
                    value={this.state.grid}
                    size={this.state.size}
                    handleChange={this.changeColor}
                    chooseColor={this.chooseColor} />
            </Editor>
        );
    }
}
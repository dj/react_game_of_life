/** @jsx React.DOM */

var Game = React.createClass({
    getInitialState: function() {
        var initCells = [],

            board_width  = document.body.clientWidth,
            board_height = document.getElementById('board').clientHeight

            initCellSize = Math.floor(board_width * 0.02) + 1,
            initColumns     = Math.floor(board_width / initCellSize) + 1,
            initRows        = Math.floor(board_height / initCellSize) + 1


        for (var i = 1; i <= (initColumns * initRows); i++) {
            var alive = (1 === Math.floor(Math.random() * 20));
            initCells.push({alive: alive});
        }

        return {
            time: 0,
            cellSize: initCellSize,
            columns: initColumns,
            rows: initRows,
            cellsProps: initCells
        }
    },
    tick: function() {
        this.setState({time: this.state.time + 1});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    render: function() {
        var time = this.state.time,
            cellsProps = this.state.cellsProps
        return (
            <div className="game">
                {
                    cellsProps.map(function(result) {
                        var alive = result['alive']
                        return <Cell is_alive={alive} time={time} />
                    })
                }
            </div>
        );
    }
});

React.renderComponent(
    <Game />,
    document.getElementById('board')
);


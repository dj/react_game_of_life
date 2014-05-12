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
            var alive = (1 === Math.floor(Math.random() * 10));
            initCells.push(<Cell is_alive={alive}/>);
        }

        return {
            time: 0,
            cellSize: initCellSize,
            columns: initColumns,
            rows: initRows,
            cells: initCells
        }
    },
    tick: function() {
        this.setState({time: this.state.time + 1});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    render: function() {
        return (
            <div className="game">
                {
                    this.state.cells.map(function(result){
                        return result;
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


/** @jsx React.DOM */

function Point(x, y) {
    this.x = x;
    this.y = y;
}

var Game = React.createClass({
    getInitialState: function() {
        var initGrid = [],

            board_width  = document.body.clientWidth,
            board_height = document.getElementById('board').clientHeight

            initCellSize = Math.floor(board_width * 0.02) + 1,
            initColumns  = Math.floor(board_width / initCellSize) + 1,
            initRows     = Math.floor(board_height / initCellSize) + 1

        // Create Rows and Columns
        for (var row = 0; row < initRows; row++) {
            for (var col = 0; col < initColumns; col++) {
                initGrid.push({
                    point: new Point(col, row),
                    alive: (1 == Math.floor((Math.random() * 100)))
                });
            }
        }

        return {
            time: 0,
            cellSize: initCellSize,
            columns: initColumns,
            rows: initRows,
            grid: initGrid
        }
    },

    // tick: function() {
    //     this.setState({time: this.state.time + 1});
    // },
    // componentDidMount: function() {
    //     this.interval = setInterval(this.tick, 1000);
    // },
    render: function() {
        var grid = this.state.grid,
            size = this.state.cellSize

        return (
            <div>
                {
                    grid.map(function(cell) {
                        return <Cell point={cell['point']} size={size} alive={cell['alive']}/>;
                    })
                }
            </div>
        )
    }
});

React.renderComponent(
    <Game />,
    document.getElementById('board')
);


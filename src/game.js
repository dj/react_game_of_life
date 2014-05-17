/** @jsx React.DOM */

function Point(x, y) {
    this.x = x;
    this.y = y;
}

var Game = React.createClass({
    getGridVals: function () {
        var boardWidth  = document.getElementById('board').clientWidth,
            boardHeight = document.getElementById('board').clientHeight;

            if (boardWidth > boardHeight) {
                var cellSize = Math.floor(boardWidth * 0.02) + 1
            } else {
                var cellSize = Math.floor(boardHeight * 0.02) + 1;
            }

        var cols     = Math.floor(boardWidth / cellSize) + 1,
            rows     = Math.floor(boardHeight / cellSize) + 1;

        return {
            cellSize: cellSize,
            rows: rows,
            cols: cols,
            aliveCells: []
        }
    },
    getInitialState: function () {
        var initGrid   = [],
            gridState  = this.getGridVals(),
            alivePoints = [];

        // Initialize empty arrays
        for (var col = 0; col < gridState.cols; col++) {
            initGrid[col] = []
        }

        var is_alive = function() { return (1 == Math.floor((Math.random() * 10))) };

        // Create columns and rows
        for (var col = 0; col < gridState.cols; col++) {
            initGrid[col] = [];
            var colCells = initGrid[col];
            for (var row = 0; row < gridState.rows; row++) {
                var alive = is_alive(),
                    point = new Point(col, row);

                if (alive) {
                    alivePoints.push(point);
                }
                colCells.push({
                    neighbors: 0,
                    point: point,
                    alive: alive
                });
            }
        }

        return {
            cellSize: gridState.cellSize,
            columns: gridState.rows,
            rows: gridState.cols,
            grid: initGrid,
            alivePoints: alivePoints
        }
    },
    countNeighbours: function (row) {

    },
    tick: function () {
        var nextGrid = this.state.grid.map(countNeighbours);

        // Kill Cells
        var nextGrid = nextGrid.map()

        // for (var col = 0; col < initCols; col++) {
        //     nextGrid[col] = [];
        //     for (var row = 0; row < initRows; row++) {
        //         var cell = this.state.grid[col][row];

        //         var leftCol  = currentGrid[(cell.point.x - 1)],
        //             thisCol  = currentGrid[cell.point.x],
        //             rightCol = currentGrid[(cell.point.x + 1)];

        //         if (!leftCol) {
        //             var neighbors = [
        //                 thisCol[cell.point.y - 1],
        //                 thisCol[cell.point.y + 1],

        //                 rightCol[cell.point.y - 1],
        //                 rightCol[cell.point.y],
        //                 rightCol[cell.point.y + 1]
        //             ];
        //         } else if (!rightCol) {
        //             var neighbors = [
        //                 leftCol[cell.point.y - 1],
        //                 leftCol[cell.point.y],
        //                 leftCol[cell.point.y + 1],

        //                 thisCol[cell.point.y - 1],
        //                 thisCol[cell.point.y + 1]
        //             ];
        //         } else {
        //             var neighbors = [
        //                 leftCol[cell.point.y - 1],
        //                 leftCol[cell.point.y],
        //                 leftCol[cell.point.y + 1],

        //                 thisCol[cell.point.y - 1],
        //                 thisCol[cell.point.y + 1],

        //                 rightCol[cell.point.y - 1],
        //                 rightCol[cell.point.y],
        //                 rightCol[cell.point.y + 1]
        //             ];
        //         }

        //         var aliveNeighbors = neighbors.filter(function(neighbor) {
        //             return ((neighbor !== undefined) && neighbor.alive)
        //         });

        //         if (cell.alive) {
        //             // Die by underpopulation
        //             // Die by overcrowding
        //             if ((aliveNeighbors.length < 2) || (aliveNeighbors.length > 3)) {
        //                 cell.alive = false;
        //             }
        //         } else if (aliveNeighbors.length == 3) {
        //             // Revive cells via reproduction
        //             cell.alive = true;
        //         }

        //         var finalCell = nextGrid[cell.point.x][cell.point.y];
        //         nextGrid.push(finalCell);
        //     }
        // }

        // this.setState({grid: nextGrid});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    render: function() {
        var size = this.state.cellSize,
            cells        = this.state.grid,
            flattenCells = [].concat.apply([], cells);

        return (
            <div>
                {flattenCells.map(function(result) {
                    return <Cell point={result.point} size={size} alive={result.alive}/>;
                })}
            </div>
        )
    }
});

React.renderComponent(
    <Game />,
    document.getElementById('board')
);


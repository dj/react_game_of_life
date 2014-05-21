/** @jsx React.DOM */

function Point(x, y) {
    this.x = x;
    this.y = y;

    this.neighbors = function() {
        // Just return all possible neighbours for now
        // TODO: handle edge cases (literally)
        // This will return the wrong point if you give
        // supply a negative x or y
        return [
            // Top Row
            new Point((x - 1), (y - 1)),
            new Point(x, (y - 1)),
            new Point((x + 1), (y - 1)),
            // Current Row
            new Point((x - 1), y),
            new Point((x + 1), y),
            // Bottom Row
            new Point((x - 1), (y + 1)),
            new Point(x, (y + 1)),
            new Point((x + 1), (y + 1))
        ]
    }
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
        }
    },
    getInitialState: function () {
        var initGrid   = [],
            gridState  = this.getGridVals(),
            cellColors = [
                'blue',
                'green',
                'yellow',
                'red',
                'orange'
            ];

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
                colCells.push({
                    neighbors: 0,
                    point: point,
                    alive: alive,
                    color: cellColors[Math.floor(Math.random() * cellColors.length)]
                });
            }
        }

        return {
            cellSize: gridState.cellSize,
            columns: gridState.rows,
            rows: gridState.cols,
            grid: initGrid,
        }
    },
    updateCells: function (row) {
        var alivePoints = this.state.alivePoints,
            grid        = this.state.grid;

        // Returns the row of cells
        // with updated neighbor count
        var updatedRow = row.map(function(cell) {
            var neighborPoints = cell.point.neighbors(),
                aliveNeighbors = 0,
                cellIsAlive    = cell.alive;

            // For each neighbor, check if it exists
            // and count the number that are alive
            neighborPoints.map(function(neighbor) {
                if ((grid[neighbor.x]) && (grid[neighbor.x][neighbor.y])) {
                    if (grid[neighbor.x][neighbor.y].alive) aliveNeighbors++;
                }
            });

            if (cellIsAlive &&
                (aliveNeighbors < 2) || (aliveNeighbors > 3)) {
                // Die by underpopulation
                // Die by overcrowding
                cellIsAlive = false;
            } else if (aliveNeighbors == 3) {
                // Revive
                cellIsAlive = true;
            }

            var newCell = React.addons.update(cell, {
                neighbors: {$set: aliveNeighbors},
                alive:     {$set: cellIsAlive}
            });
            return newCell;
        });

        return updatedRow;
    },
    tick: function () {
        var nextGrid = this.state.grid.map(this.updateCells);

        this.setState({grid: nextGrid});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 100);
    },
    render: function() {
        var size         = this.state.cellSize,
            cells        = this.state.grid,
            flattenCells = [].concat.apply([], cells);

        return (
            <div>
                {flattenCells.map(function(result) {
                    return <Cell point={result.point} size={size} alive={result.alive} color={result.color}/>;
                })}
            </div>
        )
    }
});

React.renderComponent(
    <Game />,
    document.getElementById('board')
);


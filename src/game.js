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
    countAliveNeighbors: function (row) {
        var alivePoints = this.state.alivePoints;

        // Returns the row of cells
        // with updated neighbor count
        var updatedRow = row.map(function(cell) {
            var neighborPoints = cell.point.neighbors();

            var aliveNeighbors = neighborPoints.filter(function(neighbor) {
                var result = alivePoints.filter(function(alive){
                    return (alive.x == neighbor.x) && (alive.y == neighbor.y);
                });
                // Return true if the neighbor is in the list
                return (result.length == 1);
            });

            cell.neighbors = aliveNeighbors.length;
            return cell
        });

        return updatedRow;
    },
    killAndRevive: function(row) {
        var updatedRow = row.map(function(cell) {
            if (cell.alive) {
                // Die by underpopulation
                // Die by overcrowding
                if ((cell.neighbors < 2) || (cell.neighbors > 3)) {
                    cell.alive = false;
                    return cell;
                } else {
                    return cell;
                }
            } else if (cell.neighbors == 3) {
                // Revive
                cell.alive = true;
                return cell;
            } else {
                return cell;
            }
        });
        return updatedRow;
    },
    getAlivePoints: function(nextGrid) {
        var result = []

        nextGrid.map(function(row) {
            var results = row.map(function(cell) {
                if (cell.alive) return result.push(cell.point);
            });
            return results;
        });

        return result;
    },
    tick: function () {
        var nextGrid = this.state.grid.map(this.countAliveNeighbors);

        // Kill and Revive Cells
        nextGrid = nextGrid.map(this.killAndRevive)
        // Update Alive Points
        var nextAlivePoints = this.getAlivePoints(nextGrid);

        this.setState({grid: nextGrid});
        this.setState({alivePoints: nextAlivePoints});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 3000);
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


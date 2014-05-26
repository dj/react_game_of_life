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
        var boardWidth      = document.getElementById('container').clientWidth,
            clientHeight    = document.getElementById('container').clientHeight,
            boardHeight     = (clientHeight - 100);

        if (boardWidth > boardHeight) {
            var cellSize = Math.floor(boardWidth * 0.03);
        } else {
            var cellSize = Math.floor(boardHeight * 0.10);
        }

        var cols = Math.floor(boardWidth / cellSize),
            rows = Math.floor(boardHeight / cellSize);

        return {
            cellSize: cellSize,
            rows: rows,
            cols: cols
        }
    },
    getColorVals: function(numColors) {
        // http://krazydad.com/tutorials/makecolors.php
        var frequency = .3,
            colors    = [];

        for (var i = 0; i < numColors; i++) {
            red   = Math.floor(Math.sin(frequency*i + 0) * 127 + 128);
            green = Math.floor(Math.sin(frequency*i + 2) * 127 + 128);
            blue  = Math.floor(Math.sin(frequency*i + 4) * 127 + 128);
            rgbString = 'rgb(' + red + ',' + green + ',' + blue + ')'
            colors.push(rgbString)
        }
        return colors

    },
    getInitialState: function () {
        var time       = 0,
            initGrid   = [],
            gridState  = this.getGridVals(),
            numCells   = (gridState.cols * gridState.rows),
            cellColors = this.getColorVals(numCells),
            colorIdx   = 0;

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
                    point = new Point(col, row),
                    color = cellColors[colorIdx];
                // Assign a color if alive
                colCells.push({
                    neighbors: 0,
                    point: point,
                    alive: alive,
                    color: color
                });
                colorIdx++;
            }
        }

        return {
            cellSize: gridState.cellSize,
            columns: gridState.rows,
            rows: gridState.cols,
            grid: initGrid,
            time: time,
            gameState: 'PAUSE',
            colors: cellColors
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
                alive:     {$set: cellIsAlive}
            });
            return newCell;
        });

        return updatedRow;
    },
    tick: function () {
        var nextGrid = this.state.grid.map(this.updateCells),
            nextTime = this.state.time + 1;

        if (this.state.gameState === 'PLAY') {
            this.setState({grid: nextGrid, time: nextTime});
        }
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 100);
    },
    restart: function() {
        var newGame = this.getInitialState();
        this.setState(newGame);
    },
    __onClick: function(e) {
        var x = Math.floor(e.clientX / this.state.cellSize),
            y = Math.floor(e.clientY / this.state.cellSize),
            nextGrid = this.state.grid;

        nextGrid[x][y].alive = true;

        this.setState({grid: nextGrid})
    },
    togglePlay: function () {
        if (this.state.gameState == 'PLAY') {
            this.setState({gameState: 'PAUSE'});
        } else {
            this.setState({gameState: 'PLAY'});
        }
    },
    playButtonText: function () {
        if (this.state.gameState == 'PLAY') {
            return 'PAUSE (space)'
        } else {
            return 'PLAY (space)'
        }
    },
    handleKeyPress: function(e) {
        console.log(e.which);
        // Space toggles play
        if (e.which == '32') {
            e.preventDefault();
            this.togglePlay();
        } else if (e.which == '82') {
            this.restart();
        }
    },
    render: function() {
        var time         = this.state.time,
            size         = this.state.cellSize,
            cells        = this.state.grid,
            flattenCells = [].concat.apply([], cells);

        return (
            <div onKeyDown={this.handleKeyPress}>
                <div id='board' onClick={this.__onClick} onKeyDown={this.handleKeyPress} onKeyDown={this.handleKeyDown} onTouchMove={this.__restart}>
                    {flattenCells.map(function(result) {
                        return <Cell key={result.id} point={result.point} size={size} alive={result.alive} color={result.color}/>;
                    })}
                </div>
                <div id='controls'>
                    <button className='btn' onClick={this.togglePlay}>
                        {this.playButtonText()}
                    </button>
                    <button className='btn' onClick={this.restart}>
                        Restart (r)
                    </button>
                </div>
            </div>
        )
    }
});

React.initializeTouchEvents(true)
React.renderComponent(
    <Game />,
    document.getElementById('container')
);


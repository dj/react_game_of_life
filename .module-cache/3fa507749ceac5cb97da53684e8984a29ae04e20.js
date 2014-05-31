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

var Game = React.createClass({displayName: 'Game',
    getGridVals: function () {
        var clientWidth     = document.getElementById('container').clientWidth,
            clientHeight    = document.getElementById('container').clientHeight;

        if (clientWidth > (clientHeight * 1.2)) {
            var boardHeight = (clientHeight * 0.9),
                cellSize = Math.floor(clientWidth * 0.025);
        } else {
            var boardHeight = (clientHeight * 0.8),
                cellSize = Math.floor(clientWidth * 0.1);
        }

        var cols = Math.floor(clientWidth / cellSize),
            rows = Math.floor(boardHeight / cellSize);

        return {
            clientHeight: clientHeight,
            clientWidth: clientWidth,
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
        var time        = 0,
            initGrid    = [],
            gridState   = this.getGridVals(),
            numCells    = (gridState.cols * gridState.rows),
            cellColors  = this.getColorVals(numCells),
            colorIdx    = 0,
            boardWidth  = (gridState.cols * gridState.cellSize),
            boardHeight = (gridState.rows * gridState.cellSize),
            boardMarginTop = (((gridState.boardHeight - boardHeight)) / 2),
            boardMarginLeft = ((gridState.clientWidth  - boardWidth) / 2),
            buttonHeight    = gridState.clientHeight - boardHeight

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
                    untouched = !alive,
                    point = new Point(col, row),
                    color = cellColors[colorIdx];
                // Assign a color if alive
                colCells.push({
                    neighbors: 0,
                    point: point,
                    alive: alive,
                    color: color,
                    untouched: untouched
                });
                colorIdx++;
            }
        }

        return {
            cellSize: gridState.cellSize,
            columns: gridState.rows,
            rows: gridState.cols,
            boardWidth: boardWidth,
            boardHeight: boardHeight,
            boardMarginLeft: boardMarginLeft,
            boardMarginTop: boardMarginTop,
            buttonHeight: buttonHeight,
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
                cellIsAlive    = cell.alive,
                untouched      = cell.untouched

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
                untouched   = false;
            }

            var newCell = React.addons.update(cell, {
                alive:     {$set: cellIsAlive},
                untouched: {$set: untouched}
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
    componentDidMount: function () {
        this.interval = setInterval(this.tick, 150);
        window.addEventListener('keypress', this.handleKeyPress);
    },
    restart: function () {
        var newGame = this.getInitialState();
        this.setState(newGame);
    },
    revive: function(e) {
        var x = Math.floor((e.clientX - this.state.boardMarginLeft)/ this.state.cellSize),
            y = Math.floor((e.clientY - this.state.boardMarginTop)/ this.state.cellSize),
            nextGrid = this.state.grid;

            console.log(x + ", " + y)

        nextGrid[x][y].alive = true;
        nextGrid[x][y].untouched = false;

        this.setState({grid: nextGrid});
    },
    step: function () {
        var nextGrid = this.state.grid.map(this.updateCells),
            nextTime = this.state.time + 1;

        this.setState({grid: nextGrid, time: nextTime})
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
        e.stopPropagation();
        if (e.which == '32') { // Space
            e.preventDefault();
            this.togglePlay();
        } else if (e.which == '114') { // r
            this.restart();
        } else if (e.which == '115') {
            this.step();
        }
    },
    handleKeyUp: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    render: function() {
        var time         = this.state.time,
            size         = this.state.cellSize,
            cells        = this.state.grid,
            flattenCells = [].concat.apply([], cells),
            boardStyle   = {
                width: this.state.boardWidth,
                height: this.state.boardHeight,
                marginTop: this.state.boardMarginTop,
            },
            controlsStyle = {
                height: this.state.buttonHeight
            },
            revive = this.revive;

        var cellNodes = flattenCells.map(function(result) {
            return Cell( {key:result.id,
                         onClick:revive,
                         point:result.point,
                         size:size,
                         alive:result.alive,
                         untouched:result.untouched,
                         color:result.color} );
        })

        return (
            React.DOM.div( {id:"game-container"}, 
                React.DOM.div( {id:"board", style:boardStyle}, 
                    cellNodes
                ),
                React.DOM.div( {id:"controls", style:controlsStyle}, 
                    React.DOM.button( {className:"btn", onClick:this.togglePlay, onKeyUp:this.handleKeyUp}, 
                        this.playButtonText()
                    ),
                    React.DOM.button( {className:"btn", onClick:this.restart, onKeyUp:this.handleKeyUp, focusEnabled:false}, 
                        "Restart (r)"
                    ),
                    React.DOM.button( {className:"btn", onClick:this.step, onKeyUp:this.handleKeyUp, focusEnabled:false}, 
                        "Step (s)"
                    )
                )
            )
        )
    }
});

React.initializeTouchEvents(true)
React.renderComponent(
    Game(null ),
    document.getElementById('container')
);


/** @jsx React.DOM */

var Game = React.createClass({
    getInitialState: function() {
        return {
            columnWidth: Math.floor(document.body.clientWidth * 0.02),
            columns: Math.floor(document.body.clientWidth / Math.floor(document.body.clientWidth * 0.02)),
            rows: Math.floor(document.getElementById('board').clientHeight / Math.floor(document.body.clientWidth * 0.02))
        }
    },
    render: function() {
        var cells = [];

            for (var i = 1; i <= (this.state.columns * this.state.rows); i++) {
                cells.push(<Cell />)
            }


        return (
            <div className="game">
                {
                    cells.map(function(result){
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


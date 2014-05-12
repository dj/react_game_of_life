/** @jsx React.DOM */

var Game = React.createClass({
    getInitialState: function() {
        return {
            cellColors: [
                'blue'
                , 'green'
                , 'yellow'
                , 'red'
                , 'orange'
            ]
        }
    },
    render: function() {
        var idx = (Math.floor((Math.random()) * 100) % 4),
            color = this.state.cellColors[idx];

        return (
            <div className="game">
                <Cell cellColor={color}/>
            </div>
        );
    }
});

React.renderComponent(
    <Game />,
    document.getElementById('game')
);

/** @jsx React.DOM */

var Cell = React.createClass({
    getInitialState: function() {
        var cellColors = [
                'blue'
                , 'green'
                , 'yellow'
                , 'red'
                , 'orange'
        ]
        return {
            color: cellColors[Math.floor(Math.random() * 5)]
        }
    },
    render: function() {
        var classString = "cell ",

        classString = classString + this.state.color

        return (
            <div className={ classString }>
            </div>
        );
    }
});

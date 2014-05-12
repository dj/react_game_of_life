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
        var classString = "cell ";

        if (this.props.is_alive === true) {
            classString = classString + this.state.color
        } else {
            classString = classString + 'dead'
        }

        return (
            <div className={ classString }>
            </div>
        );
    }
});

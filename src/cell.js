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
        var cx = React.addons.classSet;
        var style = {
                width: this.props.size,
                height: this.props.size,
                left: (this.props.size * this.props.point.x),
                top: (this.props.size * this.props.point.y)
            },
            classes = cx({
                'cell': true,
                'blue': true,
                'dead': !(this.props.alive)
            });

        classes += " " + this.state.color

        return (
            <div className={classes} style={style}></div>
        )
    }
});

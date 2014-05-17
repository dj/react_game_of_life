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
        var cx = React.addons.classSet,
            style = {
                width: this.props.size,
                height: this.props.size,
                left: (this.props.size * this.props.point.x),
                top: (this.props.size * this.props.point.y)
            },
            classes = cx({
                'cell': true,
                'dead': (!this.props.alive)
            });
            x = this.props.point.x,
            y = this.props.point.y;

        classes += " " + this.state.color

        return (
            <div className={classes} style={style}>
                <span> {x} </span>
                <span> {y} </span>
            </div>
        )
    }
});

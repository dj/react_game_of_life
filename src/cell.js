/** @jsx React.DOM */

var Cell = React.createClass({
    render: function() {
        var cx = React.addons.classSet,
            style = {
                width: this.props.size,
                height: this.props.size,
                left: (this.props.size * this.props.point.x),
                top: (this.props.size * this.props.point.y)
            },
            dead = (!this.props.alive),
            x = this.props.point.x,
            y = this.props.point.y;

        classes = cx({
            'cell': true,
            'dead': dead
        });

        classes += " " + this.props.color;

        return (
            <div className={classes} style={style}>
            </div>
        )
    }
});

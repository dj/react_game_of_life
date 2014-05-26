/** @jsx React.DOM */

var Cell = React.createClass({
    render: function() {
        var cx = React.addons.classSet,
            style = {
                width: this.props.size,
                height: this.props.size,
                left: (this.props.size * this.props.point.x),
                top: (this.props.size * this.props.point.y),
                backgroundColor: this.props.color
            },
            dead = (!this.props.alive && !this.props.untouched),
            x = this.props.point.x,
            y = this.props.point.y;

        classes = cx({
            'cell': true,
            'untouched': this.props.untouched,
            'dead': dead
        });

        return (
            <div className={classes} style={style}>
            </div>
        )
    }
});

/** @jsx React.DOM */

var Cell = React.createClass({
    render: function() {
        var cx = React.addons.classSet,
            cellColors = [
                'blue'
                , 'green'
                , 'yellow'
                , 'red'
                , 'orange'
            ],
            style = {
                width: this.props.size,
                height: this.props.size,
                left: (this.props.size * this.props.point.x),
                top: (this.props.size * this.props.point.y)
            },
            dead = (!this.props.alive),
            classes = cx({
                'cell': true,
                'dead': dead
            });
            colorString = (cellColors[Math.floor(Math.random() * 5)]),
            x = this.props.point.x,
            y = this.props.point.y;

        classes += " " + colorString;

        return (
            <div className={classes} style={style}>
            </div>
        )
    }
});

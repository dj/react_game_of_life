/** @jsx React.DOM */

var Cell = React.createClass({displayName: 'Cell',
    cellHandleClick: function (e) {
        this.props.reviveCell(e);
    },
    render: function() {
        var cx = React.addons.classSet,
            style = {
                width: this.props.size,
                height: this.props.size,
                left: (this.props.size * this.props.point.x),
                top: (this.props.size * this.props.point.y),
                backgroundColor: this.props.color,
                color: this.props.color
            },
            dead = (!this.props.alive && !this.props.untouched),
            x = this.props.point.x,
            y = this.props.point.y;

        classes = cx({
            'cell': true,
            'untouched': this.props.untouched,
            'alive': this.props.alive,
            'dead': dead
        });

        return (
            React.DOM.div( {onClick:this.cellHandleClick, className:classes, style:style}
            )
        )
    }
});

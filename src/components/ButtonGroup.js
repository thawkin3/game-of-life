import React, { Component } from 'react';
import './../stylesheets/ButtonGroup.css';

class ButtonGroup extends Component {
  render() {
    return (
        <div className="ButtonGroup">
            <button className="btn btn-primary" onClick={this.props.stopOrStart}>{ this.props.gameIsPlaying ? "Pause": "Play" }</button>
            <button className="btn btn-danger" onClick={this.props.clearBoard}>Clear</button>
        </div>
    );
  }
}

export default ButtonGroup;

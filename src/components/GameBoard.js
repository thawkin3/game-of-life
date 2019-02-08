import React, { Component } from 'react';
import GameCell from './GameCell';
import './../stylesheets/GameBoard.css';

class GameBoard extends Component {
  constructor(props) {
		super(props);

		this.createCells = this.createCells.bind(this);
	}
  
	createCells() {
    let cellsArray = [];
    for (let i = 0; i < this.props.cells.length; i++) {
      for (let j = 0; j < this.props.cells[i].length; j++) {
        cellsArray.push(<GameCell key={i + "_" + j}
          theId={"cell_" + i + "_" + j}
          isOn={Boolean(this.props.cells[i][j])} 
          modifyCell={this.props.modifyCell} />);
      }
    }
    return cellsArray;
	}

  render() {
    return (
        <div className="GameBoard">
          { this.createCells() }
        </div>
    );
  }
}

export default GameBoard;

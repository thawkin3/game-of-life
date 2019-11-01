import React, { Component } from 'react';
import Loading from './components/Loading';
import ButtonGroup from './components/ButtonGroup';
import GameBoard from './components/GameBoard';
import './stylesheets/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: [],
      boardWidth: 50,
      boardHeight: 30,
      gameIsPlaying: false,
      numberOfGenerationsPassed: 0,
      speed: 300
    }

    this.tick = this.tick.bind(this);
    this.clearMyInterval = this.clearMyInterval.bind(this);
    this.setMyInterval = this.setMyInterval.bind(this);
    this.stopOrStart = this.stopOrStart.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.modifyCell = this.modifyCell.bind(this);

  }

  componentDidMount() {
    // randomly generate the initial cells' state here
    let cells = [];
    for (let i = 0; i < this.state.boardHeight; i++) {
      cells[i] = [];
      for (let j = 0; j < this.state.boardWidth; j++) {
        cells[i].push(Math.round(Math.random()));
      }
    }

    // set up the timer
    this.setMyInterval();

    this.setState({
      cells: cells,
      gameIsPlaying: true
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gameIsPlaying && typeof this.timerID === "undefined") {
      this.setMyInterval();
    } else if (!this.state.gameIsPlaying && typeof this.timerID !== "undefined") {
      this.clearMyInterval();
    }
  }

  componentWillUnmount() {
    this.clearMyInterval();
  }

  clearMyInterval() {
    if (typeof this.timerID !== "undefined") {
      clearInterval(this.timerID);
      this.timerID = undefined;
    }
  }

  setMyInterval() {
    if (typeof this.timerID === "undefined") {
      this.timerID = setInterval(
        () => this.tick(),
        this.state.speed
      );
    }
  }

  // calculate the new on/off status for each cell
  tick() {
    let {cells} = this.state;
    let newCellData = [];
    
    for (let i = 0; i < cells.length; i++) {
      newCellData[i] = [];
      for (let j = 0; j < cells[i].length; j++) {
        
        // get your eight neighbors' info
        let aliveCount = 0;
        if (typeof cells[i-1] !== "undefined" && typeof cells[i-1][j] !== "undefined") {
          aliveCount += cells[i-1][j];
        }
        if (typeof cells[i-1] !== "undefined" && typeof cells[i-1][j+1] !== "undefined") {
          aliveCount += cells[i-1][j+1];
        }
        if (typeof cells[i] !== "undefined" && typeof cells[i][j+1] !== "undefined") {
          aliveCount += cells[i][j+1];
        }
        if (typeof cells[i+1] !== "undefined" && typeof cells[i+1][j+1] !== "undefined") {
          aliveCount += cells[i+1][j+1];
        }
        if (typeof cells[i+1] !== "undefined" && typeof cells[i+1][j] !== "undefined") {
          aliveCount += cells[i+1][j];
        }
        if (typeof cells[i+1] !== "undefined" && typeof cells[i+1][j-1] !== "undefined") {
          aliveCount += cells[i+1][j-1];
        }
        if (typeof cells[i] !== "undefined" && typeof cells[i][j-1] !== "undefined") {
          aliveCount += cells[i][j-1];
        }
        if (typeof cells[i-1] !== "undefined" && typeof cells[i-1][j-1] !== "undefined") {
          aliveCount += cells[i-1][j-1];
        }

        // set the new on/off status based on the current status and the neighbor data
        // RULES:
        // 1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
        // 2. Any live cell with two or three live neighbours lives on to the next generation.
        // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
        // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if ((cells[i][j] === 0 && aliveCount === 3) || (cells[i][j] === 1 && aliveCount > 1 && aliveCount < 4)) {
          newCellData[i].push(1);
        } else {
          newCellData[i].push(0);
        }
      }
    }

    this.setState(prevState => {
      return {
        cells: newCellData,
        gameIsPlaying: true,
        numberOfGenerationsPassed: prevState.numberOfGenerationsPassed + 1
      }
    });
  }

  stopOrStart() {
    let anyNonZeroes = false;
    for (let i = 0; i < this.state.cells.length; i++) {
      for (let j = 0; j < this.state.cells[i].length; j++) {
        if (this.state.cells[i][j] !== 0) {
          anyNonZeroes = true;
          break;
        }
      }
      if (anyNonZeroes) {
        break;
      }
    }

    this.setState(prevState => {
      return {
        gameIsPlaying: (prevState.gameIsPlaying || anyNonZeroes) ? !prevState.gameIsPlaying : prevState.gameIsPlaying
      }
    });
  }

  clearBoard() {
    this.clearMyInterval();
    let emptyCellData = [];
    for (let i = 0; i < this.state.boardHeight; i++) {
      emptyCellData[i] = [];
      for (let j = 0; j < this.state.boardWidth; j++) {
        emptyCellData[i].push(0);
      }
    }
    this.setState({
      cells: emptyCellData,
      gameIsPlaying: false,
      numberOfGenerationsPassed: 0
    });
  }

  modifyCell(cellId) {
    this.setState(prevState => {
      let row = Number(cellId.split("_")[1]);
      let col = Number(cellId.split("_")[2]);
      let newCellValue = this.state.cells[row][col] === 1 ? 0 : 1;
      let newCellData = prevState.cells.map(function(arr) {
        return arr.slice();
      });
      newCellData[row][col] = newCellValue;

      return {
        cells: newCellData
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <header className="App-header">
                <h1 className="App-title">Conway's Game of Life</h1>
                <p><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Learn the rules here</a></p>
              </header>
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              { this.state.cells.length > 0 ? (
                <div>
                  <ButtonGroup stopOrStart={this.stopOrStart}
                    clearBoard={this.clearBoard}
                    gameIsPlaying={this.state.gameIsPlaying} />
                  <div className="generations">Generations Passed: {this.state.numberOfGenerationsPassed}</div>
                  <GameBoard cells={this.state.cells} 
                    boardWidth={this.state.boardWidth} 
                    boardHeight={this.state.boardHeight}
                    gameIsPlaying={this.state.gameIsPlaying}
                    modifyCell={this.modifyCell} />
                </div>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <footer className="App-footer">
                <p>Created by Tyler Hawkins</p>
                <p>Check out the rest of my portfolio <a href="http://tylerhawkins.info">here</a></p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

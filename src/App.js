import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      player_one_symbol: "X",
      player_two_symbol: "O",
      current_turn: "X", // make function to set current turn
      game_board: [
        "", "", "", "", "", "", "", "", ""
      ],
      test: {
        'test1': 1
      }
    }
  }

  startingPlayer() {
    var textArray = ["X", "O"];
    var startingPlayer = Math.floor(Math.random()*textArray.length);
    return startingPlayer;
  }


  clickHandler(boxIndex) {
    let is_box_taken = this.state.game_board[boxIndex]
    if (is_box_taken === "") {
      let board = this.state.game_board
      board[boxIndex] = this.state.current_turn

      this.setState({
          game_board: board,
          current_turn: this.state.current_turn === "X" ? "O" : "X"   
      })
    }

    console.log(this.checkWinningCondition());
    this.apiCallTest()
    
    if (this.checkWinningCondition()) {
        alert("winner!")
    };
  }

  apiCallTest() {
    let board = this.state.game_board
    fetch("http://127.0.0.1:5000/result", {
      method: "POST",
      body: JSON.stringify(board),
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },  
    }).then(() => {console.log("returned")})
  }


  checkWinningCondition() {
    const possibleWinCombinations = [
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7", "8"],
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", "8"],
      ["0", "4", "8"],
      ["2", "4", "6"]
    ]

    possibleWinCombinations.forEach((list) => {
      if (
        this.state.current_turn === this.state.game_board[list[0]] &&
        this.state.current_turn === this.state.game_board[list[1]] &&
        this.state.current_turn === this.state.game_board[list[2]]
        ) {
          console.log("winner")
          return true
        }
    })
    return null
  }


  render() {
    let nextPlayer = "next Player:" + this.state.current_turn

    return (
      <div className="nextPlayer">{nextPlayer}
      <div className="board">
        {this.state.game_board.map((cell, boxIndex) => {
          return <div className="box" box-id={boxIndex} onClick={this.clickHandler.bind(this, boxIndex)}>
            {cell}
          </div>;
        })}
      </div>
      </div>
    );
  }
}

export default App;

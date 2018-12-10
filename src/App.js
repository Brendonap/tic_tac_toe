import React, { Component } from 'react';
import './App.css';
import { PLAYER_ONE, PLAYER_TWO, SERVER_ADDRESS_SAVE, SERVER_ADDRESS_LOAD} from './consts'


class App extends Component {

  constructor(props) {
    super(props)
    const firstToGo = this.startingPlayer()
    this.state = {
      playerOneSymbol: PLAYER_ONE,
      playerTwoSymbol: PLAYER_TWO,
      currentTurn: firstToGo,
      gameBoard: [
        ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
      ],
      isWin: false,
      whoWon: null
    }
  }

  // determine which player will start first
  startingPlayer() {
    const playersSymbolArray = [PLAYER_ONE, PLAYER_TWO];
    const startingPlayer = Math.floor(Math.random()*playersSymbolArray.length);
    return playersSymbolArray[startingPlayer];
  }

  gameMoveClickHandler(boxIndex) {
    const { gameBoard, currentTurn } = this.state

    // check if box is empty
    if (gameBoard[boxIndex] === ' ') {
      gameBoard[boxIndex] = currentTurn
            
      this.setState({          
          currentTurn: this.nextTurn(),
          gameBoard   
      })     
    }

    // check winning if winning combination after each turn 
    this.checkWinningCondition()
  }

  nextTurn() {
    return this.state.currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  }

  loadPreviousGmeState() {
    const params = {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
      },  
    }

    fetch(SERVER_ADDRESS_LOAD, params).then(response => {
      return response.json().then(body => {
          if (response.status === 200) {
            this.setState({
              gameBoard: body['gameBoard'],
              currentTurn: body['currentTurn']
            })
          } else {
            throw body;
          }
      })
    });
  }

  saveCurrentStateToServer() {   
    const { gameBoard, currentTurn } = this.state;
    const body = JSON.stringify({gameBoard, currentTurn: currentTurn});
    const params = {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },  
      body
    };
    fetch(SERVER_ADDRESS_SAVE, params);
  }

  /* We loop over the possible winning combinations and extract the given index from the current gameBoard state,
  winning combinations are a winning combination whose values are the same. */
  checkWinningCondition() {
    const { currentTurn, gameBoard } = this.state;
    const possibleWinCombinations = [
      ['0', '1', '2'],
      ['3', '4', '5'],
      ['6', '7', '8'],
      ['0', '3', '6'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['0', '4', '8'],
      ['2', '4', '6']
    ];

    possibleWinCombinations.forEach((list) => {
      if (
       currentTurn === gameBoard[list[0]] &&
       currentTurn === gameBoard[list[1]] &&
       currentTurn === gameBoard[list[2]]
        ) {
          this.setState({
            isWin: true,
            whoWon: currentTurn
          })
        };
    })
  }

  renderResetButton() {
    return (
      <button 
        type='button' 
        onClick={() => {document.location.reload(true)}}>
        Reset
      </button>
    )
  }

  renderSaveButton() {
    return (
      <button 
        type='button' 
        onClick={() => {this.saveCurrentStateToServer()}}>
        Save Game
      </button>
    )
  }
  
  renderLoadButton() {
    return (
      <button 
        type='button' 
        onClick={() => {this.loadPreviousGmeState()}}>
        Load Game
      </button>
    )
  }

  renderBoard() {
    const { isWin, whoWon } = this.state
    if (isWin) {
      return ( 
        <div>
          <h1>You won! {whoWon}</h1> 
        </div>
      )
    }
    return (
      <div className='board'>
        {this.state.gameBoard.map((cell, boxIndex) => {
          return <div
              className='box'
              box-id={boxIndex}
              key={boxIndex}
              onClick={() => {
                this.gameMoveClickHandler(boxIndex)
              }
            }>
            {cell}
          </div>;
        })}
      </div>
    )
  }

  render() {
    return (
      <div className='Container'>
        <div className='menu'>
          <h1>Tic-Tac-Toe</h1>
        </div>
        <div className='gameOptionButtons'>
          {this.renderResetButton()}
          {this.renderSaveButton()}
          {this.renderLoadButton()}      
        </div>
        <div className='nextPlayer'>
          <p>next Player: {this.state.currentTurn}</p>
          {this.renderBoard()}       
        </div>
      </div>
    )
  }
}

export default App;

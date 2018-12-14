import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client'
import { PLAYER_ONE, PLAYER_TWO, SERVER_ADDRESS} from './consts'


class App extends Component {

  constructor(props) {
    super(props)
    const firstToGo = this.startingPlayer()
    this.socket = socketIOClient(SERVER_ADDRESS)

    this.state = {
      playerOneSymbol: PLAYER_ONE,
      playerTwoSymbol: PLAYER_TWO,
      currentTurn: firstToGo,
      gameBoard: [
        ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
      ],
      isWin: false,
      whoWon: null,
      againstAI: true
    }
  }

  // determine which player will start first
  startingPlayer() {
    const playersSymbolArray = [PLAYER_ONE, PLAYER_TWO];
    const startingPlayer = Math.floor(Math.random()*playersSymbolArray.length);
    return playersSymbolArray[startingPlayer];
  }

  gameMoveClickHandler(boxIndex) {
    const { gameBoard, currentTurn, againstAI } = this.state

    // check if box is empty
    if (gameBoard[boxIndex] === ' ') {
      gameBoard[boxIndex] = currentTurn
            
      this.setState({gameBoard})

      // check winning if winning combination after each turn 
      this.checkWinningCondition()
      if (againstAI === true) {
        this.aiDecision()
      }

      this.setState({currentTurn: this.nextTurn()})
    }
  }

  // make computer move
  aiDecision() {
    this.socket.emit('ai-decision', this.state, (res) => {
      const data = JSON.parse(res)
      this.setState({
        gameBoard: data['data']['gameBoard'],
      })
      this.checkWinningCondition()
      this.setState({
        currentTurn: this.nextTurn()
      })
    })
  }

  nextTurn() {
    return this.state.currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  }

  loadPreviousGameState() {
    this.socket.emit('load')
    console.log("here")
    this.socket.on('load-response', (res) => {
      const data = JSON.parse(res)
      this.setState({
        gameBoard: data['gameBoard'],
        currentTurn: data['CurrentTurn']
      })
    })
  }

  saveCurrentStateToServer() {   
    this.socket.emit('save', this.state) 
  }

  checkWinningCondition() {
    this.socket.emit('winning-decision', this.state, (res) => {
      const data = JSON.parse(res)
      this.setState({
        isWin: data['isWin'],
        whoWon: this.nextTurn()
      })
    })
  }

  
  renderButtons() {
    return (
      <div>
        <button 
          type='button' 
          onClick={() => {document.location.reload(true)}}>
          Reset
        </button>
        <button 
          type='button' 
          onClick={() => {this.saveCurrentStateToServer()}}>
          Save Game
        </button>
        <button 
          type='button' 
          onClick={() => {this.loadPreviousGameState()}}>
          Load Game
        </button>
      </div>
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

  // get computer to make first move if determined to start first
  componentDidMount() {
    if (this.state.againstAI === true && this.state.currentTurn === 'O') {
      this.aiDecision()
    }
  }

  render() {
    return (
      <div className='Container'>
        <div className='menu'>
          <h1>Tic-Tac-Toe</h1>
        </div>
        <div className='gameOptionButtons'>
          {this.renderButtons()}
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

from app import app
from flask_socketio import SocketIO
from app.models import Tictactoe
from app import ai
import json
socketio = SocketIO(app)

@socketio.on('save')
def save_event(data, methods=['GET', 'POST']):
    Tictactoe.save_current_game(data)

@socketio.on('load')
def load_event():
    results = Tictactoe.get_previous_saved_game()
    socketio.emit('load-response', results)

@socketio.on('ai-decision')
def ai_decision_event(data, methods=['GET', 'POST']):
    index = ai.getComputerMove(data['gameBoard'])
    data['gameBoard'][index] = 'O'
    # socketio.emit('ai-decision-response', json.dumps({'data':data}))
    return json.dumps({'data':data})

@socketio.on('winning-decision')
def check_win_decision(data, methods=['GET', 'POST']):
    isWin = ai.checkWin(data['gameBoard'], data['currentTurn'])
    return json.dumps({'isWin': isWin})

if __name__ == '__main__':
    socketio.run(app)
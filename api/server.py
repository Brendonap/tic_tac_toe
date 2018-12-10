from flask import Flask, request, Response
import json
from flask_sqlalchemy import SQLAlchemy
# import models

app = Flask(__name__, template_folder="../public")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tictac.db'

db = SQLAlchemy(app)
class Tictactoe(db.Model):
    id = db.Column('id', db.Integer, primary_key = True)
    currentTurn = db.Column(db.String(10))
    block1 = db.Column(db.String(10))
    block2 = db.Column(db.String(10))  
    block3 = db.Column(db.String(10))  
    block4 = db.Column(db.String(10))  
    block5 = db.Column(db.String(10))  
    block6 = db.Column(db.String(10))  
    block7 = db.Column(db.String(10))  
    block8 = db.Column(db.String(10))  
    block9 = db.Column(db.String(10))  


@app.route('/save', methods = ['POST'])
def save_game_state():
    if request.method == 'POST':
        results = request.get_json(force=True)
        save_current_game(results)
        return "200"

@app.route('/load', methods = ['GET', 'OPTIONS'])
def load_game_state():
    data = get_previous_saved_game()
    response=Response(data, status=200, content_type='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods', '*')
    return response

def save_current_game(game_results):
    game_board = game_results['gameBoard']
    current_turn = game_results['currentTurn']
    state = Tictactoe(
        currentTurn = current_turn,
        block1=game_board[0],
        block2=game_board[1],
        block3=game_board[2],
        block4=game_board[3],
        block5=game_board[4],
        block6=game_board[5],
        block7=game_board[6],
        block8=game_board[7],
        block9=game_board[8],
        )
    db.session.add(state)
    db.session.commit()


def get_previous_saved_game():
    result = Tictactoe.query.order_by('id desc').first()
    return json.dumps({
        'currentTurn': result.currentTurn,
        'gameBoard': [
            result.block1,
            result.block2,
            result.block3,
            result.block4,
            result.block5,
            result.block6,
            result.block7,
            result.block8,
            result.block9,
        ]
    })


if __name__ == '__main__':
    app.run()



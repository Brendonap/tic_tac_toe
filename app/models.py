from app import db
import json

class Tictactoe(db.Model):

    __tablename__ = 'tictactoe'

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

    def __repr__(self):
        return '<{}>'.format(self.currentTurn)  

    @staticmethod
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

    @staticmethod
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
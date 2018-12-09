from flask import Flask, render_template, request
import json
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder="../public")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tictac.db'

db = SQLAlchemy(app)
class Tictactoe(db.Model):
    id = db.Column('student_id', db.Integer, primary_key = True)
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
        return "<Title: {}>".format(self.block1)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/result', methods = ['POST'])
def save_current_state():
    if request.method == 'POST':
        # req_data = request.get_json()
        result = request.get_json(force=True)
        # user = request.json['data']
        save(result)
        get()
        # print(result)
        return "Hello World"

def save(result):
    state = Tictactoe(block1=result[0])
    db.session.add(state)
    db.session.commit

def get():
    state = Tictactoe.query.all()
    print('here')
    print(state)


if __name__ == '__main__':
    app.run()



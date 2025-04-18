from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Game state
first_buzz = None
game_active = True

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('buzz')
def handle_buzz(team):
    global first_buzz, game_active
    if game_active and not first_buzz:
        first_buzz = team
        emit('buzz_result', {'team': team}, broadcast=True)
        game_active = False

@socketio.on('reset')
def handle_reset():
    global first_buzz, game_active
    first_buzz = None
    game_active = True
    emit('game_reset', broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)
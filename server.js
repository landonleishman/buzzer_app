const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Game state
let firstBuzz = null;
let gameActive = true;

// Serve the different pages
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/host.html');
});

app.get('/team-a', (req, res) => {
    res.sendFile(__dirname + '/public/buzzer.html');
});

app.get('/team-b', (req, res) => {
    res.sendFile(__dirname + '/public/buzzer.html');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle buzzer press
    socket.on('buzz', (team) => {
        if (gameActive && !firstBuzz) {
            firstBuzz = team;
            io.emit('buzzResult', { team: team });
            gameActive = false;
        }
    });

    // Handle reset from host
    socket.on('reset', () => {
        firstBuzz = null;
        gameActive = true;
        io.emit('gameReset');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
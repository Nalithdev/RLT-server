import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
        }
})
app.use(cors())
app.get('/', (req, res) => {
    res.json('ip address: http://' + ip.address()+':'+PORT);
});
let games = {};


class Morpion {
    constructor() {
        this.players = [];
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.turn = 0;
    }
}
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
    });
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });



    socket.on('join', (room) => {
        console.log('join room: ' + room);
        socket.join(room);
        io.to(room).emit('join', room);
        if (games[room] === undefined) {
            games[room] =  new Morpion(room);
            console.log('création de la room ' + room);
            console.log(games);

        }
        console.log(games)
        console.log(games[room]);
        console.log(games[room].board);
        io.to(room).emit('message', `message from ${room} room`);
    });
    socket.on('leave', (room) => {
        console.log('leave room: ' + room);
        socket.leave(room);
        io.to(room).emit('leave', room);
    });
    socket.on('JoinGame', (data) => {
        console.log('JoinGame');
        console.log(data);
        if (games[data['room']].players.length === 2) {
            io.to(data['room']).emit('full', 'room is full');
            console.log('room is full');
            return;
        }
        games[data['room']].players.push(data['player']);
        console.log(games[data['room']].players);
    }
    )
    socket.on('coord', (data) => {
        console.log('coord');
        console.log(data);
        console.log(games[data['room']].board);
        console.log(data['coord'][0]);
        console.log(games[data['room']].board[data['coord'][0][data['coord'][1]]]);
        console.log(games[data['room']].players[games[data['room']].turn]);
        console.log(data['player']);
        if (data['player'] === games[data['room']].players[games[data['room']].turn]) {
            games[data['room']].board[data['coord'][0]][data['coord'][1]] = data['player'];
            console.log(games[data['room']].board);
            if (games[data['room']].turn === 0) {
                games[data['room']].turn = 1;
            }
            else {
                games[data['room']].turn = 0;
            }
        }
        else {
            console.log('not your turn');
        }
        io.to(data['room']).emit('coord', data);
    });
})


server.listen(PORT, () => {
    console.log('Server ip : http://' +ip.address() +":" + PORT);
})


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
var colors =["blue" , "black"]


function checkVictoire(case_Input, room, PlayerName) {
    // Vérifier si le joueur a gagné
    console.log(games[room].board[case_Input[0]][case_Input[1]], "bonjour");
    console.log("case_Input", case_Input, "room", room, "PlayerName", PlayerName, "Board", games[room].board);

    // Vérifier la ligne
    if (games[room].board[case_Input[0]][0] !== null &&
        games[room].board[case_Input[0]][0] === games[room].board[case_Input[0]][1] &&
        games[room].board[case_Input[0]][1] === games[room].board[case_Input[0]][2]) {

        io.to(room).emit('message', "Le joueur " + PlayerName + " a gagné");
        console.log('Victoire ', PlayerName);
    }
    // Vérifier la colonne
    else if (games[room].board[0][case_Input[1]] !== null &&
        games[room].board[0][case_Input[1]] === games[room].board[1][case_Input[1]] &&
        games[room].board[1][case_Input[1]] === games[room].board[2][case_Input[1]]) {

        io.to(room).emit('message', "Le joueur " + PlayerName + " a gagné");
    }
    // Vérifier les diagonales
    else if ((case_Input[0] === 0 && case_Input[1] === 0) ||
        (case_Input[0] === 1 && case_Input[1] === 1) ||
        (case_Input[0] === 2 && case_Input[1] === 2)) {
        if (games[room].board[0][0] !== null &&
            games[room].board[0][0] === games[room].board[1][1] &&
            games[room].board[1][1] === games[room].board[2][2]) {
            io.to(room).emit('message', "Le joueur " + PlayerName + " a gagné");
        }
    }
    else if ((case_Input[0] === 0 && case_Input[1] === 2) ||
        (case_Input[0] === 1 && case_Input[1] === 1) ||
        (case_Input[0] === 2 && case_Input[1] === 0)) {
        if (games[room].board[0][2] !== null &&
            games[room].board[0][2] === games[room].board[1][1] &&
            games[room].board[1][1] === games[room].board[2][0]) {
            io.to(room).emit('message', "Le joueur " + PlayerName + " a gagné");
        }
    }
    // Passer au joueur suivant si pas de victoire
    else {
        if (PlayerName === 1) {
            console.log("Player 2");
            PlayerName = 2;
        } else {
            console.log("Player 1");
            PlayerName = 1;
        }
    }
}


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
    UpdateBoard(ligne , collone , player) {
        this.board[ligne][collone] = player;

    }
    GetBoard() {
        return this.board;
    }
}
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.on('disconnect', () => {
        // console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
    });
    
        socket.on('message', (msg) => {
            // console.log('message: ' + msg);
            io.emit('message', msg);
        });
        
    



    socket.on('join', (room) => {
        // console.log('join room: ' + room);
        socket.join(room);
        io.to(room).emit('join', room);
        if (games[room] === undefined) {
            games[room] =  new Morpion(room);
            // console.log('création de la room ' + room);
            // console.log(games);

        }
        // console.log(games)
        // console.log(games[room]);
        // console.log(games[room].board);
        io.to(room).emit('message', `message from ${room} room`);
    });
    socket.on('leave', (room) => {
        // console.log('leave room: ' + room);
        socket.leave(room);
        io.to(room).emit('leave', room);
    });
    socket.on('JoinGame', (data) => {
        // console.log('JoinGame');
        // console.log(data);
        if (games[data['room']].players.length === 2) {
            io.to(data['room']).emit('full', 'room is full');
            // console.log('room is full');
            return;
        }
        games[data['room']].players.push(data['player']);
        // console.log(games[data['room']].players);
    }
    )
    socket.on('coord', (data) => {
        // console.log('coord');
        // console.log(data);
        // console.log(games[data['room']].board);
        // console.log(data['coord'][0]);
        // console.log(games[data['room']].board[data['coord'][0][data['coord'][1]]]);
        // console.log(games[data['room']].players[games[data['room']].turn]);
        // console.log(data['player']);
        if (data['player'] === games[data['room']].players[games[data['room']].turn]) {
            if (games[data['room']].board[data['coord'][0]][data['coord'][1]] !== null) {
                
                io.to(data['room']).emit('message', "case déjà prise Choisisez-en une autre !");

                
            } else {
                games[data['room']].board[data['coord'][0]][data['coord'][1]] = data['player'];
                console.log("color send" + colors[0] + colors[games[data['room']].turn], games[data['room']].turn)
                io.to(data['room']).emit('ChangeColor', [data['coord'], colors[games[data['room']].turn]]);

                io.to(data['room']).emit('message', "Case " + data['coord'] + " choisie par le joueur " + data['player']);

                // console.log(games[data['room']].board);
                if (games[data['room']].turn === 0) {
                    games[data['room']].turn = 1;
                    
                }
                else {
                    games[data['room']].turn = 0;
                }
                console.log("DATA", data, "Games", games)
                // Check si la case est deja prit
    
                // while (games[data['room']].board[data['coord'][0]][data['coord'][1]] !== null ) {
                //     console.log("case déjà prise Choisisez-en une autre !", games[data['room']].board[data['coord'][0]][data['coord'][1]]);
                //     io.to(data['room']).emit('message', "case déjà prise Choisisez-en une autre !");
                //     return;
                // } 
                    
                checkVictoire(data['coord'], data['room'] ,data['player']);
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


// if (games[room][case_Input[0]][case_Input[1]] !== 0) {
   // console.log("case déjà prise Choisisez-en une autre !", games[room].board[case_Input[0]][case_Input[1]]);
//     // envoyer le mesage à la room
// } else {
//     games[room].board[case_Input[0]][case_Input[1]] = PlayerName
//     

// }
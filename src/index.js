const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { randomInt } = require('crypto');
const Game = require('./Game');

const app = express();
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
const io = socketio(server);

// class user{
//     constructor(name, room) {
//         this.name = name;
//         this.room = room;
//     }

    
// }
const users = [];
const rooms = {};
const games = [];

// 960, 468.5
// 1920 937
const TAM_GAME = {width: 1920, height: 935};
const FPS = 1;

let myGame = new Game(TAM_GAME, FPS);

// Seteando carpeta estatica, carpeta donde contiene todos los datos que requiere el usuario cuando hace la peticion
// a la web buscando recursos.
app.use(express.static(path.join(__dirname, 'public')))

let cont=0;
console.log("Empezando!!");
// Funcion que se ejecuta cuando un usuario se conecta al websocket
io.on('connection', (socket) => {
    console.log("Nueva conexion!!");

    // Envia mensaje al usuario que se ha conectado
    // socket.emit('server', 'Init Player');
    
    // Envia mensaje a todos menos al usuario que se ha conectado
    // socket.broadcast.emit('server', 'Alguien se ha conectado!!!');

    // Envia mensaje a todos los usuaios
    // io.emit();

    socket.on("disconnecting", () => {
        // Deleting users
        
        // Deleting user form rooms if was in
        // let room = users[socket.id].room;
        // var ind = rooms[room].indexOf(socket.id);
        // rooms[room].splice(ind, 1);
        
        // if (users[socket.id]);
        //     delete users[socket.id];


        console.log("**** DISCONNECTING ****");
        console.log(socket.id);
        console.log(users);
        console.log(rooms);
        console.log("**********************");
    });   
    
    // Envia mensaje cuando cliente se desconecta
    socket.on('disconnect', () => {
        console.log("Disconect");
        // io.emit('server', 'Alguien se ha desconectado!!!');
    });
        
    // socket.on('client_key', (message) => {
    //     socket.broadcast.emit('server', message);
    // });
            
    // socket.on('client_move', (move) =>{
    // users[socket.id].x += move.x;
    // users[socket.id].y += move.y;
    
    // console.log("**** MOVING ****");
    // console.log(users);
    // console.log(rooms);
    // console.log("**********************");
    // });

    socket.on('client_join_room', (message) => {
        // if (users[socket.id]){ //if user exist on a room don't use it 
        //     return;
        // }

        if (rooms[message] && rooms[message].length == 2){
            return;
        }
        
        // Create player
        let coords = [randomInt(TAM_GAME),randomInt(TAM_GAME)];
        
        myGame.SpawnPlayer(socket.id, 50, coords, 'blue', 10, `Player${cont}`, 200); cont++; // debug only
        // myGame.SpawnPlayer(50, [innerWidth-80,innerHeight/2], 'red', 10, 'Player2', 200);

        // Crea sala
        // if (!rooms[message])
        //     rooms[message] = [users,users[socket.id]];
        // else{
        //     rooms[message].push({user: socket.id, data: users[socket.id]});
        // }
        if (!rooms[message])
            rooms[message] = [socket.id];
        else{
            rooms[message].push(socket.id);
        }

        socket.join(message);
        // var room = io.sockets.adapter.rooms[message];
        io.to(message).emit('server', 'New Player Joined: ' + socket.id);

        // let nameRoom = "Room1";

        console.log(users);
        console.log(rooms);

        let return_msg = {status: 'ok', response: {users: users, rooms: rooms}};
        socket.broadcast.emit('server_new_room', return_msg);

        if (rooms[message] && rooms[message].length == 2){
            const emit_server = (room) => {
                console.log(`emiting to: ${room}`);
                let info = {};
                info['players'] = myGame.GetGameState().GetPlayers();
                info['projectiles'] = myGame.GetGameState().GetProjectiles();
                io.to(room).emit('server_update_players', info);
            };
            
            io.to(message).emit('server_start_game', TAM_GAME);
            
            myGame.Run([message], emit_server);
            console.log('****  GAME START  ****')
            return;
        }
    });

    socket.on('client_update_key', (input) => {
        input.idPlayer = socket.id;
        myGame.UpdatePlayerKeys(input);
        console.log("**** MOVING ****");
        // console.log(myGame.GetPlayersKeys());
        console.log(myGame.GetPlayersDir());
        console.log("**********************");
    })
})


server.listen(PORT, () => {console.log(`runing on port ${PORT}`);});
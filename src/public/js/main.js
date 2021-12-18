const socket = io();
const container = document.querySelector('.container');
const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
// const myGameState = new GameState();


var myGameState = {
    players = {},
    projectiles = []
};

var input = {
    type: false,
    key: 'z'
};

socket.on('server', (message) => {
    let el = document.createElement('div');
    el.classList = "key-container";
    el.innerHTML = `<p>${message}</p>`;

    container.appendChild(el);
    console.log('Hijo añadido: ', message);
});

socket.on('server_start_game', (TAM_GAME) => {
    console.log('****  GAME START  ****');


    canvas.width = TAM_GAME.width;
    canvas.height = TAM_GAME.height;
    
    canvas.classList.remove('hidden');
    container.classList.add('hidden');
});

socket.on('server_update_players', (info) => {
    myGameState.SetPlayers(info.players);
    myGameState.SetProjectiles(info.projectiles);
});

document.addEventListener('keydown', (e) => {
    UpdateKey(true, e.key);
});

document.addEventListener('keyup', (e) => {
    UpdateKey(false, e.key);
});


function UpdateKey(type, key){
    if (input.type == type && input.key == key) // if haven't changed
        return;

    input.type = type;
    input.key = key;

    // if (input.type != type) console.log(`type: ${input.type} - ${type}`);
    // if (input.key != type) console.log(`key: ${input.key} - ${key}`);

    socket.emit('client_update_key', input);   
}

function join_server(server){
    socket.emit('client_join_room', server);
}

class Display{
    static Draw(myGameState, context){
        Display.ClearScreen(context);

        myGameState.projectiles.forEach(proj => {
            Display.DrawPawn(proj, context);
        });
        
        myGameState.players.forEach(player => {
            Display.DrawPawn(player, context);
        });

        let player = myGame.myGameState.players[0];
        Display.DrawHealthBar(player, context);

        requestAnimationFrame(() => Display.Draw());
    }

    static DrawPawn(pawn, context){
        context.beginPath();
        context.arc(pawn.pos[0], pawn.pos[1], pawn.size, 0, Math.PI*2, false);  
        context.fillStyle = pawn.color;           
        context.fill(); 
    }

    static ClearScreen(context){
        const tam = canvas.getBoundingClientRect();
        context.clearRect(0, 0, tam.width, tam.height);
    }

    static DrawHealthBar(player, context){
        // Border
        let pos = [20,20];
        let tamBorder = [200, 30];
        let tamHealth = [player.health, 30];
        let stroke = 3;

        // Player green health
        context.beginPath();
        context.rect(pos[0], pos[1], tamHealth[0], tamHealth[1]);
        context.fillStyle = "green";           
        context.fill(); 
        
        // Border of the player health
        context.beginPath();
        context.rect(pos[0], pos[1], tamBorder[0], tamBorder[1]);
        context.lineWidth = stroke;
        context.strokeStyle = 'black';
        context.stroke();        
    }
}

class GameState{
    constructor(){
        this.players = {};
        this.projectiles = new Array();
    }

    GetPlayers(){
        return this.players;
    }

    GetProjectiles(){
        return this.projectiles;
    }

    SetPlayers(players){
        this.players = players;
    }

    SetProjectiles(projectiles){
        this.projectiles = projectiles;
    }  
}
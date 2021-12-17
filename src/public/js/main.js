const socket = io();
const container = document.querySelector('.container');

socket.on('server', (message) => {
    let el = document.createElement('div');
    el.classList = "key-container";
    el.innerHTML = `<p>${message}</p>`;

    container.appendChild(el);
    console.log('Hijo añadido: ', message);
})

document.addEventListener('keyup', (e) => {
    socket.emit('client_key', e.key);
    console.log(e);
});

function join_server(server){
    socket.emit('client_join_room', server);
}

function move_server(){
    socket.emit('client_move', {x:1, y:-1});
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
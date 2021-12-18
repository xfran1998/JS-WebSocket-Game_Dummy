class Display{
    static Draw(myGameState, ctx){
        if (!ctx) console.log('ctx undefined1')
        Display.ClearScreen(ctx);

        myGameState.projectiles.forEach(proj => {
            Display.DrawPawn(proj, ctx);
        });

        let players = myGameState.GetPlayers();
        for (let id in players) {
            Display.DrawPawn(players[id], ctx);
        }

        // let player = myGame.myGameState.players[0];
        // Display.DrawHealthBar(player, ctx);

        requestAnimationFrame(() => Display.Draw());
    }

    static DrawPawn(pawn, ctx){
        ctx.beginPath();
        ctx.arc(pawn.pos[0], pawn.pos[1], pawn.size, 0, Math.PI*2, false);  
        ctx.fillStyle = pawn.color;           
        ctx.fill(); 
    }

    static ClearScreen(ctx){
        const tam = ctx.canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, tam.width, tam.height);
    }

    static DrawHealthBar(player, ctx){
        // Border
        let pos = [20,20];
        let tamBorder = [200, 30];
        let tamHealth = [player.health, 30];
        let stroke = 3;

        // Player green health
        ctx.beginPath();
        ctx.rect(pos[0], pos[1], tamHealth[0], tamHealth[1]);
        ctx.fillStyle = "green";           
        ctx.fill(); 
        
        // Border of the player health
        ctx.beginPath();
        ctx.rect(pos[0], pos[1], tamBorder[0], tamBorder[1]);
        ctx.lineWidth = stroke;
        ctx.strokeStyle = 'black';
        ctx.stroke();        
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

export { GameState, Display };
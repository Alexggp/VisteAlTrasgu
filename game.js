/*
    Viste Al Trasgu
    Copyright (C) 2013  Alejandro García-Gasco Pérez
*/


var sprites = {
    trasgu:   { sx: 0, sy: 0, w: 214, h: 512, frames: 1 },
    pantalon:   { sx: 275, sy: 0, w: 77, h: 88, frames: 4 },
};



var OBJETO_TRASGU        =   1;



var playGame = function() {

    Game.setBoard(0,new capaClear());
    
    var board = new GameBoard();  
    board.add(new Trasgu()); 
    board.add(new Pantalon(30,30,0));
    board.add(new Pantalon(30,130,1));
    board.add(new Pantalon(130,30,2));
    board.add(new Pantalon(130,130,3));
      
    Game.setBoard(1,board);
}



var Trasgu = function() { //Muñeco. 

    this.setup('trasgu', {frame: 0, reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = Game.width/2 - this.w/2;
    this.y = Game.height/2 - this.h/2;
    this.step = function(dt) { 
      
 

	    this.reload-=dt;

    }
}
// Heredamos del prototipo new Sprite()
Trasgu.prototype = new Sprite();
Trasgu.prototype.type = OBJETO_TRASGU;

var Pantalon = function(sx,sy,fr) {  

    this.setup('pantalon', {frame: fr, reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = sx;
    this.y = sy;
    this.origenx=sx;
    this.origeny=sy;
    this.colocadox=Game.width/2-83;
    this.colocadoy=Game.height/2+115;
    
        
    this.step = function(dt) {
    
      mouse.movimiento(this);
	    this.reload-=dt;
	    

     }

}
Pantalon.prototype = new Sprite();

$(function() {
    Game.initialize("game",sprites,playGame);
});



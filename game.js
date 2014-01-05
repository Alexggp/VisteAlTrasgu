/*
    Viste Al Trasgu
    Copyright (C) 2013  Alejandro García-Gasco Pérez
*/


var sprites = {
    trasgu:   { sx: 0, sy: 0, w: 214, h: 512, frames: 1 },
    pantalon:   { sx: 275, sy: 0, w: 77, h: 88, frames: 4 },
    gorro:   { sx: 253, sy: 165, w: 209, h: 320, frames: 3 },
    ojos:   { sx: 264, sy: 550, w: 137, h: 55, frames: 5 },
    botas:   { sx: 662, sy: 0, w: 94, h: 72, frames: 4 },
    camiseta:   { sx: 0, sy: 653, w: 122, h: 150, frames: 8 }
};



var OBJETO_TRASGU        =   1;



var playGame = function() {

    Game.setBoard(0,new capaClear());
    
    var board = new GameBoard();  
    board.add(new Trasgu()); 
    
    // Ojos
    board.add(new Ojos(60,30,0));
    board.add(new Ojos(170,30,1));
    board.add(new Ojos(60,60,2));
    board.add(new Ojos(170,60,3));
    board.add(new Ojos(170,90,4));
    
    // Pantalones
    board.add(new Pantalon(60,170,0));
    board.add(new Pantalon(60,270,1));
    board.add(new Pantalon(170,170,2));
    board.add(new Pantalon(170,270,3));
    
    //Botas
    board.add(new Botas(60,400,0));
    board.add(new Botas(160,400,1));
    board.add(new Botas(60,480,3));
    board.add(new Botas(160,480,4));
    
    // Gorros
    board.add(new Gorro(650,30,0));
    board.add(new Gorro(730,30,1));
    board.add(new Gorro(810,30,2));
    
    // Camisetas
    board.add(new Camiseta(660,160,0));
    board.add(new Camiseta(760,160,1));
    board.add(new Camiseta(660,260,2));
    board.add(new Camiseta(760,260,3));
    board.add(new Camiseta(660,360,4));
    board.add(new Camiseta(760,360,5));
    board.add(new Camiseta(660,460,6));
    board.add(new Camiseta(760,460,7));
      
      
    Game.setBoard(1,board);
}



var Trasgu = function() { //Muñeco. 

    this.setup('trasgu', {frame: 0, reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = Game.width/2 - this.w/2;
    this.y = Game.height/2 - this.h/2 + 30;
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
    this.colocadoy=Game.height/2+145;
    
        
    this.step = function(dt) {
    
      mouse.movimiento(this);
	    this.reload-=dt;
	    

     }

}
Pantalon.prototype = new Sprite();


var Gorro = function(sx,sy,fr) {  

    //El factor nos permitirá hacer el gorro más pequeño cuando no este puesto

    this.setup('gorro', {frame: fr, factor:3 ,reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = sx;
    this.y = sy;
    this.origenx=sx;
    this.origeny=sy;
    this.colocadox=Game.width/2-90;
    this.colocadoy=92;
    
        
    this.step = function(dt) {
    
      mouse.movimiento(this);
      if (this.x==this.colocadox){this.factor=1}else{this.factor=3};
	    this.reload-=dt;
	    

     }

}
Gorro.prototype = new Sprite();

var Ojos = function(sx,sy,fr) {  

    //El factor nos permitirá hacer el gorro más pequeño cuando no este puesto

    this.setup('ojos',  {frame: fr, factor:2 ,reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = sx;
    this.y = sy;
    this.origenx=sx;
    this.origeny=sy;
    this.colocadox=Game.width/2-69;
    this.colocadoy=197;
    
        
    this.step = function(dt) {
    
      mouse.movimiento(this);
	    if (this.x==this.colocadox){this.factor=1}else{this.factor=2};
	    this.reload-=dt;
	    

     }

}
Ojos.prototype = new Sprite();


var Botas = function(sx,sy,fr) {  

    this.setup('botas', {frame: fr, reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = sx;
    this.y = sy;
    this.origenx=sx;
    this.origeny=sy;
    this.colocadox=Game.width/2-107;
    this.colocadoy=534;
    
        
    this.step = function(dt) {
    
      mouse.movimiento(this);
	    this.reload-=dt;
	    

     }

}
Botas.prototype = new Sprite();


var Camiseta = function(sx,sy,fr) {  

    this.setup('camiseta', {frame: fr, reloadTime: 0.25});

    this.reload = this.reloadTime;
    this.x = sx;
    this.y = sy;
    this.origenx=sx;
    this.origeny=sy;
    this.colocadox=Game.width/2-91;
    this.colocadoy=306;
    
        
    this.step = function(dt) {
    
      mouse.movimiento(this);
	    this.reload-=dt;
	    

     }

}
Camiseta.prototype = new Sprite();


$(function() {
    Game.initialize("game",sprites,playGame);
});



/*
    Viste Al Trasgu
    Copyright (C) 2013  Alejandro García-Gasco Pérez
*/

var Game = new function() { 
                                                          

        // Inicializa el juego
    this.initialize = function(canvasElementId,sprite_data,callback) {
  
   
	      this.canvas = document.getElementById(canvasElementId);
	      

	      
        this.width = this.canvas.width;
        this.height= this.canvas.height;

	      this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
	      if(!this.ctx) { return alert("Please upgrade your browser to play"); }





	    	
	      this.canvasMultiplier =1;  //Escala lo que vayamos a pintar en todos los pasos draw. 
	      //this.setupInput();


	      
	      this.fullscreen= function(){
           var el = document.getElementById(canvasElementId);
 
           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }            
        }
	      //this.canvas.addEventListener("dblclick",Game.fullscreen);

	      

	      this.loop(); 
	    

        //Music.cargar();
        mouse.init();     
	      SpriteSheet.load(sprite_data,callback);
   };
/*
    // Gestión de la entrada (teclas para izda/derecha y disparo)
    var KEY_CODES = { 38:'up2', 40:'down2', 87:'up1', 83:'down1', 32 :'fire', 39:'dcha', 37:'izda',81:'esc',77:'mute' };  
    this.keys = {};

    this.setupInput = function() {
	    $(window).keydown(function(event){
	        if (KEY_CODES[event.which]) {
		    Game.keys[KEY_CODES[event.which]] = true;
		    return false;
	        }
	    });
	
	    $(window).keyup(function(event){
	        if (KEY_CODES[event.which]) {
		    Game.keys[KEY_CODES[event.which]] = false;
		    return false;
	        }
	    });
	
    }
*/

    // Bucle del juego
    this.boards = [];

    this.loop = function() { 
	    // segundos transcurridos
	    var dt = 1;

	    // Para cada board, de 0 en adelante, se 
	    // llama a su método step() y luego a draw()
	    for(var i=0,len = Game.boards.length;i<len;i++) {
	        if(Game.boards[i]) { 
		    Game.boards[i].step(dt);
		    Game.boards[i].draw(Game.ctx);
	        }
	    }

	    setTimeout(Game.loop,1);
    };
    
   this.setBoard = function(num,board) { this.boards[num] = board; };
      
};


var SpriteSheet = new function() {

    this.map = { }; 

    this.load = function(spriteData,callback) { 
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
    };

    
    this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                        s.sx + frame * s.w, 
                        s.sy, 
                        s.w, s.h, 
                        Math.floor(x), Math.floor(y),
                        s.w*Game.canvasMultiplier, s.h*Game.canvasMultiplier);
    };
}





var GameBoard = function() {
    var board = this;

    this.objects = [];


    this.add = function(obj) { 
	    obj.board=this; 
	    this.objects.push(obj); 
	    return obj; 
    };

    this.remove = function(obj) { 
	      this.removed.push(obj); 
    };

    // Inicializar la lista de objetos pendientes de ser borrados
    this.resetRemoved = function() { this.removed = []; }

    // Elimina de objects los objetos pendientes de ser borrados
    this.finalizeRemoved = function() {
	      for(var i=0, len=this.removed.length; i<len;i++) {  
	          var idx = this.objects.indexOf(this.removed[i]);
	          if(idx != -1) this.objects.splice(idx,1); 
	      }
    }


    
    this.iterate = function(funcName) {
	    var args = Array.prototype.slice.call(arguments,1);

	    for(var i=0, len=this.objects.length; i<len;i++) {
	        var obj = this.objects[i];
	        obj[funcName].apply(obj,args)
	    }

    };

    // Devuelve el primer objeto de objects para el que func es true
    this.detect = function(func) {
	      for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
	          if(func.call(this.objects[i])) return this.objects[i];
	      }
	      return false;
    };
    
    this.step = function(dt) { 
	      this.resetRemoved();
	      this.iterate('step',dt);
	      this.finalizeRemoved();
	      
    };

    this.draw= function(ctx) {
	      this.iterate('draw',ctx);
    };

    
    this.overlap = function(o1,o2) {
	  return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
		 (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
    };

    this.collide = function(obj,type) {
	      return this.detect(function() {
	          if(obj != this) {
		            var col = (!type || this.type & type) && board.overlap(obj,this)
		            return col ? this : false;
	          }
	      });
    };


};


// Constructor Sprite 
var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w =  SpriteSheet.map[sprite].w;
    this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
    if(props) {
	      for (var prop in props) {
	          this[prop] = props[prop];
	      }
    }
}

Sprite.prototype.draw = function(ctx) {
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}




var capaClear = function() {

    var capa = $('<canvas/>')
	.attr('width', Game.width)
	.attr('height', Game.height)[0];



    var capaCtx = capa.getContext("2d");

 
	  capaCtx.fillStyle = "#83A85C";
	  capaCtx.fillRect(0,0,capa.width,capa.height);
	
    
    this.draw = function(ctx) {
		ctx.drawImage(capa,
			  0, 0,
			  capa.width, capa.height,
			  0, 0,
			  capa.width, capa.height);
    }

    this.step = function(dt) {}
}

	      
var mouse ={
  x:0,
  y:0,
  down:false,
  init:function(){
      $('#game').mousemove(mouse.mousemovehandler);
      $('#game').mousedown(mouse.mousedownhandler);
      $('#game').mouseup(mouse.mouseuphandler);
      $('#game').mouseout(mouse.mouseuphandler);
  },
  mousemovehandler:function(ev){
  
    var offset = $('#game').offset();
    mouse.x= ev.pageX - offset.left;
    mouse.y= ev.pageY - offset.top;
    //mouse.current=undefined;  //nos muestra que elemento tenemos seleccionado con el ratón.
    if (mouse.down) {
      mouse.abajo= true;
      mouse.dragging = true;
    }
  },
  mousedownhandler:function(ev){
    mouse.down = true;
    mouse.downX = mouse.x;
    mouse.downY = mouse.y;
    ev.originalEvent.preventDefault();
  },
  mouseuphandler:function(ev){
    mouse.down = false;
    mouse.dragging = false;
    mouse.current= undefined;  
  },
  movimiento:function(prenda){
      var trasgu = prenda.board.objects[0];
      
      if (mouse.down && mouse.x > prenda.x && mouse.x < prenda.x+prenda.w && mouse.y > prenda.y 
                                      && mouse.y < prenda.y+prenda.h && mouse.current == undefined){
        mouse.current=prenda;
        
        // Reorganizamos board.objects para que la prenda actual sea la ultima en pintarse
        var listaAux=[];
        for (cont in prenda.board.objects){
          if (prenda.board.objects[cont] != prenda){listaAux.push(prenda.board.objects[cont])}
        }
        listaAux.push(prenda);
        prenda.board.objects=listaAux;

      }
      if (mouse.dragging && mouse.current==prenda){
          prenda.x=mouse.x-prenda.w/2;
          prenda.y=mouse.y-prenda.h/2;
          };
          
      if ( !mouse.down){ 
          if (prenda.x > prenda.colocadox-prenda.w/2 && prenda.x < prenda.colocadox + prenda.w*3/2
                && prenda.y > prenda.colocadoy - prenda.h/2 && prenda.y < prenda.colocadoy + prenda.h*3/2){

              
              //si ya tiene otra prenda puesta enviamos la antigua a su sitio original
              for (cont in prenda.board.objects){
                aux=prenda.board.objects[cont];
                if (aux.sprite == prenda.sprite && aux.x==aux.colocadox && aux != prenda){
                  aux.x=aux.origenx;
                  aux.y=aux.origeny;
                }
              }
              
              prenda.x=prenda.colocadox;
              prenda.y=prenda.colocadoy;
              
          }
          else{
              prenda.x=prenda.origenx;
              prenda.y=prenda.origeny;
          }

      }
  },
}

var imprimir=function(){


      $("#info").css("display", "inline"); 
      $(".noprint").css("display", "none"); 
      window.print();
      $("#info").css("display", "none"); 
      $(".noprint").css("display", "inline"); 

};





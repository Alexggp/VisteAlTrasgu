/*
    Viste Al Trasgu
    Copyright (C) 2013  Alejandro Garc�a-Gasco P�rez
*/

var Game = new function() { 
                                                          

        // Inicializa el juego
    this.initialize = function(canvasElementId,sprite_data,callback) {
  
   
	      this.canvas = document.getElementById(canvasElementId);
	      

	      
        this.width = this.canvas.width;
        this.height= this.canvas.height;

	      this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
	      if(!this.ctx) { return alert("Please upgrade your browser to play"); }

	    	
	 

        /* DE MOMENTO NO QUEREMOS PANTALLA COMPLETA
	      
	      this.fullscreen= function(){
           var el = document.getElementById(canvasElementId);
 
           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }            
        }
       this.canvas.addEventListener("dblclick",Game.fullscreen);

	      */

	      this.loop(); 
	    

        //Music.cargar();
        mouse.init();     
	      SpriteSheet.load(sprite_data,callback);
   };

    // Bucle del juego
    this.boards = [];

    this.loop = function() { 
	    // segundos transcurridos
	    var dt = 1;

	    // Para cada board, de 0 en adelante, se 
	    // llama a su m�todo step() y luego a draw()
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

    
    this.draw = function(ctx,sprite,x,y,frame,factor) {
    var s = this.map[sprite];
    if (!factor){factor=1;};
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                        s.sx + frame * s.w, 
                        s.sy, 
                        s.w, s.h, 
                        Math.floor(x), Math.floor(y),
                        s.w/factor, s.h/factor);
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
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame,this.factor);
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

var capaClear2 = function() {

    var capa = $('<canvas/>')
	.attr('width', Game.width)
	.attr('height', Game.height)[0];



    var capaCtx = capa.getContext("2d");

 
	  capaCtx.fillStyle = "white";
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
    //mouse.current=undefined;  //nos muestra que elemento tenemos seleccionado con el rat�n.
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
      var factor=prenda.factor;
      
      if (!factor){factor=1;}
      
      var trasgu = prenda.board.objects[0];
      
      if (mouse.down && mouse.x > prenda.x && mouse.x < prenda.x+prenda.w/factor && mouse.y > prenda.y 
                                      && mouse.y < prenda.y+prenda.h/factor && mouse.current == undefined){
        mouse.current=prenda;
        $("#container").css("cursor","all-scroll");
        
        // Reorganizamos board.objects para que la prenda actual sea la ultima en pintarse
        var listaAux=[];
        for (cont in prenda.board.objects){
          if (prenda.board.objects[cont] != prenda){listaAux.push(prenda.board.objects[cont])}
        }
        listaAux.push(prenda);
        prenda.board.objects=listaAux;

      }
      if (mouse.dragging && mouse.current==prenda){
          prenda.x=mouse.x-prenda.w/(2*factor);
          prenda.y=mouse.y-prenda.h/(2*factor);
          };
          
      if ( !mouse.down){ 
          $("#container").css("cursor","pointer");
          if (prenda.x > prenda.colocadox-prenda.w && prenda.x < prenda.colocadox + prenda.w
                && prenda.y > prenda.colocadoy - prenda.h && prenda.y < prenda.colocadoy + prenda.h){

              
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
      
      
      
      //Vamos a eliminar del board las prendas no colocadas
      //de manera temporal
      
      var saved = Game.boards[1].objects;
      var nueva = [];
      nueva.push(Game.boards[1].objects[0]);
      
     
      
      
     
      
      for (cont in Game.boards[1].objects){        
        if (Game.boards[1].objects[cont].x==Game.boards[1].objects[cont].colocadox){
            nueva.push(Game.boards[1].objects[cont]);
        }
      }

      Game.boards[1].objects=nueva;
      Game.setBoard(0,new capaClear2());
      $("#container").css("background-color","white");
      $("#container").css("border-radius","0px");
      
      
      // dejamos un tiempo para que se pinte la pagina con las restricciones
      setTimeout(function(){
                        window.print();
                        $("#info").css("display", "none"); 
                        $(".noprint").css("display", "inline");
                        
                        //volvemos a dejar el board como estaba
                        Game.boards[1].objects=saved;
                        Game.setBoard(0,new capaClear());
                        $("#container").css("background-color","#83A85C");
                        $("#container").css("border-radius","19px");
                  },10);
};

var capaNombre = function(nombre) {
  
    this.step = function(dt) {};
    this.draw = function(ctx) {
	    ctx.fillStyle = "#B404AE";
	    ctx.textAlign = "center";

	    ctx.font = "bold 40px Comic Sans MS";
	    ctx.fillText(nombre,Game.width/2,50);
    }
};


var cogerNombre= function(){
      var input = $("#nombre").val();
      if (input){
          $("#nombre").css("visibility", "hidden");
          $("#nombreok").css("visibility", "hidden");
          Game.setBoard(3,new capaNombre(input));
      }
};





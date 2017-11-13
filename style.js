var exampleGame = (function () {
    function exampleGame() {
	 	this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas = document.getElementById('app');
        this.ctx = this.canvas.getContext('2d');
        this.timeToShowObstacle = 210;
        this.obstacles = [];
        this.space = 80;
        this.score = 0;
	    this.gravity = 0.05;
	    this.gravitySpeed = 0;
	    this.keyDown = false;
    }
    exampleGame.prototype.main = function () {
    	this.canvas.width = this.w;
    	this.canvas.height = this.h / 2;
        this.canvas.style.transform = "initial";
    	this.init();
    	this.run();
    	this.action();
    };
    exampleGame.prototype.init = function () {
    	this.component = {
    		width : 30,
    		height: 30,
    		background : "rgb(255,255,255)",
    		x : 30,
    		y : 30
    	}
    };
    exampleGame.prototype.dynamic =function(){
    	if(this.component.y < 0 ){
    		this.gravitySpeed = 0;
    		this.component.y = 0;
    		return;
    	}
    	if(this.component.y > this.canvas.height - 30){
    		this.component.y = this.canvas.height - 30;
    		this.gravitySpeed = 0;
    		return;
		}
        this.gravitySpeed += this.gravity;
        this.component.y += this.gravitySpeed;
    };
    exampleGame.prototype.render = function (component , type) {
    	this.ctx.fillStyle = component.background;
        var image = new Image();
        // if(type == "obstacles"){
        //     image.src = "https://scontent.fsgn4-1.fna.fbcdn.net/v/t1.0-0/p206x206/13102817_1683910338540436_2151460256025770056_n.jpg?oh=3823c19de3bfa69d11ea35c2aa5c22be&oe=59D14057";
        //     this.ctx.drawImage(image, 
        //                     component.x, 
        //                     component.y,
        //                     component.width + 100, component.height);
        // }else{
            this.ctx.fillRect(component.x, component.y, component.width, component.height);
        // }
    };
    exampleGame.prototype.run = function () {
        myRequres = window.requestAnimationFrame(this.run.bind(this));
        //check if keydown don't falling
    	this.dynamic();
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0, 0, this.w, this.h);
        //add obstacle
        this.timeToShowObstacle += 1;
        if(this.timeToShowObstacle > 200){
        	var obstacle1Height = Math.floor(Math.random() * (this.canvas.height - this.space));
        	var obstacle2Height = this.canvas.height - obstacle1Height - this.space;
        	var obstacle = {
	    		width : 10,
	    		height: obstacle1Height,
	    		background : "rgb(76,175,80)",
	    		x : this.w,
	    		y : 0
	    	}
	    	
	    	var obstacle2 = {
	    		width : 10,
	    		height: obstacle2Height,
	    		background : "rgb(76,175,80)",
	    		x : this.w,
	    		y : this.canvas.height - obstacle2Height
	    	}
	    	this.obstacles.push(obstacle);
	    	this.obstacles.push(obstacle2);
        	this.timeToShowObstacle = 1;
        }

        //render component
        this.render(this.component , "component");

        //render obstacles
        var listObstaclesRemove = [];
        for(var i = 0 ; i < this.obstacles.length ; i++){
        	//speed obstacles
        	this.obstacles[i].x -= 1;
        	if(this.obstacles[i].x < 0){
        		listObstaclesRemove.push(i);
        	}
        	//render obstacles
        	this.render(this.obstacles[i] , "obstacles");
        	//check finish game
        	if(this.checkFinish(this.obstacles[i] , this.component)){
	        	window.cancelAnimationFrame(myRequres);
	        	document.getElementById("button-reset").style.display = "block";
	        }
        }
        for(var i = listObstaclesRemove.length -1 ; i >= 0; i--){
        	this.obstacles.splice(listObstaclesRemove[i],1);
        }
        //score
        this.score += 1;
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText("Score : "+ this.score, this.canvas.width - 200, 50);

        //lv 2
        if(this.score == 2000){
            this.canvas.style.transform = "rotateX(180deg)";
        }
    };
    exampleGame.prototype.action = function(){
    	var $this = this;
    	document.addEventListener("keydown", function(e){
			$this.keyDown = true;
    		if(e.keyCode == 37 ){
    			$this.moveLeft();
    		}
    		if(e.keyCode == 38 || e.keyCode == 32){
    			$this.gravity = -0.15;
    		}
    		if(e.keyCode == 39){
    			$this.moveRight();
    		}
    		if(e.keyCode == 40){
    			$this.moveDown();
    		}
    	});
    	document.addEventListener("keyup", function(e){
    		$this.keyDown = false;
    		$this.gravity = 0.05;
    	})
    };
    exampleGame.prototype.moveUp = function(){
    	this.component.y = parseInt(this.component.y) - 5;
    };
    exampleGame.prototype.moveDown = function(){
    	this.component.y = parseInt(this.component.y) + 5;
    };
    exampleGame.prototype.moveLeft = function(){
    	this.component.x = parseInt(this.component.x)  - 5;
    };
    exampleGame.prototype.moveRight = function(){
    	this.component.x = parseInt(this.component.x)  + 5;
    };
    exampleGame.prototype.checkFinish = function(obstacle , component){
    	var myleft = component.x;
        var myright = component.x + (component.width);
        var mytop = component.y;
        var mybottom = component.y + (component.height);

        var otherleft = obstacle.x;
        var otherright = obstacle.x + (obstacle.width);
        var othertop = obstacle.y;
        var otherbottom = obstacle.y + (obstacle.height);

        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    return exampleGame;
}());

new exampleGame().main();

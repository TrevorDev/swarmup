var FloorDrawer = function(s, width, height){
	this.floors = []
	this.pos = {x: 0, y: 0}


	this.draw = function(){
		var c = 0;
		for(var i = -1;i<2;i++){
			for(var j = -1;j<2;j++){
				this.floors[c].x = (i*width)+(this.pos.x*width)
				this.floors[c].y = (j*height)+(this.pos.y*width)
				c++
			}
		}
	}

	this.checkAndRedraw = function(x, y){
		var xgrid = Math.floor(x/width)
		var ygrid = Math.floor(y/height)
		if(xgrid != this.pos.x || ygrid != this.pos.y){
			this.pos.x = xgrid
			this.pos.y = ygrid
			this.draw()
		}
	}
	for(var i = 0;i<9;i++){
		var spr = FLIXI.createSprite("background", width, height)
		this.floors.push(spr)
		s.container.addChild(spr)
	}
	this.draw()
}
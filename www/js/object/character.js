var Character = function(s, good, type, spawnPos) {
    if (good) {
        if (type == 0) {
            this.acc = 0.3;
            this.maxSpd = 5;
            this.size = 50;
            this.sprite = FLIXI.createSprite("/img/char1.png", this.size, this.size)
        }
    }
    this.spd = {x: 0, y: 0}
    this.sprite.x = spawnPos.x
    this.sprite.y = spawnPos.y

    this.applyDesiredAcc = function(x, y) {
        var xdist = x - this.sprite.x
        var ydist = y - this.sprite.y
        var dist = Math.sqrt((xdist * xdist) + (ydist * ydist))
        if(dist>this.size){
        	this.spd.x += (this.acc * xdist) / (dist) * 3
        	this.spd.y += (this.acc * ydist) / (dist) * 3
        }else{
        	this.spd.x /= 1.3
        	this.spd.y /= 1.3
        }
        
    }

    this.move = function(){
    	var mag = Math.sqrt(this.spd.x*this.spd.x + this.spd.y*this.spd.y)
    	if(mag>this.maxSpd){
    		this.spd.x*=(this.maxSpd/mag)
    		this.spd.y*=(this.maxSpd/mag)
    	}

    	this.sprite.x+=this.spd.x
    	this.sprite.y+=this.spd.y
    }

    this.collidesWith = function(c){
    	if((Math.abs(this.sprite.x-c.sprite.x) < (this.size+c.size)) && (Math.abs(this.sprite.y-c.sprite.y) < (this.size+c.size))){
    		return true
    	}
    	return false
    }

    this.calcDist = function(a) {
        var xdist = a.sprite.x - this.sprite.x
        var ydist = a.sprite.y - this.sprite.y
        return Math.sqrt((xdist * xdist) + (ydist * ydist))
    }

    this.collidesWithSphere = function(c){
    	if(this.calcDist(c) < this.size/2+c.size/2){
    		return true
    	}
    	return false
    }

    this.moveTo = function(pos) {
        this.sprite.x = pos.x
        this.sprite.y = pos.y
    }

    this.getPos = function(){
    	return {x: this.sprite.x, y:this.sprite.y}
    }

    s.container.addChild(this.sprite)
}

Character.radialRandPos = function(x, y, dist) {
    var ret = {}
    var rot = Math.random() * Math.PI * 2
    ret.x = x + Math.sin(rot) * dist
    ret.y = y + Math.cos(rot) * dist
    $("#debug").html(ret.x+" "+ret.y)
    return ret
}
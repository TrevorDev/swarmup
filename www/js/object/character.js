var Character = function(s, good, type, spawnPos) {
    if (good) {
        if (type == 0) {
            this.spd = 5;
            this.size = 50;
            this.sprite = FLIXI.createSprite("/img/char1.png", this.size, this.size)
        }
    }

    this.sprite.x = spawnPos.x
    this.sprite.y = spawnPos.y

    this.getNextPos = function(x, y) {
        var ret = {
            x: this.sprite.x,
            y: this.sprite.y
        }
        var xdist = x - this.sprite.x
        var ydist = y - this.sprite.y
        var dist = Math.sqrt((xdist * xdist) + (ydist * ydist))
        if (dist > 5) {
            ret.x = this.sprite.x + (this.spd / dist) * xdist
            ret.y = this.sprite.y + (this.spd / dist) * ydist
        }
        return ret
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
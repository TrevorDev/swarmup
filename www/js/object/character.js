var Character = function(s, good, type, spawnPos) {
    this.maxHealth = 100
    this.maxSpd = 5;
    this.acc = 0.3
    this.size = 50
    this.dmg = 1
    this.payout = 5
    this.healthBar = false

    if (good) {
        if (type <= 0) {
            this.dmg = 2
            this.sprite = FLIXI.createSprite("/img/char1.png", this.size, this.size)
        }else if(type == 1){
            this.size=100
            this.dmg = 5
            this.maxHealth = 150
            this.sprite = FLIXI.createSprite("/img/char2.png", this.size, this.size)
        }else if(type == 2){
            this.dmg = 20
            this.maxHealth = 300
            this.sprite = FLIXI.createSprite("/img/char3.png", this.size, this.size)
        }else if(type == 3){
            this.dmg = 20
            this.maxHealth = 9001
            this.sprite = FLIXI.createSprite("/img/char4.png", this.size, this.size)
        }else if(type == 4){
            this.dmg = 300
            this.maxHealth = 5000
            this.sprite = FLIXI.createSprite("/img/char5.png", this.size, this.size)
        }else if(type == 5){
            this.dmg = 501
            this.maxHealth = 8000
            this.sprite = FLIXI.createSprite("/img/char6.png", this.size, this.size)
        }else if(type == 6){
            this.dmg = 1000
            this.maxHealth = 8000
            this.sprite = FLIXI.createSprite("/img/char7.png", this.size, this.size)
        }else{
            this.sprite = FLIXI.createSprite("/img/char7.png", this.size, this.size)
        }
    }else{
        if (type <= 0) {
            this.sprite = FLIXI.createSprite("/img/bad1.png", this.size, this.size)
        }else if(type == 1){
            this.dmg = 3
            this.maxHealth = 150
            this.sprite = FLIXI.createSprite("/img/bad2.png", this.size, this.size)
        }else if(type == 2){
            this.size=200
            this.dmg = 8
            this.maxHealth = 300
            this.sprite = FLIXI.createSprite("/img/bad3.png", this.size, this.size)
        }else if(type == 3){
            this.dmg = 50
            this.maxHealth = 900
            this.sprite = FLIXI.createSprite("/img/bad4.png", this.size, this.size)
        }else if(type == 4){
            this.dmg = 90
            this.maxHealth = 2000
            this.sprite = FLIXI.createSprite("/img/bad5.png", this.size, this.size)
        }else if(type == 5){
            this.dmg = 300
            this.maxHealth = 2000
            this.sprite = FLIXI.createSprite("/img/bad6.png", this.size, this.size)
        }else{
            this.sprite = FLIXI.createSprite("/img/bad6.png", this.size, this.size)
        }
        this.healthBar = FLIXI.createSprite("/img/red.png", this.size*2, 20)
        this.healthBar.y-=30;
        this.healthBar.alpha = 0
        this.sprite.addChild(this.healthBar)//this causes flicker of red beacause healthbar gets huge on first frame for some reason
    }

    this.health = this.maxHealth
    this.spd = {x: 0, y: 0}
    this.sprite.x = spawnPos.x
    this.sprite.y = spawnPos.y

    this.applyDesiredAcc = function(x, y) {
        var xdist = x - this.getPos().x
        var ydist = y - this.getPos().y
        var dist = Math.sqrt((xdist * xdist) + (ydist * ydist))
        if(dist>this.size){
        	this.spd.x += (this.acc * xdist) / (dist) * 3
        	this.spd.y += (this.acc * ydist) / (dist) * 3
        }else{
        	this.spd.x /= 1.3
        	this.spd.y /= 1.3
        }
        
    }

    this.takeHit = function(dmg){
        this.health -= dmg
        if(this.health < 0){
            this.health = 0
        }
        if(this.healthBar){
            this.healthBar.alpha = 100
            this.healthBar.scale.x = (this.health/this.maxHealth)*100
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

    this.calcDist = function(a) {
        var xdist = a.getPos().x - this.getPos().x
        var ydist = a.getPos().y - this.getPos().y
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
    	return {x: this.sprite.x + (this.size/2), y: this.sprite.y + (this.size/2)}
    }

    this.destroy = function(){
        s.container.removeChild(this.sprite)
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
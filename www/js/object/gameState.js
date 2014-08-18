var GameState = function(){
	this.swarm = []
	this.evilArmy = []
	this.gold = 0
	this.pos = {x:0,y:0}
	this.dangerLevel = 0
	this.spendGold = function(amt){
		if(amt <= this.gold){
			this.gold -= amt
			this.updateGold()
			return true
		}
		return false
	}

	this.addGold = function(amt){
		this.spendGold(-amt)
	}

	this.updateGold = function(){
		$("#cashDisp").html("Gold: "+this.gold+"g")
	}

	this.setPos = function(x,y){
		this.dangerLevel = -Math.floor(y/2000)
		$("#dangerLevel").html("Danger Level: "+this.dangerLevel)
		this.pos.x = x
		this.pos.y = y
	}
}
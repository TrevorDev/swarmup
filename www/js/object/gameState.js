var GameState = function(){
	this.swarm = []
	this.evilArmy = []
	this.gold = 500
	this.pos = {x:0,y:0}

	this.spendGold = function(amt){
		if(amt <= this.gold){
			this.gold -= amt
			this.updateGold()
			return true
		}
		return false
	}

	this.updateGold = function(){
		$("#cashDisp").html("Gold: "+this.gold+"g")
	}

	this.setPos = function(x,y){
		this.pos.x = x
		this.pos.y = y
	}
}
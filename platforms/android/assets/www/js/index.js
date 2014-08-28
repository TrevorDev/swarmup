FLIXI.PRELOADER.addTexture("instructions", "img/instruct.png")
FLIXI.PRELOADER.addTexture("background", "img/floor1.png")
FLIXI.PRELOADER.addTexture("color.red", "img/red.png")
FLIXI.PRELOADER.addTexture("character.bad.1", "img/bad1.png")
FLIXI.PRELOADER.addTexture("character.bad.2", "img/bad2.png")
FLIXI.PRELOADER.addTexture("character.bad.3", "img/bad3.png")
FLIXI.PRELOADER.addTexture("character.bad.4", "img/bad4.png")
FLIXI.PRELOADER.addTexture("character.bad.5", "img/bad5.png")
FLIXI.PRELOADER.addTexture("character.bad.6", "img/bad6.png")
FLIXI.PRELOADER.addTexture("character.good.1", "img/char1.png")
FLIXI.PRELOADER.addTexture("character.good.2", "img/char2.png")
FLIXI.PRELOADER.addTexture("character.good.3", "img/char3.png")
FLIXI.PRELOADER.addTexture("character.good.4", "img/char4.png")
FLIXI.PRELOADER.addTexture("character.good.5", "img/char5.png")
FLIXI.PRELOADER.addTexture("character.good.6", "img/char6.png")
FLIXI.PRELOADER.addTexture("character.good.7", "img/char7.png")


var gameState = new GameState()
gameState.updateGold()
var slideMenu = new SlideMenu($("#gameMenu"), $("#gameMenuGrab"))
slideMenu.setMenu(0)
var s = new FLIXI.Screen($("#myCanvas"));
s.resize(window.innerWidth, window.innerHeight) //set to screen res


var touchedMax = 60;
var touched = touchedMax;
$("#myCanvas").on("mousedown mousemove mouseup touchstart touchmove", function(e) {
    touched = touchedMax
    e.preventDefault();
    slideMenu.setMenu(0)
    var pos = {x: 0, y: 0}
    if (e.type == "mousedown" || e.type == "mousemove" || e.type == "mouseup") {
        if(e.type == "mouseup"){
            slideMenu.setMenu(1)
        }
        if(e.buttons!=1){
            return
        }
        pos = s.getRelativePos(e.clientX, e.clientY)
    } else {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        pos = s.getRelativePos(touch.pageX, touch.pageY)
    }
    gameState.setPos(pos.x, pos.y)
})

var floor = new FloorDrawer(s, 1000, 1000)
var instruct = FLIXI.createSprite("instructions", 500, 500)
instruct.y+=100
instruct.x+=20
s.container.addChild(instruct)

$(".storeBtn").each(function(i, item) {
    $(item).on("click", function() {
        var price = 0;
        if (i == 0) {
            price = 5
        }else if(i == 1){
            price = 50   
        }else if(i == 2){
            price = 200  
        }else if(i == 3){
            price = 1000 
        }else if(i == 4){
            price = 9001
        }else if(i == 5){
            price = 50000   
        }else if(i == 6){
            price = 1000000   
        }

        if (gameState.spendGold(price)) {
            var character = new Character(s, true, i, Character.radialRandPos(gameState.pos.x, gameState.pos.y, s.origWidth))//{x:gameState.pos.x, y:gameState.pos.y}) this causes weird texture errors
            gameState.swarm.push(character)
        }
    })
})


gameState.setPos((s.origWidth / 2), (s.origHeight / 2))
var loaded = 0;
s.runAnimateLoop(function() {
    loaded++
    if(loaded == 50){
        $("#loadingScrn").hide()
    }

    touched--;

    //swam movement
    $.each(gameState.swarm, function(i, c) {
        if (1) {
            c.applyDesiredAcc(gameState.pos.x, gameState.pos.y);

            $.each(gameState.swarm, function(i, obj) {
                if (obj != c) {
                    if (obj.collidesWithSphere(c)) {
                        var dist = c.calcDist(obj)
                        var cPos = c.getPos()
                        var objPos = obj.getPos()
                        c.spd.x -= 2 * (objPos.x - cPos.x) / dist
                        c.spd.y -= 2 * (objPos.y - cPos.y) / dist
                    }
                }
            })
            c.move()
        }
    })

    //attacking
    gameState.evilArmy = $.grep(gameState.evilArmy, function(evil){
        gameState.swarm = $.grep(gameState.swarm, function(good){
            var d = good.calcDist(evil)
            if(d < good.size){
                evil.takeHit(good.dmg)
            }
            if(d < evil.size){
                good.takeHit(evil.dmg)
            }
            if(good.health<=0){
                good.destroy()
                return false
            }
            return true
        })
        var xd = evil.getPos().x - gameState.pos.x
        var yd = evil.getPos().y - gameState.pos.y
        var dist = Math.sqrt(xd*xd+yd*yd)
        if(dist > s.origHeight || evil.health <= 0){
            if(evil.health <= 0){
                gameState.addGold(evil.payout)
            }
            evil.destroy()
            return false;
        }
        return true
    })

    //spawning evil
    while(gameState.evilArmy.length < 10){
        var character = new Character(s, false, gameState.dangerLevel, Character.radialRandPos(gameState.pos.x, gameState.pos.y, s.origHeight))
        gameState.evilArmy.push(character)
    }

    if(gameState.gold == 0 && gameState.swarm.length == 0){
        gameState.addGold(5)
    }

    floor.checkAndRedraw(gameState.pos.x, gameState.pos.y)
    s.camera.moveTowards(gameState.pos.x - (s.origWidth / 2), gameState.pos.y - (s.origHeight / 2))
}, true);


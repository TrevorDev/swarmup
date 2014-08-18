/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        /*var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        $("#debug").html(windowHeight+" "+windowWidth)
        var s = new FLIXI.Screen($("#myCanvas"));
        s.resize(windowWidth, windowHeight)
        $("#myCanvas").on("touchstart mousedown", function(e){
            console.log(e)
        })*/
    }
};

var gameState = new GameState()
gameState.updateGold()

var slideMenu = new SlideMenu($("#gameMenu"), $("#gameMenuGrab"))

var s = new FLIXI.Screen($("#myCanvas"));
s.resize(window.innerWidth, window.innerHeight) //set to screen res


var touchedMax = 60;
var touched = touchedMax;
$("#myCanvas").on("mousedown touchstart touchmove", function(e) {
    touched = touchedMax
    e.preventDefault();
    slideMenu.setMenu(0)
    if (e.type == "mousedown") {
        $("#debug").html(e.offsetX + " " + e.clientY)
    } else {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var pos = s.getRelativePos(touch.pageX, touch.pageY)
        gameState.setPos(pos.x, pos.y)
    }
})

var floor = new FloorDrawer(s, 1000, 1000)

$(".storeBtn").each(function(i, item) {
    $(item).on("click", function() {
        if (i == 0) {
            if (gameState.spendGold(5)) {
                var character = new Character(s, true, i, Character.radialRandPos(gameState.pos.x, gameState.pos.y, s.origWidth / 2))
                gameState.swarm.push(character)
            }
        }else if(i == 1){
            if (gameState.spendGold(50)) {
                var character = new Character(s, true, i, Character.radialRandPos(gameState.pos.x, gameState.pos.y, s.origWidth / 2))
                gameState.swarm.push(character)
            }
        }
    })
})



s.runAnimateLoop(function() {
    touched--;

    //swam movement
    $.each(gameState.swarm, function(i, c) {
        if (touched > 0) {
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


    floor.checkAndRedraw(gameState.pos.x, gameState.pos.y)
    s.camera.moveTowards(gameState.pos.x - (s.origWidth / 2), gameState.pos.y - (s.origHeight / 2))
}, true);
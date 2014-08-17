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

$("#myCanvas").on("mousedown touchstart touchmove", function(e) {
    e.preventDefault();
    slideMenu.setMenu(0)
    if (e.type == "mousedown") {
        $("#debug").html(e.offsetX + " " + e.clientY)
    } else {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var pos = s.getRelativePos(touch.pageX, touch.pageY)
        gameState.setPos(pos.x, pos.y)
        /*var img = FLIXI.createSprite("/img/char1.png", 50, 50)
        img.x = pos.x
        img.y = pos.y
        s.container.addChild(img)*/
    }
})

var floor = new FloorDrawer(s, 1000, 1000)

$(".storeBtn").each(function(i, item) {
    $(item).on("click", function() {
        if (i == 0) {
            if (gameState.spendGold(5)) {
                var character = new Character(s, true, 0, Character.radialRandPos(gameState.pos.x, gameState.pos.y, s.origWidth/2))
                gameState.swarm.push(character)
                //s.container.addChild(img)
            }
        }
    })
})



s.runAnimateLoop(function() {
    $.grep(gameState.swarm, function(c) {
        var oldPos = c.getPos()
        var nxtPos = c.getNextPos(gameState.pos.x, gameState.pos.y);
        c.moveTo(nxtPos) 
        var hit = false;
        $.each(gameState.swarm, function(i, obj) {
            if (obj != c) {
                if(obj.collidesWithSphere(c)){
                    hit = true
                    //return false
                }
            }
        })
        if(hit){
           /*var xm = oldPos.x - nxtPos.x
           var ym = oldPos.y - nxtPos.y
           nxtPos.x = oldPos.x+ym;
           nxtPos.y = oldPos.y-xm;*/
           c.moveTo(oldPos) 
        }
        
    })
    floor.checkAndRedraw(gameState.pos.x, gameState.pos.y)
    s.camera.moveTowards(gameState.pos.x - (s.origWidth / 2), gameState.pos.y - (s.origHeight / 2))
});
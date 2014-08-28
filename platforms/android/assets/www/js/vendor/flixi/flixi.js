var FLIXI = {
    RunEveryFrame: function(x) {
        var loop = function() {
            x();
            //setTimeout(loop, 15)
            requestAnimFrame(loop);
        }
        loop();
    },
    Screen: function(canvas) {
        this.renderer = PIXI.autoDetectRenderer(canvas.width(), canvas.height(), canvas[0], true)

        this.origWidth = canvas.width()
        this.origHeight = canvas.height()
        this.width = this.origWidth
        this.height = this.origHeight


        this.stage = new PIXI.Stage();
        this.container = new PIXI.DisplayObjectContainer(); //new PIXI.SpriteBatch();
        this.stage.addChild(this.container);



        this.render = function() {
            this.renderer.render(this.stage);
        }

        this.getRelativePos = function(a,b){
            var x = ((a/this.width) * this.origWidth) - thisScreen.container.position.x
            var y = ((b/this.height) * this.origHeight) - thisScreen.container.position.y
            return {x: x, y: y};
        }

        this.runAnimateLoop = function(x, statsEnabled) {
            var scrn = this;
            if(statsEnabled){
                var stats = new Stats();
                document.body.appendChild( stats.domElement );
                stats.domElement.style.position = "absolute";
                stats.domElement.style.top = "0px";
                FLIXI.RunEveryFrame(function() {
                    stats.begin();
                    x();
                    scrn.render();
                    stats.end();
                })
            }else{
                FLIXI.RunEveryFrame(function() {
                    x();
                    scrn.render();
                })
            }
            
        }

        this.resize = function(x, y) {
            this.width = x
            this.height = y
            this.renderer.view.style.width = x + "px"
            this.renderer.view.style.height = y + "px"
        }

        var thisScreen = this;
        this.camera = {
            move: function(x, y) {
                thisScreen.container.position.x -= x;
                thisScreen.container.position.y -= y;
            },
            setPos: function(x, y) {
                thisScreen.container.position.x = -x;
                thisScreen.container.position.y = -y;
            },
            moveTowards: function(x, y) {
                var xdist = -thisScreen.container.position.x - x
                var ydist = -thisScreen.container.position.y - y
                xm = xdist/50
                ym = ydist/50
                if(Math.abs(xm) > 2){
                    thisScreen.container.position.x += xm;
                }
                if(Math.abs(ym) > 2){
                    thisScreen.container.position.y += ym;
                }
                
                
            },
            zoom: function(x) {
                thisScreen.container.scale.x *= x;
                thisScreen.container.scale.y *= x;
            }
        }
    },
    randomID: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + '-' + s4() + s4() + s4();
    },
    createSprite: function(link, width, height) {
        var texture = this.PRELOADER.TEXTURES[link]
        var sprite = new PIXI.Sprite(texture)
        if (width) {
            sprite.width = width;
            sprite.height = height;
        }
        return sprite
    },
    Line: function(a, b) {
        this.start = a;
        this.end = b;
        this.draw = function(graphics) {
            graphics.lineStyle(1, 0xcccccc, 1);
            graphics.moveTo(this.start.x, this.start.y);
            graphics.lineTo(this.end.x, this.end.y);
        }
        this.clone = function() {
            return new FLIXI.Line(this.start.clone(), this.end.clone())
        }
        this.scale = function(x) {
            var disX = this.end.x - this.start.x
            var disY = this.end.y - this.start.y
            this.end = new PIXI.Point(this.start.x + (disX * x), this.start.y + (disY * x));
        }
        this.move = function(x, y) {
            this.end.x += x;
            this.end.y += y;
            this.start.x += x;
            this.start.y += y;
        }
        this.length = function() {
            var disX = this.end.x - this.start.x
            var disY = this.end.y - this.start.y
            return Math.sqrt(disX * disX + disY * disY)
        }
    },
    Controller: function(keys) {
        var listener = new window.keypress.Listener();
        keyMap = {}
        for (var i in keys) {
            keyMap[i] = [keys[i], false]
        }

        this.keys = keyMap;
        this.keyUp = function(key) {
            this.keys[key][1] = false;
        };
        this.keyDown = function(key) {
            this.keys[key][1] = true;
        };
        this.getKey = function(key) {
            return this.keys[key][1];
        }
        this.getKeyPressed = function(key) {
            var ret = this.keys[key][1];
            this.keys[key][1] = false;
            return ret;
        }

        for (var key in this.keys) {
            listener.register_combo({
                keys: this.keys[key][0],
                on_keydown: this.keyDown.bind(this, [key]),
                on_keyup: this.keyUp.bind(this, [key]),
                prevent_repeat: true
            });
        }
    },
    PRELOADER: {
        TEXTURES: {},
        SOUNDS: {},
        addTexture: function(name, link){
            this.TEXTURES[name] = new PIXI.Texture.fromImage(link)
        }
    }
}
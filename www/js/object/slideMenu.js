var SlideMenu = function(menu, grabber) {
    this.menuLocked = false
    this.menuClosed = false
    var thisThing = this;
    this.setMenu = function(open) {
        var goHere = -menu.width() + 5
        if (open) {
            goHere = 0
        } else if (this.menuClosed) {
            return
        }

        var l = menu.position().left
        this.menuLocked = true;
        var movSpd = Math.abs(goHere - l)/10;
        var mover = function() {
            if (l > goHere) {
                l -= movSpd;
                if (l < goHere) {
                    l = goHere
                }
            } else if (l < goHere) {
                l += movSpd;
                if (l > goHere) {
                    l = goHere
                }
            }
            menu.css("left", l + "px")
            if (l != goHere) {
                setTimeout(mover, 5)
            } else {
                if (goHere == 0) {
                    thisThing.menuClosed = false
                } else {
                  menu.css('opacity', '0.0');
                    thisThing.menuClosed = true
                }
                thisThing.menuLocked = false;
            }
        }
        mover();
    }
    
    grabber.on("mousedown touchstart touchend touchmove", function(e) {
        e.preventDefault();
        if (!thisThing.menuLocked) {
              menu.css('opacity', '1');
              var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
              var l = touch.pageX - menu.width() + 5;
              if (l > 0) {
                  l = 0;
              }
              if (e.type == "touchend") {
                  if (l < -menu.width() * (thisThing.menuClosed ? (4 / 5) : (1 / 5))) {
                      thisThing.setMenu(0)
                  } else {
                      thisThing.setMenu(1)
                  }

              } else {
                  menu.css("left", l + "px")
              }
        }
    })
}
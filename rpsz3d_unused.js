


/**
 * Add some general display_value objects
 */
function game_add_display_values() {
    var dv = new DisplayValue("UP KEY","OFF",10,10)
    dv.run = function() {
        var up = ace3.eventManager.pressed(ace3.eventManager.keyCodes.right_shift)? "ON" : "OFF"
        this.setValue(up)
    }
    ace3.defaultActorManager.registerActor(dv)
    
    var tl_display = new DisplayValue("testVar","0",10,30)
    tl_display.run = function() {
        this.setValue(test_logic.testVar)
    }
    ace3.defaultActorManager.registerActor(tl_display)
    
}

function game_add_logics() {
    test_logic = new ACE3Logic()
    test_logic.testVar = 0
    test_logic_last_sec = 0
    test_logic.run = function() {
        var d = new Date();
        var n = d.getSeconds();
        if (n%5 == 0 && n != this.last_sec) {
            this.testVar += 1
            this.last_sec = n
        }
        if (ace3.eventManager.released(ace3.eventManager.keyCodes.escape)) {
            game_pause()
        }
    }
    ace3.defaultActorManager.registerLogic(test_logic)
}







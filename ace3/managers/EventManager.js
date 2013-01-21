ACE3.EventManager = function() {
    //this.keyEvents = new Array()
    //this.mouseEvents = new Array()
    //this.addKeyEvent = function(keyCode, caller, fnDown, fnUp) {
    //    this.keyEvents[keyCode] = new ACE3Event(keyCode, caller, fnDown,fnUp)
    //}
    //TODO : event manager should store an array of current pressed keys.
    this.key = {} //Associative array code/status
    this.mouseStatus = "" //DOWN,UP

    this.keyCodes = {
        // some labeled key codes
        arrow_up : 38,
        arrow_down : 40,
        arrow_left: 37,
        arrow_right: 39,
        right_shift: 16,
        right_control: 17,
        escape: 27
    }
}

ACE3.EventManager.prototype = {
    constructor: ACE3.EventManager,
    type: "ACE3.EventManager", 
    
    resetUpKeys: function() {
        // At every step the eventManager must reset state of keys that are
        // in the UP state
        for (id in this.key) {
            if (this.key[id] == "UP") {
                delete this.key[id]
            }
        }
    },
    
    resetMouseReleased: function() {
        if (this.mouseStatus == 'UP') {
            this.mouseStatus = ""
        }
    },
    
    pressed: function(keyCode) {
        if (this.key[keyCode] != undefined){
            return this.key[keyCode] == "DOWN"
        }
        return false
    },
    released: function(keyCode) {
        if (this.key[keyCode] != undefined){
            return this.key[keyCode] == "UP"
        }
        return false
    },
    
    mousePressed: function() {
        return this.mouseStatus == 'DOWN'
    },
    
    mouseReleased: function() {
        return this.mouseStatus == "UP"
    },   
}
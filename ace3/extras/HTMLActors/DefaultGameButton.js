/**
* This is the class for the default action button in the game. The
* run() function is managing some situations to decide whether to 
* display itself or to display grayed out (disabled), or to not display at all.
*/

DefaultGameButton = function(label, vec2pos, vec2size, onclick) {
	ACE3.HTMLButton.call(this, label, vec2pos.x, vec2pos.y, vec2size.x, vec2size.y, 
		onclick, 10, "gold", "black")
	this.baseCss.fontSize = "0.8em"
	this.hidden = false
	this.disabled = false
	//this.onmouseover = "onmouseover=\"_ace3.findActorById('" + this.id + "').mouseover()\""
	this.onMouseOverFunction = null
	this.onMouseOutFunction = null
	this.displayInfo = null //the reference to the displayInfoActor
	this.displayInfoMessage = "" // the message to be pushed in the displayInfo Actor only when needed.
	this.mouseStatus = "OUT" // "OVER", "OUT"
}

DefaultGameButton.extends(ACE3.HTMLButton, "DefaultGameButton")

DefaultGameButton.prototype.init = function() {
	this.getSuperClass().init.call(this)
	$("#" + this.getId()).attr("onmouseover", "_ace3.findActorById('" + this.id + "').mouseover()")
	$("#" + this.getId()).attr("onmouseout", "_ace3.findActorById('" + this.id + "').mouseout()")
}

DefaultGameButton.prototype.mouseover = function() {
	this.mouseStatus = "OVER"
}
DefaultGameButton.prototype.mouseout = function() {
	this.mouseStatus = "OUT"
	if (this.displayInfo) {
		this.displayInfo.hide()  //this is done here only once when going out of the view of the button !!!
	}
}

/**
* This is the initLoop logic executed at every cycle, you should simply 
* implement here some initialization you need at every loop of the game
*/
DefaultGameButton.prototype.initLoopLogic = function() {}
/**
* This function should set the 'hidden' property of the object with
* a custom logic.
*/
DefaultGameButton.prototype.hiddenLogic = function () {}

/**
* This function should set the 'disable' property of the object with
* a custom logic
*/
DefaultGameButton.prototype.disableLogic = function() {}

DefaultGameButton.prototype.run = function() {
	if (this.displayInfo) {
		if (this.mouseStatus == "OVER") {
			// console.log(this.getInfoMessage())
			this.displayInfo.setValue(this.getInfoMessage())	
			this.displayInfo.show()
		}
	}

	this.initLoopLogic()
	this.hiddenLogic()
	if (this.hidden) {
		this.hide()
	}else {
		this.show()
		this.disableLogic()
		if (this.disabled) {
			this.disable()
		}else {
			this.enable()
		}
	}
}

DefaultGameButton.prototype.enable = function() {           
	this.disabled = false
	this.css("color", "gold")
    this.css("border", "3px solid green")
}
DefaultGameButton.prototype.disable = function() {
    this.disabled = true
    this.css("color", "gray")
    this.css("border", "3px solid gray")
}

DefaultGameButton.prototype.getInfoMessage = function() {
	return "Override this method to get info when the mouse is over this button"
}
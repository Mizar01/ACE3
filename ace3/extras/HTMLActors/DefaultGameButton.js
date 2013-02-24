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
* This function should return if the button is hidden from screen
* You should override this function for your own logic on hiding the button
*/
DefaultGameButton.prototype.hiddenLogic = function () {
	return false
}

/**
* This function should return if the button is shown but disabled.
* You should override this function for your own logic on disabling the button
*/
DefaultGameButton.prototype.disableLogic = function() {
	return false
}

DefaultGameButton.prototype.run = function() {
	if (this.displayInfo) {
		if (this.mouseStatus == "OVER") {
			// console.log(this.getInfoMessage())
			this.displayInfo.setValue(this.getInfoMessage())	
			this.displayInfo.show()
		}
	}

	this.initLoopLogic()
	if (this.hiddenLogic()) {
		this.hide()
	}else {
		this.show()
		if (this.disableLogic()) {
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

DefaultGameButton.prototype.click = function() {
	if (!this.disabled) {
		this.getSuperClass().click.call(this)
	}
}
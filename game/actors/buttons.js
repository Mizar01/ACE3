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
}

DefaultGameButton.extends(ACE3.HTMLButton, "DefaultGameButton")

DefaultGameButton.prototype.init = function() {
	this.getSuperClass().init.call(this)
	$("#" + this.getId()).attr("onmouseover", "_ace3.findActorById('" + this.id + "').mouseover()")
	$("#" + this.getId()).attr("onmouseout", "_ace3.findActorById('" + this.id + "').mouseout()")
}

DefaultGameButton.prototype.mouseover = function() {
	this.displayInfo.setValue(this.displayInfoMessage)
	this.displayInfo.show()
}
DefaultGameButton.prototype.mouseout = function() {
	this.displayInfo.hide()
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


function define_HUD() {
	var displayInfo = new ACE3.DisplayValue("", "", ace3.getFromRatio(15, 7))
	displayInfo.separator = ""
	gameManager.registerActor(displayInfo)

	var upgradeButton = new DefaultGameButton("UP", ace3.getFromRatio(15, 2),
		                        new THREE.Vector2(25, 25), null)
	upgradeButton.currentUnit = null
	upgradeButton.displayInfo = displayInfo
	upgradeButton.initLoopLogic = function() {
		// store the current unit
		this.currentUnit = null
		var us = selectManager.unitSelector.selectedUnits
		if (us.length == 1) {
			var u = us[0]
	        if (GameUtils.isUnit(u)  && GameUtils.isHuman(u)) {
				this.currentUnit = u
				this.displayInfoMessage = u.getInfoForUpgrade()
			}
		}

	}

	upgradeButton.hiddenLogic = function() {
		this.hidden = false
		if (this.currentUnit == null) {
			this.hidden = true
		}
	} 
	upgradeButton.disableLogic = function() {
		var u = this.currentUnit
		this.disabled = true
		if (u.canUpgrade()) {
			this.disabled = false
		}
	}

	upgradeButton.onClickFunction = function() {
		if (!this.disabled) {
			this.currentUnit.upgrade()
		}
	}

	var satelliteShotButton = new DefaultGameButton("SS", ace3.getFromRatio(25, 2),
		                        new THREE.Vector2(25, 25), null)
	satelliteShotButton.displayInfo = displayInfo
	satelliteShotButton.initLoopLogic = function() {
		// store the current unit
		this.currentUnit = null
		var us = selectManager.unitSelector.selectedUnits
		if (us.length == 1) {
			var u = us[0]
	        if (GameUtils.isUnit(u)  && GameUtils.isHuman(u)) {
				this.currentUnit = u
				this.displayInfoMessage = "Launches from satellite to disable a randomly chosed enemy tower"
			}
		}

	}
	satelliteShotButton.hiddenLogic = function() {
		this.hidden = false
	} 
	satelliteShotButton.disableLogic = function() {
		this.disabled = false
		//TODO : implement some condition on resources...
	}

	satelliteShotButton.onClickFunction = function() {
		if (!this.disabled) {
			humanPlayer.satelliteLaunch()
		}
	}



	gameManager.registerActor(upgradeButton)
	gameManager.registerActor(satelliteShotButton)

}

/**
* Define the buttons and HUD for the human player.
**/
function define_player_HUD() {
	var displayInfo = new ACE3.DisplayValue("", "", ace3.getFromRatio(15, 7))
	displayInfo.separator = ""
	hudManager.registerActor(displayInfo)

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
			}
		}

	}

	upgradeButton.getInfoMessage = function() {
		if (this.currentUnit) {
			return this.currentUnit.getInfoForUpgrade()
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
			}
		}

	}

	satelliteShotButton.getInfoMessage = function() {
		return humanPlayer.getInfoSatelliteShot()
	}

	satelliteShotButton.disableLogic = function() {
		if (!humanPlayer.canSatelliteShoot()) {
			this.disabled = true
		}else {
			this.disabled = false
		}
	}

	satelliteShotButton.onClickFunction = function() {
		if (!this.disabled) {
			humanPlayer.satelliteLaunch()
		}
	}



	hudManager.registerActor(upgradeButton)
	hudManager.registerActor(satelliteShotButton)

}

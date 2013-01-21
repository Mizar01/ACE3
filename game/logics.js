

function MultiSelectTarget() {
	this.base = ACE3.Logic
	this.base()
    this.selStart = null
    this.selEnd = null
    this.unitSelector = new UnitSelector()
    this.areaSelector = new AreaSelector() //Rectangle to attach to terrain to draw selection on screen
	this.run = function() {
        var uSel = this.unitSelector
        var pm = ace3.pickManager
        var singleSelect = false
        var intObj = null
        // Picking control
        if (ace3.eventManager.mousePressed() && this.selStart == null) {
            pm.pickActor()
            var pu = pm.pickedActor
            if (pu != null) {
                intObj = pm.intersectedObj
                this.selStart = new THREE.Vector2(intObj.point.x, intObj.point.z)
                this.areaSelector.startSelection(this.selStart)
            }
        } 
        if (ace3.eventManager.mousePressed() && this.selStart != null) {
            pm.pickActor()
            var pu = pm.pickedActor
            if (pu != null) {
                intObj = pm.intersectedObj
                this.sel = new THREE.Vector2(intObj.point.x, intObj.point.z)
                this.areaSelector.updateArea(this.selStart, this.sel)
            }           
            
        }

        // For the human player when a target is selected, it is the only one.
        if (ace3.eventManager.mouseReleased()) { // 'x'
            pm.pickActor()
            var pu = pm.pickedActor
            //console.log(pu)
            if (pu != null && this.selStart != null) {
                intObj = pm.intersectedObj
                this.selEnd = new THREE.Vector2(intObj.point.x, intObj.point.z)
                //console.log(this.selStart)
                //console.log(this.selEnd)
                if (this.selStart.distanceTo(this.selEnd) < 1) {
                    singleSelect = true
                }else {
                    var changedSel = uSel.selectUnits(this.selStart, this.selEnd)
                    // if (!changedSel) {
                    //     singleSelect = true
                    // }
                }
            }

            if (singleSelect) {
                if (pu != null && GameUtils.isUnit(pu)) {
                    // If the selected unit is controlled by Human i will select the unit
                    if (GameUtils.isHuman(pu)) {
                        uSel.selectSingleUnit(pu)
                    }else if (GameUtils.isCPU(pu)) {
                        if (uSel.selectionActive()) {
                            uSel.selectEnemyForUnits(pu)
                        }
                    }
                }else if (pu != null && pu.getType() == 'PickPlane') {
                    if (uSel.selectionActive()) {
                        var interXZ = this.selEnd //a Vector2 element (x,y) (z ==> y)
                        //console.log(interXZ)
                        var sector = terrain.getSectorByXZCoords(interXZ.x, interXZ.y) //note: it's y because we are using a Vector2
                        if (sector != null && GameUtils.isValidSector(sector)) {
                            var sp = sector.obj.position
                            //console.log(pupos.x + "," + interXZ.x + "," + pupos.z + "," + interXZ.z)
                            if (Math.pow(sp.x - interXZ.x, 2) + Math.pow(sp.z - interXZ.y, 2) < 0.20) {
                                uSel.selectSectorForUnits(sector)
                            }else {
                                uSel.selectPointForUnits(interXZ)
                            }
                        }
                    }
                }
            }

            //in any case i'm resetting the multiselects
            //console.log(this.selStart)
            //console.log(this.selEnd)
            this.areaSelector.endSelection()
            this.selStart = null
            this.selEnd = null
        } // end of mouseReleased
	}
}

function AutomaticGameSingleAI() {
	this.base = ACE3.Logic
	this.base()
	this.run = function() {}
}

function ESCPauseGameLogic() {
	this.base = ACE3.Logic
	this.base()
	this.run = function() {
        if (ace3.eventManager.released(ace3.eventManager.keyCodes.escape)) {
            game_pause()
        }		
	}
}

function ControlPlayerVictoryLogic() {
	this.base = ACE3.Logic
	this.base()	
	this.run = function() {	
        for (var ip in players) {
            if (players[ip].unitCount <= 0) {
                console.log("Player " + players[ip].name + " is dead")
                game_pause()
                break
            }
    	}
	}
}

/**
* Basicly modify the properties of the camera on some conditions.
*/
function CameraLogic() {
    this.base = ACE3.Logic
    this.base()
    this.minHeight = 5
    this.run = function() {
        var cCam = ace3.camera.cameraObj
        var cPiv = ace3.camera.pivot
        var dy = cPiv.position.y - terrain.obj.position.y

        // force the camera to remain to a minimum height
        if (dy < this.minHeight) {
            cPiv.position.y = this.minHeight
            dy = this.minHeight
        }

        // decrease the angle when the camera is near the terrain, and vice - versa
        //- Math.PI/4 max (when near) , -Math.PI/2 min (when far)
        var angle = THREE.Math.clamp(- Math.atan(dy/10), -Math.PI/2, -Math.PI/6)
        //console.log(angle)
        cCam.rotation.x = angle

        //rotation around the pivot when "," or "." are pressed (188, 190)
        var rs = ace3.eventManager.pressed(188) ? 1: 0;
        var rd = ace3.eventManager.pressed(190) ? -1 : 0;
        var r = rs + rd;
        if (r != 0) {
            var nr = cPiv.rotation.y + r * 0.01
            cPiv.rotation.y = THREE.Math.clamp(nr, - Math.PI / 5, Math.PI / 5)

        }


    }
}
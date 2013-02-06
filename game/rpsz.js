// Main file for main operations, settings and all

var ace3 = null
var players = new Array() //associative array for players
var test_logic = null
var gameManager = null // shortcut to ace3.defaultActorManager
var menuManager = null // shortcut to another ActorManager for menus
var chooseMapMenuManager = null 
//var hlSelect = null //actor used to show selected items
//var hlEnemy = null //actor used to show current selected enemy
//var hlSector = null // actor used to show current selected sector
//var selectedUnit = null // currently selected unit in the game
//var unitSelector = null

var mainThemeSound = null

var testShader = null

//useful actor shortcuts
var terrain = null

var game_started = false


function game_init() {
    ace3 = new ACE3()
    ace3.setBGColor(0x000000)
    //ace3.setFog(0.02)
    mainThemeSound = $("#main_theme").get(0)
    mainThemeSound.play()
    gameManager = ace3.defaultActorManager
    //Adjust the pitch of the camera
    camera_reset_position()
    menu_define()
    game_pause()
    //game_play()

}

function camera_reset_position() {
    ace3.camera.cameraObj.rotation.y = 0
    ace3.camera.cameraObj.rotation.z = 0
    ace3.camera.cameraObj.rotation.x = - Math.PI/3
    ace3.camera.pivot.position.set(0, 28, 16)
    ace3.camera.speed = 0.1
}

function game_init_map(map, demoMode) {
    var demoMode = demoMode || false
    var mapProps = loadMap(map)
    //initMapObjects(mapProps)
    // Build the terrain
    terrain = new Terrain(mapProps,5,5)
    //unitSelector = new UnitSelector()
    gameManager.registerActor(terrain)
  
    //Player init
    if (!demoMode) {
        p1 = new Player("mizar", ACE3.Constants.CONTROLLER_HUMAN)
    }else {
        p1 = new Player("mizar", ACE3.Constants.CONTROLLER_CPU)
    }
    p1.color = 0x0000ff
    p2 = new Player ("cpu", ACE3.Constants.CONTROLLER_CPU)
    p2.color = 0xff0000
    players.push(p1)
    players.push(p2)
    
    //build random units for p and p2
    var totalUnits = 4
    if (demoMode) {
        totalUnits = 50
    }

    var posy = terrain.obj.position.y + 1
    var tsx = terrain.totalSizeX
    var tsz = terrain.totalSizeZ
    var tcx = terrain.obj.position.x
    var tcz = terrain.obj.position.z
    for (var i = 0;i < totalUnits; i++) {
        var cp = p1
        if (i % 2 != 0) {
            cp = p2
        }
        var type = THREE.Math.randInt(0, 2)
        var rx = THREE.Math.randInt(0, tsx) - (tsx / 2) - tcx
        var rz = THREE.Math.randInt(0, tsz) - (tsz / 2) - tcz
        rx = THREE.Math.clamp(rx, -tsx/2 + 0.5, tsx/2 - 0.5)
        rz = THREE.Math.clamp(rz, -tsz/2 + 0.5, tsz/2 - 0.5)
        obj = null
        if (type == 0) obj = new Paper()
        else if (type == 1) obj = new Rock()
        else obj = new Scissors()
        // if (obj.getType() == "Scissors" && testSciss == null) {
        //     //testSciss = obj
        // }
        cp.addUnit(obj, rx, posy, rz)
        //make every unit pickable
        if (!demoMode) {
            obj.setPickable()
        }
    }
    


    if (!demoMode) {
        gameManager.registerLogic(new CameraLogic())
        gameManager.registerLogic(new MultiSelectTarget_NoSectors())
        //gameManager.registerLogic(new ControlPlayerVictoryLogic())
    }else {
        gameManager.registerLogic(new CameraDemoLogic())
    }


    gameManager.registerLogic(new ESCPauseGameLogic())

    // nu2 = new Unit2(0,0)
    // nu2.testAttr = "cad"
    // nu2.setColor(0xffffff)
    // gameManager.registerActor(nu2)


    // for (var i = 0; i <= 1000; i++) {
    //     var u2 = new Unit2(THREE.Math.randInt(-20, 20), THREE.Math.randInt(-20, 20))
    //     u2.setColor(THREE.Math.randInt(0,0xffffff))
    //     gameManager.registerActor(u2)
    // }

    // var pa = new ACE3.ParticleActor({particleCount: 150, 
    //                                  color: 0xffffff,
    //                                  size: 0.5,
    //                                  texture: "media/particle.png",
    //                                  spread: 5})
    // pa.obj.position.set(0, 4, 1)
    // for (var pind = 0; pind < pa.particleCount; pind++) {
    //     console.log(pind)
    //     pa.obj.geometry.vertices[pind].velocity = new THREE.Vector3(0, -Math.random() * 0.3, 0);
    // }
    // pa.currentVertex = 0


    // pa.run = function() {
    //     this.obj.rotation.y+=0.00001
    //     var pind = 0
    //     while (pind < this.particleCount) {
    //         var drop = this.obj.geometry.vertices[pind]
    //         drop.addSelf(drop.velocity)
    //         if (drop.y < - 2) {
    //             drop.y = 10
    //         } 
    //         //this.currentVertex = ((this.currentVertex + 1) % this.particleCount)
    //         pind++
    //     }
    //     this.obj.geometry.verticesNeedUpdate = true
    // }

    // gameManager.registerActor(pa)

    //expl = new ACE3.Explosion()
    //gameManager.registerActor(expl)

    //TEST SKYBOX
    //var skyBox = new ACE3.SkyBox("media/sb1-")
    //gameManager.registerActor(skyBox)

    var stars = new ACE3.StellarSky()
    gameManager.registerActor(stars)



}

/**
* Complete reset of the playing game.
*/
function game_destroy_map() {
    
    if (terrain == null)  //I assume that if the terrain was not initialized, there's nothing to reset.
        return  

    gameManager.reset()
    camera_reset_position()
    delete hlSelect
    delete hlEnemy
    delete hlSector

}


function game_run() {
    ace3.run()
}

function game_choose() {
    menuManager.pause()
    chooseMapMenuManager.play()
}

function game_play(map, demoMode) {
    var demoMode = demoMode || false;
    if (map != undefined) {
        game_destroy_map()
        game_init_map(map, demoMode)
    }
    menuManager.pause()
    chooseMapMenuManager.pause()
    gameManager.play()
    game_started = true
}

function game_demo() {
    game_play("Flatlandia", true)
}


function game_pause() {
    gameManager.pause()
    chooseMapMenuManager.pause()
    menuManager.play()
}

function menu_define() {

    var cel = $("#" + ace3.container.id)
    var x = cel.offset().left
    var y = cel.offset().top
    var w = cel.width()
    var h = cel.height()
    var center = { x: (w + x) / 2, y: (h + y) / 2}

    standardBoxStyle = "padding: 5px; border: 5px solid white;"
    standardButtonStyle = {
                            padding: "2px",
                            border: "3px solid white",
                          }
    bgColor = "black"
    fgColor = "white"
    // Main menu definition
    menuManager = new ACE3.PureHTMLActorManager()
    //console.log(menuManager)
    var zIndex = 10
    var bw = 170
    var bh = 300
    var butW = 130
    var butX = center.x - butW / 2
    var mOffset = { x: center.x - bw / 2, y: center.y - bh / 2}
    var box = new ACE3.HTMLBox("RPSZ - Main Menu", "", mOffset.x, mOffset.y, bw, bh, zIndex, fgColor, bgColor)
    box.addStyle(standardBoxStyle);
    var playButton = new ACE3.HTMLButton("NEW GAME", butX, box.y + 40, butW, 20, "game_choose()", zIndex + 1, fgColor, bgColor)
    playButton.css(standardButtonStyle)
    var demoButton = new ACE3.HTMLButton("DEMO", butX, box.y + 80, butW, 20, "game_demo()", zIndex + 1, fgColor, bgColor)
    demoButton.css(standardButtonStyle)
    var tutorialButton = new ACE3.HTMLButton("Tutorial(TODO)", butX, box.y + 120, butW, 20, "", zIndex + 1, fgColor, bgColor)
    tutorialButton.css(standardButtonStyle)
    var optionButton = new ACE3.HTMLButton("OPTIONS(TODO)", butX, box.y + 160, butW, 20, "", zIndex + 1, fgColor, bgColor)
    optionButton.css(standardButtonStyle)
    var  aboutButton= new ACE3.HTMLButton("About(TODO)", butX, box.y + 200, butW, 20, "", zIndex + 1, fgColor, bgColor)
    aboutButton.css(standardButtonStyle)    
    var resumeButton = new ACE3.HTMLButton("RESUME", butX, box.y + 240, butW, 20, "game_play()", zIndex + 1, "black", "yellow")
    resumeButton.css(standardButtonStyle)
    menuManager.registerActor(box)
    menuManager.registerActor(playButton)
    menuManager.registerActor(demoButton)
    menuManager.registerActor(optionButton)
    menuManager.registerActor(tutorialButton)
    menuManager.registerActor(aboutButton) 
    menuManager.registerActor(resumeButton)

    var mainLogic = new ACE3.Logic()
    mainLogic.resumeButton = resumeButton
    mainLogic.run = function() {
        if (game_started) {
            this.resumeButton.show()
        }else {
            this.resumeButton.hide()
        }
    }
    menuManager.registerLogic(mainLogic)
    ace3.actorManagerSet.push(menuManager)

    // Choose Map Menu
    chooseMapMenuManager = new ACE3.PureHTMLActorManager()
    box = new ACE3.HTMLBox("Choose Map", "", mOffset.x, mOffset.y, bw, bh, zIndex, fgColor, bgColor)
    box.addStyle(standardBoxStyle);
    chooseMapMenuManager.registerActor(box)
    var mappedMaps = ["tick-tack-toe", "Flatlandia", "longway"]
    for (var i in mappedMaps) {
        var m = mappedMaps[i]
        var link = "game_play(\"" + m + "\")"
        var mButton = new ACE3.HTMLButton(m, butX, box.y + 40 + i * 40, butW, 20, link, zIndex + 1, fgColor, bgColor)
        mButton.addStyle(standardButtonStyle)
        chooseMapMenuManager.registerActor(mButton)
    }
    var  returnButton= new ACE3.HTMLButton("Cancel", butX, box.y + 200, butW, 20, "game_pause()", zIndex + 1, fgColor, "red")
    returnButton.addStyle(standardButtonStyle)    
    chooseMapMenuManager.registerActor(returnButton)    
    ace3.actorManagerSet.push(chooseMapMenuManager)    

}


GameUtils = {
    /**
    * For many purposes i must control this very often in my code.
    */
    isValidActor: function(actor) {
        return actor != null && actor.alive
    },
    isUnit: function(actor) {
        return actor.typeIn(['Rock', 'Scissors', 'Paper'])    
    },
    isHuman: function(unit) {
        return (unit.owner != null && unit.owner.controller == ACE3.Constants.CONTROLLER_HUMAN)
    },
    isCPU: function(unit) {
        return (unit.owner != null && unit.owner.controller == ACE3.Constants.CONTROLLER_CPU)        
    },
    /**
    * A valid and selectable sector.
    */
    isValidSector: function(sector) {
        return sector.typeIn([/*'FlagSector',*/ 'TowerSector', 'SpawnSector'])
    },
    isAnySector: function(sector) {
        if (sector == null || sector.getSuperClass == undefined) {
            return false;
        }
        return sector.getSuperClass().getType() == 'Sector'  //no need to use 'call'
    },
    isSectorToConquer: function(player, sector) {
        return sector != null && this.isValidSector(sector) && !sector.isOwnedByPlayer(player)
    },
}


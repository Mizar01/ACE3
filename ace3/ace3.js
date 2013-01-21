/**
 * Advanced canvas extension for 3d
 *
 */

/**
* Some useful extensions for javascript
*/

/**
* Add a method to any function to speed up code generation when inheriting.
*/
Function.prototype.extends = function(baseClass, typeName) {
    this.prototype = Object.create(baseClass.prototype)
    this.prototype.constructor = this
    this.prototype.superClass = baseClass.prototype
    this.prototype.type = typeName
}



var _ace3 = null

ACE3 = function() {
    
    if (_ace3 != undefined) {
        throw "ERROR! Sorry. You can't create two instances of ACE3"
    }
    this.created = true
    _ace3 = this
    var self = this //used to access this ace3 instance from inside inner functions.
    this.pickManager = new ACE3.PickManager()
    this.projector = new THREE.Projector();
    
    this.container = document.getElementById("container")
    this.renderer = new THREE.WebGLRenderer()
    this.renderClearColor = 0x000000 // 0xaaaaaa
    this.renderer.setClearColorHex(this.renderClearColor, 1)
    this.scene = null
    this.camera = null
    //this.mouse = { x : 0, y : 0}
    this.screen = {x: 0, y: 0}
    
    this.eventManager = new ACE3.EventManager()
    
    //this.cameraDir = ""
    
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
    this.container.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()
    
    this.camera = new ACE3.Camera(this.container)
    this.camera.pivot.position.set(0, 0, 10)
    this.scene.add(this.camera.pivot)
    
    this.defaultActorManager = new ACE3.ActorManager(this.scene)
    
    this.actorManagerSet = []
    this.actorManagerSet.push(this.defaultActorManager)
    
    //Setting controls of events
    $("body").keydown(function(e) {
        var c=e.keyCode || e.wich;
        self.eventManager.key[c] = "DOWN"
    });
    $("body").keyup(function(e) {
        var c=e.keyCode || e.wich;
        //console.log(c)
        self.eventManager.key[c] = "UP"
    });
    

    $("body").mousedown(function(e) {
        self.eventManager.mouseStatus = "DOWN"
    });
    $("body").mouseup(function(e) {
        self.eventManager.mouseStatus = "UP"
    });
   
    // TODO : for now mouse move is a time consuming operation.
    // He has to be calculated in some other way (Apparently this is IMPOSSIBLE)
    $("body").mousemove(function (e) {
        e.preventDefault()
        //var offset = $(this.container).offset();
        _ace3.screen.x = e.clientX
        _ace3.screen.y = e.clientY
    });

}

ACE3.prototype = {
    constructor: ACE3,
    type: "ACE3",

    setBGColor: function(color) {
        this.renderClearColor = color
        this.renderer.setClearColorHex(this.renderClearColor, 1)
    },

    setFog: function(factor) {
        ace3.scene.fog = new THREE.FogExp2(this.renderClearColor, factor)
    },
    
    /**
     * Get x,y coords of the mouse related to canvas starting from the
     * stored x,y coords of the mouse in the screen.
     */
    getViewportMousePosition: function() {
        var offset = $(this.container).offset();
        var relposx = this.screen.x - offset.left
        var relposy = this.screen.y - offset.top
        var glx = ( relposx / self.container.offsetWidth ) * 2 - 1;
	var gly = - ( relposy / self.container.offsetHeight ) * 2 + 1;
        return {x: glx, y: gly}
    },
    
   
    run: function() {
        //console.log(this.eventManager.pressed(16))
        //this.pickManager.run()
        for (id in this.actorManagerSet) {
            this.actorManagerSet[id].run()  
        }
        this.camera.run()
        this.renderer.render(this.scene, this.camera.cameraObj)
        this.eventManager.resetUpKeys()
        this.eventManager.resetMouseReleased()
        setTimeout("_ace3.run()",10)
    },
    
    /**
     * Returns a three js intersected object
     */
    pick: function() {
        mp = this.getViewportMousePosition()
        var x = mp.x
        var y = mp.y
        //var realCam = new THREE.Object3D()
        //realCam.matrixWorld = this.camera.cameraObj.matrixWorld.getPosition()
        //realCam.matrixWorldRotation = this.camera.cameraObj.matrixRotationWorld.clone()
        var vector = new THREE.Vector3( x, y, 1 )
        this.projector.unprojectVector( vector, this.camera.cameraObj )
        var cp = this.camera.cameraObj.matrixWorld.getPosition().clone()
        var ray = new THREE.Ray( cp, vector.subSelf( cp ).normalize() )
        var intersects = ray.intersectObjects( this.pickManager.pickables )
        return intersects[0]
    },
    
   
}

ACE3.Constants = {
    CONTROLLER_HUMAN : 0,
    CONTROLLER_CPU : 1
}



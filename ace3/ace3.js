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

    //The superClass must be used in a static way
    // example: ACE3.Object.superClass.method.call(instance,params)  
    // DON'T USE superClass with 'this' identifier.
    // Use this.getSuperClass instead
    this.superClass = baseClass.prototype //(USE WITH CAUTION : VERY DANGEROUS)

    this.prototype.type = typeName

    this.prototype.getSuperClass = function() {
        return eval(this.getType() + ".superClass")
    }

}


if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.oRequestAnimationFrame ||
                                window.msRequestAnimationFrame ||
                                function (callback) {
                                  return window.setTimeout(callback, 17 /*~ 1000/60*/);
                                });
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

    var offset = $(this.container).offset()
    var w = $(this.container).width()
    var h = $(this.container).height()
    this.vpOffset = new THREE.Vector2(offset.left, offset.top) //size vector of the viewport
    this.vpSize = new THREE.Vector2(w, h)  // size vector of the viewport

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

    this.time = new ACE3.TimeManager()
    
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
        this.time.run()
        requestAnimationFrame(function() {_ace3.run()})
        for (id in this.actorManagerSet) {
            this.actorManagerSet[id].run()
        }
        this.camera.run()
        this.renderer.render(this.scene, this.camera.cameraObj)
        this.eventManager.resetUpKeys()
        this.eventManager.resetMouseReleased()
        //setTimeout("_ace3.run()",10)
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

    /**
    * Get the position inside the container given the percentage position
    * The recalculation is done everytime we have a refresh
    * Return a THREE.Vector2 
    */
    getPercPos: function(percX, percY) {
        var x = this.vpOffset.x + this.vpSize.x/100 * percX
        var y = this.vpOffset.y + this.vpSize.y/100 * percY
        return new THREE.Vector2(x, y) 
    },
    // TODO : TO FINISH do something when window is resized, like recalculate vpOffset and vpSize
    windowResized: function() {
        var offset = $(this.container).offset()
        var w = $(this.container).width()
        var h = $(this.container).height()
        this.vpOffset = new THREE.Vector2(offset.left, offset.top) //size vector of the viewport
        this.vpSize = new THREE.Vector2(w, h)  // size vector of the viewport
    },



    
   
}

ACE3.Constants = {
    CONTROLLER_HUMAN : 0,
    CONTROLLER_CPU : 1
}



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

// Utility to disables text selection, is annoying for the game
(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);


var _ace3 = null

/**
 * Physijs scene is completely dependent from the status of 
 * defaultActorManager. So it's configured to stop and resume entire physics 
 * effects with stop and play of ace3.defaultActorManager
*/
__ace3_physics_load_scene = function() {
    var scene = new Physijs.Scene;
    scene.addEventListener(
            'update',
            function() {
                //Excluding the call to simulate() will stop 
                //completely any other update event. 
                if (!_ace3.defaultActorManager.paused) {
                    _ace3.scene.simulate( undefined, 1 );
                }
            }
    );
    return scene;
}

__ace3_physics_start = function(ace3scene) {
    ace3scene.simulate();
}
__ace3_physics_resume = function() {
    //Restart of physics simulation with a timestep of 1 fps
    _ace3.scene.simulate(0.0167, 1)
}

ACE3 = function(physicsEnabled, swidth, sheight) {

    this.physicsEnabled = physicsEnabled || false;
    
    if (_ace3 != undefined) {
        throw "ERROR! Sorry. You can't create two instances of ACE3"
    }
    this.created = true
    _ace3 = this
    var self = this //used to access this ace3 instance from inside inner functions.
    this.pickManager = new ACE3.PickManager()
    this.projector = new THREE.Projector();
    
    var w = swidth || 1200
    var h = sheight || 700
    $("body").append("<div id=\"_ace3_container\" style=\"width: " + w + "px; height: " + h + "px; background-color: black;\"> </div>");

    $("body").disableSelection()

    this.container = document.getElementById("_ace3_container")

    var offset = $(this.container).offset()

    this.vpOffset = new THREE.Vector2(offset.left, offset.top) //size vector of the viewport
    this.vpSize = new THREE.Vector2(w, h)  // size vector of the viewport

    this.renderer = new THREE.WebGLRenderer()
    this.renderClearColor = 0x000000 // 0xaaaaaa
    this.renderer.setClearColorHex(this.renderClearColor, 1)
    this.scene = null
    this.camera = null
    this.composer = null
    //this.mouse = { x : 0, y : 0}
    this.screen = {x: 0, y: 0}
    
    this.eventManager = new ACE3.EventManager()
    
    //this.cameraDir = ""
    
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
    this.container.appendChild(this.renderer.domElement)
    if (this.physicsEnabled) {
        this.scene = __ace3_physics_load_scene();
    }else {
        this.scene = new THREE.Scene();
    }
    
    this.camera = new ACE3.Camera(this.container)
    this.camera.pivot.position.set(0, 0, 10)
    this.scene.add(this.camera.pivot)
    
    //The defaultActorManager is entirely associated with the scene.
    //NOTE : if the defaultActorManager pauses, also the physics in the entire scene are paused.
    //This beahaviour is not always desired. Feel free to change the 'update' listener for the scene
    // (see the __ace3_physics_load_scene method)
    this.defaultActorManager = new ACE3.ActorManager(this.scene)
    // Override the default behaviour
    this.defaultActorManager.play = function () {
        this.paused = false
        if (_ace3.physicsEnabled) {
            __ace3_physics_resume()
        }
    }
    
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
    

    $(this.container).mousedown(function(e) {
        self.eventManager.mouseStatus = "DOWN"
    });
    $(this.container).mouseup(function(e) {
        self.eventManager.mouseStatus = "UP"
    });
   
    // TODO : for now mouse move is a time consuming operation.
    // He has to be calculated in some other way (Apparently this is IMPOSSIBLE)
    $(this.container).mousemove(function (e) {
        e.preventDefault()
        //var offset = $(this.container).offset();
        _ace3.screen.x = e.clientX
        _ace3.screen.y = e.clientY
    });

    if (this.physicsEnabled) {
        __ace3_physics_start(this.scene);
    }

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
        var glx = ( relposx / this.container.offsetWidth ) * 2 - 1;
	    var gly = - ( relposy / this.container.offsetHeight ) * 2 + 1;
        return {x: glx, y: gly}
    },

    addPostProcessing: function(type) { 
        //TODO : actually type is not used
        this.composer = new THREE.EffectComposer(this.renderer);
        renderModel = new THREE.RenderPass(this.scene,this.camera.cameraObj);            
        renderModel.renderToScreen = false; 
        this.composer.addPass(renderModel); 
        //var effect10 = new THREE.DotScreenPass(new THREE.Vector2(0,0), 0.5, 0.8); 
        //effect10.renderToScreen = false; 
        //this.composer.addPass(effect10);
        // var effect14 = new THREE.ShaderPass(THREE.HueSaturationShader); 
        // effect14.renderToScreen = true; 
        // this.composer.addPass(effect14);       
        //var effect15 = new THREE.ShaderPass(THREE.ColorifyShader); 
        //effect15.renderToScreen = true; 
        //this.composer.addPass(effect15);
        var effect20 = new THREE.FilmPass();
        effect20.uniforms.grayscale.value = 0
        effect20.renderToScreen = true;
        this.composer.addPass(effect20);
        this.renderer.autoClear = false;

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
        if (this.composer) {
            // this.renderer.clear()
            this.composer.render(0.5)
        }else {
            this.renderer.render(this.scene, this.camera.cameraObj)
        }
        this.eventManager.standardReset()
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
        var ray = new THREE.Raycaster( cp, vector.sub( cp ).normalize() )
        var intersects = ray.intersectObjects( this.pickManager.pickables )
        return intersects[0]
    },

    /**
    * Get the position, value based on the container size, given the percentage
    * The recalculation is done everytime we have a refresh
    * Return a THREE.Vector2 
    */
    getFromRatio: function(percX, percY) {
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
    /**
    * Finds the actor scanning through all the managers.
    * TODO : possible improvements: scan also in subchildren, actually it scans only for
    *        direct children of a manager.
    */
    findActorById: function(actorId) {
        for (idm in this.actorManagerSet) {
            var a = this.actorManagerSet[idm].findActorById(actorId)
            if (a != null) {
                return a
            }
        }
        return null
    },



    
   
}

ACE3.Constants = {
    CONTROLLER_HUMAN : 0,
    CONTROLLER_CPU : 1
}




ACE3.PickManager = function() {
    this.pickables = new Array() //DON'T REMOVE: It's useful during picking process. Array of three js objects
    this.actors = {} //Associative array (three "id" obj -> actor)
                     //If you redefine setPickable for an actor to use any THREE.Object as pickable and different
                     //from the standard obj id of the actor , probably this works. So the
                     //array this.actors does not have to be exactly id -> actor, but (id of some object) -> actor. 
    this.pickedActor = null // store the Actor currently over the mouse
    this.intersectedObj = null
}



//TODO : the new way should be that: 
//       the 3D object is storing a variable like object3D.actorRef set during the creation of the object.
//       so I can pick the object and get instantly the actor referenced. 
//       This involves to create a method in Actor3D object : setObject(mesh) and do it everywhere 
ACE3.PickManager.prototype = {
    constructor: ACE3.ActorManager,
    type: "ACE3.PickManager", 

    addActor: function(actor) {
        var obj = actor.obj;
        if (actor.pickMaster != null) {
            obj = actor.pickMaster;
        }
        this.pickables.push(obj);
        this.actors["" + obj.id] = actor;
    },
    
    removeActor: function(actor) {
        var idToFind = actor.obj.id;
        if (actor.pickMaster != null) {
            idToFind = actor.pickMaster.id;
        }
        for (var pi in this.pickables) {
            if (this.pickables[pi].id == idToFind) {
                this.pickables.splice(pi, 1)
                break
            }
        }
        delete this.actors["" + idToFind]
        // THE REST IS FOR LOGGING PURPOSES
        // if (actor.typeIn(['Rock', 'Paper', 'Scissors'])) {
        //     console.log("Removed player " + actor.owner.name +" type " + actor.getType() +" id " + actor.getId())
        //     var s = ""
        //     for (var i = 0 ; i< this.pickables.length; i++) {
        //         s += this.pickables[i].id + " "
        //     }
        //     console.log(s)
        // }
    },
    
    // TODO : an old implementation makes the pickManager to run
    // at every cycle but this is not always necessary. It must be implemented
    // by a specific logicActor calling ace3pick and storeActorByObject.
    //this.run = function() {
    //    po = _ace3.pick()
    //    this.storeActorByObject(po)
    //}
    //
    
    
    /**
     * set an actor as picked given the correspondent three js Intersect object
     * it stores the first actor under the mouse pointer and the entire intersected object for some
     * purposes (like exact position in the 3d object)
     * if the mouse is not under any pickable object it returns null
     * The previous object stored in pickedActor is clened from every
     * picking status.
     */
    storeActorByObject: function(intersectedObj) {
        if (intersectedObj != undefined && intersectedObj.object != undefined) {
            if (this.pickedActor != undefined) {
                this.pickedActor.picked = false //unsetting the preceding selected object
            }
            this.pickedActor = this.actors["" + intersectedObj.object.id]
            this.pickedActor.picked = true
            this.intersectedObj = intersectedObj

        } else {
            this.pickedActor = null
            this.intersectedObj = null
        }
    },
    
    /**
     * Calculate the object under the mouse, stores it under
     * the mousoverActor variable and returns it.
     */
    pickActor: function() {
        this.storeActorByObject(_ace3.pick())
    },
}


ACE3.Actor = function() {
    this.alive = true // when false, the cleanActor method of the manager will be called
                      // and the remove() function is called.
    this.visible = true //means the object is added to the scene
    this.running = true //means the object is in the running processes
    this.manager = null // the object that is managing this actor.
    this.actorChildren = {} // associative array of children actors ("id" -> actor)
                                     // you must implement the right way to add ids to this vector.
    this.parentActor = null // null only if this actor is not a direct children of another actor.

}

ACE3.Actor.prototype = {
    constructor: ACE3.Actor,
    type: "ACE3.Actor",

    /**
     *Default behaviour of init()
     */
    init: function() {
        //implement it in an extending class
    },

    getId: function() {
        //implement it in an extending class
    },

    /**
    * Default beahaviour for remove()
    * The remove() method should be called by manager
    * You can overwrite this method.
    */
    remove: function() { 
        //implement it in an extending class 
        // console.log("Warning: Called a non implemented remove for " + this.getId())
    },
    
    /**
    * Default beahaviour for removeSelf()
    * The remove() method should be called by manager
    * You can overwrite this method.
    * NOTE: Replaces the Actor.remove method.
    */
    removeSelf: function() {
        //implement it in an extending class 
        // console.log("Warning: Called a non implemented remove for " + this.getId())    
    },

    setForRemoval: function() {
        this.alive = false
    },

    /**
    * I thought about it many times. This method is the real running method 
    * called by the manager. This force every actor to have a basic behaviour 
    * stated once and for all. Furthermore implementing run function will not
    * need this logic, so the developer can concentrate on the single actor logic.
    *
    * Improved version of __run managing dead children
    */
    __run: function() {
        if (this.alive) {
            this.run()
            for (id in this.actorChildren) {
                var c = this.actorChildren[id]
                if (c.alive) {
                    this.actorChildren[id].__run()
                }else {
                    this.removeActor(c)
                }
            }
        }      
    },    
    /**
    * Non extendable static function
    **/
    isAlive: function(actor) {
        return actor != null && actor.alive 
    },
    
    /**
     * run() should be implemented by inheriting objects and should manage only
     * the logic for the single actor. Every children can have its own run method.
     * The logic to managing children is already done in the basic __run() method.
     */
    run: function() {

    },  

    addActor: function(actor) {
        //console.log("superClass.addActor called!")
        this.actorChildren["" + actor.getId()] = actor
        //if the actor was previously attached to a manager it will be detached.
        actor.manager = null
        actor.parentActor = this
    },

    /**
    * New version of removeActor
    * Note : no object is really destroyed during this operation. The child is only detached
    * and is lost every reference inside this actor. But any other reference outside will keep 
    * the child object alive in memory.
    */ 
    removeActor: function(actor) {
        actor.removeSelf()
        actor.parentActor = null
        delete this.actorChildren["" + actor.getId()]
    },

    /**
     * NOTE : coloring can be challenging, because the nature of
     * an actor object can be very different every time. So
     * it's better (and simple) to implement a setColor on
     * a specific actor implementation.
     * 
     * The simplest will be
     *     this.setColor = function(color) {
     *         this.obj.material.color = new THREE.Color(color)
     *     }
     * 
     * 
     */
    setColor: function(color) {},  

    getType: function() {
        return this.type
    },

    typeOf: function(type) {
        return this.type == type
    },

    typeIn: function(typeList) {
        for (tli in typeList) {
            if (this.typeOf(typeList[tli])) {
                return true
            }
        }
        return false
    },
    
    /**
    * Finds the manager in the tree of this actor. The actor in facts can be a children
    * of some other actor.
    */
    getManager: function() {
        if (this.manager == null && this.parentActor == null) {
            return null
        }
        if (this.manager == null) {
            return this.parentActor.getManager()
        }
        return this.manager
    },
    
}
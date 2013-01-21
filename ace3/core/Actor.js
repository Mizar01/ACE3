ACE3.Actor = function() {
    this.alive = true // when false, the cleanActor method of the manager will be called
                      // and the remove() function is called.
    this.visible = true //means the object is added to the scene
    this.running = true //means the object is in the running processes
    this.manager = null // the object that is managing this actor.
    this.actorChildren = {} // associative array of children actors ("id" -> actor)
                                     // you must implement the right way to add ids to this vector.

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
    },

    setForRemoval: function() {
        this.alive = false
    },

    /**
    * I thought about it many times. This method is the real running method 
    * called by the manager. This force every actor to have a basic behaviour 
    * stated once and for all. Furthermore implementing run function will not
    * need this logic, so the developer can concentrate on the single actor logic.
    */
    __run: function() {
        if (this.alive) {
            this.run()
            for (id in this.actorChildren) {
                this.actorChildren[id].__run()
            }
        }      
    },
    

    run: function() {

    },  

    addActor: function(actor) {
        //console.log("superClass.addActor called!")
        this.actorChildren["" + actor.getId()] = actor
    },

    /**
    * Note : no object is really destroyed during this operation. The child is only detached
    * and is lost every reference inside this actor. But any other reference outside will keep 
    * the child object alive in memory.
    */
    removeActor: function(actor) {
        delete this.actorChildren["" + actor.getId()]  // DON'T USE SPLICE, we are not using iterative counts.
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
}
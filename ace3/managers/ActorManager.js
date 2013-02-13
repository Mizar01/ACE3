ACE3.ActorManager = function(scene) {
    this.scene = scene
    this.actors = {} // incremental array (normal)
    this.logics = new Array() // array of logics for the whole actorManager
    
    this.paused = true
}

ACE3.ActorManager.prototype = {
    constructor: ACE3.ActorManager,
    type: "ACE3.ActorManager", 
       
    registerActor: function(actor) {
        actor.manager = this
        actor.init()
        this.actors["" + actor.getId()] = actor 
    },

    unregisterActor: function(actor) {
        var id = "" + actor.getId()
        a = this.actors[id]
        a.remove()
        a.alive = false // can be used if referenced from some other objects to control if it's alive.
        a.manager = null
        delete this.actors[id]
    },

    /**
    * Complete removal of every actor and logic, and status too
    */
    reset: function() {
        this.cleanActors()
        for (var i in this.logics) {
            delete this.logics[i]
        }
        this.actors =  {}
        this.logics = new Array()
        this.paused = true       
    },

    pause: function() {
        this.paused = true
    },
    play: function() {
        this.paused = false
    },

    run: function() {
        if (this.paused)
            return
      
        //for (var i = 0; i < this.actors.length; i++) {
        var deadActorIndexes = new Array()
        for (var id in this.actors) {
            var a = this.actors[id]
            if (a.alive) {
                a.__run()
            }else {
                this.unregisterActor(a)
            }
        }
        //this.cleanActors(deadActorIndexes)

        for (var i in this.logics) {
            if (!this.logics[i].paused)
                this.logics[i].run()
        }
    },

    /**
    * Clean the actors given a list of indexes of dead actors
    * The cleaning must be done sorting the deadActorIndexes array in numerical descending way
    * or we will probably mess with indexes during splicing.
    * NOTE: if deadActorIndexes is undefined the cleaning is total for all actors
    */
    cleanActors: function(deadActorIndexes) {

        if (deadActorIndexes == undefined) {
            deadActorIndexes = new Array()
            for (var index in this.actors) {
                deadActorIndexes.push(index)
            }
        }

        deadActorIndexes.sort(function(a,b) {return b-a;}) //VERY IMPORTANT !!!
        if (deadActorIndexes.length > 0) {
            for (var itemIndex in deadActorIndexes) {
                var a = this.actors[deadActorIndexes[itemIndex]]
                this.unregisterActor(a)
            }
        }
    },

    registerLogic: function(logicActor) {
        this.logics.push(logicActor)
    },

    unregisterLogic: function(logicActor) {
        // TODO
    },

    findActorById: function(actorId) {
        return this.actors["" + actorId]
    },
}
/**
 * This object implements purely a logic for thing to do. It must be
 * registered to an actorManager in order to be executed in each iteration
 */
ACE3.Logic = function() {
    this.paused = false
}

ACE3.Logic.prototype = {
    constructor: ACE3.Logic,
    type: "ACE3.Logic", 
    /**
     * run logic is void , you must implement your own logic overriding this method.
     */
    run: function() {
        // The logic is void , you must implement your own logic overriding this method.
    }
}

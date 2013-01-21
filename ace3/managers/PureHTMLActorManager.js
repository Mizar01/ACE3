/**
* Same as Actor Manager, but used only for pure HTML actors, like menus or HUD.
* HTML Actors inside the game and tied to 3d actors should not be managed by this.
*/
ACE3.PureHTMLActorManager = function() {
    ACE3.ActorManager.call(this)
}
ACE3.PureHTMLActorManager.extends(ACE3.ActorManager,"ACE3.PureHTMLActorManager")

ACE3.PureHTMLActorManager.prototype.pause = function() {
    this.paused = true
    // hide every actor
    for (id in this.actors) {
        this.actors[id].hide()
    }
}

ACE3.PureHTMLActorManager.prototype.play = function() {
    this.paused = false
    // show every actor
    for (id in this.actors) {
        this.actors[id].show()
    }
}

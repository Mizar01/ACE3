/**
* This is a wrapper for the Clock and it stores the elapsed time between frames.
* Actually it can't be used as a contextual timer (so the time is always going on for
* every Actor/Manager, even if they are paused)
*/

ACE3.TimeManager = function() {
	this.clock = new THREE.Clock()  // the THREE clock object for custom uses.
	this.frameTime = this.clock.getElapsedTime() // the time when the current frame is executed
	this.frameDelta = this.clock.getElapsedTime() // the time passed from the previous frame.
}

/**
* This method should be called by ace3 core engine once per frame, so 
* the frameDelta stores exactly the time passed between frames.
*/
ACE3.TimeManager.prototype.run = function() {
	this.frameDelta = this.clock.getDelta()
	this.frameTime = this.clock.getElapsedTime()
}


// TODO : create a new special object called ACE3.Timer used for contextual management of 
// managers. All the actors must read the relative time from their manager, or in other
// ways this can be implemented in every single Actor, so we are completely free to handle 
// the time even for actor children.
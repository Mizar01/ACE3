ACE3.Actor3D = function() {
    ACE3.Actor.call(this)
    this.obj = null
    this.picked = false
    this.pickable = false // true if the object has been added to pickable objects.
}
ACE3.Actor3D.extends(ACE3.Actor, "ACE3.Actor3D")


/**
 *Default behaviour of init()
 */
ACE3.Actor3D.prototype.init = function() {
        this.addToScene()
}

ACE3.Actor3D.prototype.getId = function() {
        return this.obj.id
}

/**
* Default beahaviour for remove()
* The remove() method should be called by manager
* You can overwrite this method.
*/
ACE3.Actor3D.prototype.remove = function() {
    this.removeFromScene()
    this.alive = false
    if (this.pickable) {
        _ace3.pickManager.removeActor(this)
    }
}

ACE3.Actor3D.prototype.setPickable = function() {
    _ace3.pickManager.addActor(this)
    this.pickable = true
}
ACE3.Actor3D.prototype.addToScene = function () {
    _ace3.scene.add(this.obj)
}
ACE3.Actor3D.prototype.removeFromScene = function () {
    _ace3.scene.remove(this.obj)
}

ACE3.Actor3D.prototype.addActor = function(actor) {
    //Nothing is more wrong than this. 
    // this.superClass = Actor if the this object is not an extension of Actor3D
    // if 'this' is a successor of Actor3D this leads to infinite recursion (this.superClass is 'Actor3D' forever)
    ACE3.Actor3D.superClass.addActor.call(this, actor)
    this.obj.add(actor.obj)
}

/**
* Note : no object is really destroyed during this operation. The child is only detached
* and is lost every reference inside this actor. But any other reference outside will keep 
* the child object alive in memory.
*/
ACE3.Actor3D.prototype.removeActor = function(actor) {
    this.obj.remove(actor.obj)
    ACE3.Actor3D.superClass.removeActor.call(this, actor)
}

/**
* It executes the lookAt THREE js implementation, but after 
* the rotation, it revert the X,Z angles
* The concept is to using lookAt but with the y poistion of the current actor.
*/
ACE3.Actor3D.prototype.lookAtXZFixed = function (targetPos) {
    //var angX = this.obj.rotation.x
    //var ang = this.obj.rotation.z
    var pos = new THREE.Vector3( targetPos.x, this.obj.position.y, targetPos.z)
    this.obj.lookAt(pos)
}

/*
* Ignore the y gap between actor positions, and calculate only the xz distance
*/
ACE3.Actor3D.prototype.XZDistanceTo = function (targetActor) {
    targetPos = targetActor.obj.position
    var pos = new THREE.Vector3( targetPos.x, this.obj.position.y, targetPos.z)
    return this.obj.position.distanceTo(pos)
}

ACE3.Actor3D.prototype.setColor = function(color) {
    this.obj.material.color = new THREE.Color(color)
}

ACE3.Actor3D.prototype.hide = function() {
    this.obj.visible = false
}

ACE3.Actor3D.prototype.show = function() {
    this.obj.visible = true
}

    

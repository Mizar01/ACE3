/**
* Notes : the position is really necessary if the owner position is not
* really the starting of the projectiles.
*/
Shot = function(owner, target, position) {
    ACE3.Actor3D.call(this)
    this.owner = owner
    this.ownerType = owner.getType() //I store now the type , because when the bullet collides the owner could be dead
    this.damage = owner.damage
    this.target = target
    this.obj = ACE3.Builder.cube2(.1, .1, .3, 0xffff00)
    this.obj.position = position || owner.obj.position.clone()
    //console.log(this.obj)
    this.lookAtXZFixed(target.obj.position)
    this.collisionDistance = 0.5
    this.speed = 0.5
}
Shot.extends(ACE3.Actor3D, "Shot")

Shot.prototype.run = function() {
    if (this.target == null || this.target.alive == false) {
        this.setForRemoval()
        return
    }
    var d = this.XZDistanceTo(this.target)
    if (d < this.collisionDistance) {
        this.damageTarget()
        this.target = null
        this.setForRemoval()
    }else {
        this.followActor(this.target)
    }
}

Shot.prototype.damageTarget = function() {
    var d = this.damage
    var dinc = + 2
    var t1 = this.ownerType
    var t2 = this.target.getType()
    if (t1 == t2) {
        dinc = 0
    }else if ((t1 == "Rock" && t2 == "Paper") ||
        (t1 == "Paper" && t2 == "Scissors") ||
        (t1 == "Scissors" && t2 == "Rock")) {
        dinc = - 2
    }
    this.target.getDamage(this.damage + dinc)
    // this.target.life -= (this.damage + dinc)       
}

Shot.prototype.followActor = function(actor) {
    this.lookAtXZFixed(actor.obj.position)
    this.obj.translateZ(this.speed)
}


ACE3.Explosion = function(origin) {
    ACE3.ParticleActor.call(this, {
        texture: 'media/particle2.png',
        size: 1.3,
        spread: 0,
        particleCount: 35,
    });
    this.origin = origin || new THREE.Vector3(0, 0, 0)
    this.needReset = true
    this.growSpeed = 0.3
}

ACE3.Explosion.extends(ACE3.ParticleActor, "ACE3.Explosion")

ACE3.Explosion.prototype.reset = function(vec3Pos) {
	this.duration = 0.3
	this.hide()
	var vec3Pos = vec3Pos || this.origin
	this.obj.position.copy(vec3Pos)
	for (var pi = 0; pi < this.particleCount; pi++) {
		var p = this.obj.geometry.vertices[pi]
		p.copy(new THREE.Vector3(0, 0, 0))
		p.direction = ACE3.Math.randVector3(this.growSpeed) // random direction chosen for every particle.
	}
	this.origin.copy(vec3Pos)
	this.refresh()
	this.show()
	this.needReset = false
}

ACE3.Explosion.prototype.run = function() {
	if (this.needReset) {
		this.reset()
	}
	var o = this.origin
	for (var pi = 0; pi < this.particleCount; pi++) {
		var p = this.obj.geometry.vertices[pi]
		p.addSelf(p.direction)
	}
	this.refresh()
	this.duration -= ace3.time.frameDelta
	if (this.duration <= 0) {
		// this.needReset = true
		this.alive = false
	}
}
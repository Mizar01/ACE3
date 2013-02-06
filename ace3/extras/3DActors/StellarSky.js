/**
* Build a sphere-disposed particle system, like a starry sky seen by earth surface.
* The system is slowly rotating (y-rotation)
*/
ACE3.StellarSky = function(origin, radius) {
    ACE3.ParticleActor.call(this, {
        texture: 'media/particle2.png',
        size: 10,
        spread: 0,
        particleCount: 2000,
    });
    this.radius = radius || 2000
    this.origin = origin || new THREE.Vector3(0, 0, 0)
    this.needReset = true
    //this.growSpeed = 0.3
}

ACE3.StellarSky.extends(ACE3.ParticleActor, "ACE3.StellarSky")

ACE3.StellarSky.prototype.reset = function(vec3Pos) {
	//this.duration = 0.3
	this.hide()
	var vec3Pos = vec3Pos || this.origin
	for (var pi = 0; pi < this.particleCount; pi++) {
		var p = this.obj.geometry.vertices[pi]
		p.copy(vec3Pos)
		// TODO : improve the disposition. Right now it's possible to have stars near the origin.
		var mult = ACE3.Math.randVector3(1).multiplyScalar(this.radius) // random direction chosen for every particle.
		p.addSelf(mult)
	}
	this.origin = vec3Pos
	this.refresh()
	this.show()
	this.needReset = false
}

ACE3.StellarSky.prototype.run = function() {
	if (this.needReset) {
		this.reset()
	}
	// TODO : finish to implement rotations.
	//this.obj.rotation.y += 0.0002

}
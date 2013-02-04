ACE3.Ascension = function(origin) {
    ACE3.ParticleActor.call(this, {
        texture: 'media/particle.png',
        size: 1.3,
        spread: 3,
        particleCount: 5,
    });
    this.origin = origin || new THREE.Vector3(0, 0, 0)
    this.needReset = true
}

ACE3.Ascension.extends(ACE3.ParticleActor, "ACE3.Ascension")

ACE3.Ascension.prototype.reset = function() {
	this.hide()
	for (var pi = 0; pi < this.particleCount; pi++) {
		this.resetParticle(this.obj.geometry.vertices[pi])
	}
	this.refresh()
	this.show()
	this.needReset = false
}

ACE3.Ascension.prototype.resetParticle = function(p) {
	p.y = -this.spread/2
	p.x = THREE.Math.randFloatSpread(this.spread)
	p.z = THREE.Math.randFloatSpread(this.spread)
	p.velocity = THREE.Math.randFloat(0.01, 0.05)
	p.velocity = THREE.Math.randFloat(0.01, 0.05)
	return p // this is not really needed as the method operates on an object passed, but may be useful.
}

ACE3.Ascension.prototype.run = function() {
	if (this.needReset) {
		this.reset()
	}
	for (var pi = 0; pi < this.particleCount; pi++) {
		var p = this.obj.geometry.vertices[pi]
		p.y += p.velocity
		if (p.y > this.spread/2) {
			this.resetParticle(p)
		}
	}
	this.refresh()
}
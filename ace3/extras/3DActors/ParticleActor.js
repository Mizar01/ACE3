ACE3.ParticleActor = function(props) {
	ACE3.Actor3D.call(this)

	this.texture = props.texture || null
	this.size = props.size || 10
	this.color = props.color || 0xFFFFFF
	this.particleCount = props.particleCount || 1000
	this.spread = props.spread

    var particles = new THREE.Geometry()
    var pMaterial = null
    if (this.texture != null) {
	    pMaterial = new THREE.ParticleBasicMaterial({color: this.color, size: this.size,
	                        map: THREE.ImageUtils.loadTexture(this.texture),
	                        blending: THREE.AdditiveBlending, transparent: true});
	}else {
	    pMaterial = new THREE.ParticleBasicMaterial({color: this.color, size: this.size})		
	}
    // now create the individual particles
    for(var p = 0; p < this.particleCount; p++) {
        var pX = Math.random() * this.spread * 2 - this.spread
        var pY = Math.random() * this.spread * 2 - this.spread
        var pZ = Math.random() * this.spread * 2 - this.spread
        particle = new THREE.Vector3(pX, pY, pZ);
        // add it to the geometry
        particles.vertices.push(particle);
    }
    // create the particle system
    this.obj = new THREE.ParticleSystem(particles, pMaterial);
}

ACE3.ParticleActor.extends(ACE3.Actor3D, "ACE3.ParticleActor")


/**
* The ParticleActor creates some particles, and the default disposition of them
* is within a box with size given by spread property.
* You must to implement your own reset method to change disposition.
*/
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
        particle = ACE3.Math.randVector3(this.spread)
        particles.vertices.push(particle);
    }
    // create the particle system
    this.obj = new THREE.ParticleSystem(particles, pMaterial);

}
ACE3.ParticleActor.extends(ACE3.Actor3D, "ACE3.ParticleActor")

/**
* Updates geometry of the vertices
*/
ACE3.ParticleActor.prototype.refresh = function() {
    //this.obj.geometry.__dirtyVertices = true;
    this.obj.geometry.verticesNeedUpdate = true
}

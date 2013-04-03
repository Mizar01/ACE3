ACE3.SkyBox = function(texturePrefix, extension) {

	// The skybox is based on the article at http://learningthreejs.com/blog/2011/08/15/lets-do-a-sky/

	var ext = extension || "jpg"

	ACE3.Actor3D.call(this)
	var urls = [ texturePrefix + "posx." + ext, texturePrefix + "negx." + ext,
			     texturePrefix + "posy." + ext, texturePrefix + "negy." + ext,
			     texturePrefix + "posz." + ext, texturePrefix + "negz." + ext ];
	var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	textureCube.format = THREE.RGBFormat;
	var shader = THREE.ShaderLib["cube"];
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	uniforms['tCube'].value = textureCube; // textureCube has been init before
	var material = new THREE.ShaderMaterial({
	    fragmentShader  : shader.fragmentShader,
	    vertexShader    : shader.vertexShader,
	    uniforms    : uniforms,
	    depthWrite: false,
		side: THREE.BackSide
	});
	// build the skybox Mesh 
	this.obj = new THREE.Mesh( new THREE.CubeGeometry( 4000, 4000, 4000, 1, 1, 1), material );
	this.obj.flipSided = true;

}

ACE3.SkyBox.extends(ACE3.Actor3D, "ACE3.SkyBox")
ACE3.Utils = {
    getColorableMesh: function(threeObj) {
        m = threeObj.material
        if (m != undefined)
            if (m.color != undefined) {
                return m
            }
        return null
    },
    /**
     * Get the C code for shader written in the DOM with a specific id
     *
     */
    getShader: function(id) {
        return $("#"+id).text();
    },
    /**
    * Given a color in hex, returns a vec3 array with rgb values betwenn 0.0 and 1.0
    */ 
    getVec3Color: function(hexColor) {
        var c = new THREE.Color(hexColor)
        return new THREE.Vector3(c.r, c.g, c.b)
    },
    /**
    * Builds a standard uniform dictionary with these
    * variables : time(float), resolution(vec2), color(vec3)
    * It is useful for shaders.
    */
    getStandardUniform: function() {
            //Alternate mesh
        return {
                time: { type: "f", value: 1.0 },
                resolution: { type: "v2", value: new THREE.Vector2() },
                color: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
            }
    },
    getStandardShaderMesh: function(uniform, vertexShader, fragmentShader, geometry) {
        var m = new THREE.ShaderMaterial( {
            uniforms: uniform,
            vertexShader: ACE3.Utils.getShader(vertexShader),
            fragmentShader: ACE3.Utils.getShader(fragmentShader),
        });
        return new THREE.Mesh(geometry, m) 
    },
}
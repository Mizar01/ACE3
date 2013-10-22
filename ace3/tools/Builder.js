ACE3.Builder = {
    squareXZ: function(sx, sy, color) {
        var geometry = new THREE.PlaneGeometry(sx, sy)
        var s = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({'color':color}))
        s.rotation.x = - Math.PI/2
        return s
    },
    squareXZWireFrame: function(sx, sy, color) {
        var s = this.squareXZ(sx, sy, color)
        s.material.wireframe = true
        s.material.wireframeLinewidth = 55
        return s
    },
    dot: function(color) {
        var g = new THREE.SphereGeometry(0.01)
        var s = new THREE.Mesh(g, new THREE.MeshBasicMaterial({'color':color}))
        return s
    },
    cube: function(size,color) {
        var g = new THREE.CubeGeometry(size, size, size)
        var s = new THREE.Mesh(g, new THREE.MeshBasicMaterial({'color':color}))
        return s        
    },
    /**
     * Same as cube but with different sizes in every axis
     */
    cube2: function(sizex, sizey, sizez, color) {
        var g = new THREE.CubeGeometry(sizex, sizey, sizez)
        var s = new THREE.Mesh(g, new THREE.MeshBasicMaterial({'color':color}))
        return s
    },
    cylinder: function(radius, height, color, radius2) {
        radius2 = radius2 || radius
        var g = new THREE.CylinderGeometry(radius, radius2, height)
        var s = new THREE.Mesh(g, new THREE.MeshBasicMaterial({'color':color}))
        return s
    },
    sphere: function(radius, color) {
        var g = new THREE.SphereGeometry(radius)
        var s = new THREE.Mesh(g, new THREE.MeshBasicMaterial({'color':color}))
        return s        
    },
    // NOTE : in windows the linewidth doesn't work (see the three js documentation)
    line: function(vec3orig, vec3dest, color, linewidth) {
        var g = new THREE.Geometry();
        g.vertices.push(vec3orig);
        g.vertices.push(vec3dest);
        var m = new THREE.LineBasicMaterial({color: color, linewidth : linewidth});
        var s = new THREE.Line(g, m)
        return s  
    },
    shaderCube: function() {
        var g = new THREE.SphereGeometry(1, 16, 12)
        var attributes = {
          displacement: {
            type: 'f', // a float
            value: [] // an empty array
          }
        };
        var uniforms = {
          amplitude: {
            type: 'f', // a float
            value: 0
          }
        };
        var m = new THREE.ShaderMaterial({
                attributes: attributes,
		uniforms: uniforms,
                vertexShader: _ace3.getShader("test2_vertexShader"),
                fragmentShader: _ace3.getShader("test2_fragmentShader")})
        var s = new THREE.Mesh(g, m)
        
        //Putting some random values in the attributes object
        var verts = s.geometry.vertices;
        var values = attributes.displacement.value;
        for(var v = 0; v < verts.length; v++) {
            values.push(Math.random() * 0.4);
        }
        return s         
    },
    /**
    * Draw squares placed around a pivot point.
    * The size of squares is proportional to nsquares and radius, so to leave a little space
    * between one another.
    * It's rotated to be placed on XZ Plane
    */
    radialSquares: function(radius, nsquares, color, opacity) {
        var p = new THREE.Object3D() //intermediate pivot
        var circ = 2 * Math.PI * radius
        var size = circ / (nsquares * 2)
        for (var i = 0; i < nsquares; i++) {
            angle = i * (Math.PI * 2) / nsquares
            var xp = Math.cos(angle) * radius
            var zp = Math.sin(angle) * radius
            var geometry = new THREE.PlaneGeometry(size, size)
            var sq = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({'color':color}))
            sq.rotation.z = angle
            sq.position.set(xp, zp, 0)
            p.add(sq)
            sq.material.transparent = true
            sq.material.opacity = opacity            
        }
        p.rotation.x = - Math.PI / 2
        var obj = new THREE.Object3D()
        obj.add(p)
        return obj
    }
}

//ACE3.ShaderSnippets = {
//    simpleVertex : "void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}",
//    simpleFragment : "void main() {gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);}"
//}





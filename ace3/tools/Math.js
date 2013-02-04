ACE3.Math = {
    matrix: function(cols, rows) {
        clist = new Array(cols)
        for (var ci = 0; ci < clist.length; ci++) {
          clist[ci] = new Array(rows)
        }
        return clist
    },
    /**
    *   Build a Vector2 object with random values between -spread/2 and spread/2
    */
    randVector2: function(spread) {
        return new THREE.Vector2(THREE.Math.randFloatSpread(spread), THREE.Math.randFloatSpread(spread))
    },
    randVector3: function(spread) {
        return new THREE.Vector3(THREE.Math.randFloatSpread(spread), 
                                THREE.Math.randFloatSpread(spread),
                                THREE.Math.randFloatSpread(spread))
    },
    /**
    *   vec2Start and vec2End are covering a rectangle area. But i don't know what rectangle 
    *   vertices they are representing.
    *   Returns 2 new vector2 that represent the area covered between vec2Start e vec2End
    *   but with the vectors sorted starting from top-left to bottom-right
    *   The returning format is {v2Start: Vector2, v2End: Vector2}
    */
    getSortedCoords: function(vec2Start, vec2End) {
        var vstart = new THREE.Vector2(Math.min(vec2Start.x, vec2End.x),
                                   Math.min(vec2Start.y, vec2End.y))
        var vend = new THREE.Vector2(Math.max(vec2Start.x, vec2End.x),
                                   Math.max(vec2Start.y, vec2End.y))
        return {v2Start: vstart, v2End: vend}
    },
    /**
    *   get the directional vector from the vec3start looking at vec3end.
    *   The result is a vector3 useful. For example you could use it to
    *   add it to the vec3end to get closer/far to vec3Star
    *   Remember that if you have 3d objects you could use the lookAt method,
    *   but this force the object to lose it's original rotations.
    *   The getDirection method prevents any rotation to be modified. 
    */
    getDirection: function(vec3Start, vec3End) {
        var dist = vec3Start.distanceTo(vec3End)
        var dirv = new THREE.Vector3()
        dirv.sub(vec3End, vec3Start)
        return dirv.multiplyScalar(1/dist)
    },
}
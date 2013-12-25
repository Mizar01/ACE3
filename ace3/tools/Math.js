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
    /**
    * Gets a random object from an associative array.
    * TODO : it's not very performant. It scans always the entire array.
    * You can specify a filter property to exclude from the choosing some other objects.
    */
    getRandomObject: function(assocArr, filterProp, filterValue) {
        var limit = -1 || limit
        var ret;
        var c = 0;
        var prop = filterProp || null 
        var val = filterValue || null
        //boolean
        if (val == "true") {
            val = true
        }else if (val == "false") {
            val = false
        }
        for (var key in assocArr) {
            // console.log("assocArray["+ key+ "]["+ prop +"]")
            if ((prop != null && val != null && assocArr[key][prop] == val) ||
                 prop == null) {
                c++ //the increment is done only if the properties are right.
                if (Math.random() < 1/c)     //this is the secret formula.
                   ret = key;
           }
        }
        return assocArr[ret];
    },
    
    /**
    * Get the angle between the projection of two 3d points in the xz plane.
    * It gives the y angle formed by the direction vector between two points.
    * The angle is between -PI and PI.
    */
    getXZAngle : function(p1, p2) {
        // console.log("getXZAngle")
        var xd = p2.x - p1.x
        var zd = p2.z - p1.z
        var res = Math.atan2(-zd, xd)   //The minus is necessary because z axis is reversed.
        // console.log(p1)
        // console.log(p2)
        // console.log("angle:" + res)
        return res
    },
    
    
    /**
    * Return the angle normalized between -PI and PI
    */
    getNormalizedAngle: function(angle) {
        var m = angle % (Math.PI * 2)
        if (m > 0 && m > Math.PI) {
            m -= Math.PI * 2
        }else if (m < 0 && m < -Math.PI) {
            m += Math.PI * 2
        }
        return m
    
    },
    /**
    * get the angle between the distance vector and the xz plane.
    * It gives the pitch of the point p1 while looking at p2.
    * The angle is between -PI and PI.
    */
    getPitchAngle: function(p1, p2) {
        var yd = p2.y - p1.y
        var xzd = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.z - p1.z, 2))
        return Math.atan2(yd, xzd)
    },
    
    /**
    * Returns -1, 0 or 1 (clockwise)
    * The angles must be -PI / PI
    **/
    getAngleDirection: function(a1, a2) {
        // console.log("getAngleDirection")
        //normalize
        a1 = ACE3.Math.getNormalizedAngle(a1)
        a2 = ACE3.Math.getNormalizedAngle(a2)
        var pi = Math.PI
        var d = Math.abs(a2 - a1)
        var diff = a2 - a1
        // console.log("a1:" + a1 + " --- a2:" + a2)
        // console.log("d:" + d + "--- diff:" + diff)
        if (d == 0 || d == Math.PI * 2) {
            // console.log("returning 0")
            return 0
        }else if ((diff > 0 && d > pi) || (diff < 0 && d < pi)) {
            // console.log("returning -1")
            return -1
        }else {
            // console.log("returning 1")
            return 1
        }
    
    },
}


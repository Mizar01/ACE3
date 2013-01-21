ACE3.Math = {
    matrix: function(cols, rows) {
      clist = new Array(cols)
      for (var ci = 0; ci < clist.length; ci++) {
        clist[ci] = new Array(rows)
      }
      return clist
    },
    /**
    * Build a Vector2 object with random values between -spread/2 and spread/2
    */
    randVector2: function(spread) {
        return new THREE.Vector2(THREE.Math.randFloatSpread(spread), THREE.Math.randFloatSpread(spread))
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
}
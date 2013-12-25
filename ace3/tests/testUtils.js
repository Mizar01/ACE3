ACE3.TestUtils = []

ACE3.TestUtils.makeTestCube = function(position, color){
    color = color || 0xffffff
    var obj = ACE3.Builder.cube(1, color)
    obj.position = position
    _ace3.scene.add(obj)

    return obj
}
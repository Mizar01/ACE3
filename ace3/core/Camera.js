ACE3.Camera = function (container) {
    this.pivot = new THREE.Object3D() //is going to be very useful for most uses of camera moving and rotations
    this.cameraObj = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000)
    //this.pivot.add(this.cameraObj)
    this.cameraObj.position = this.pivot.position // AVOID TO MAKE CameraObj as child of Pivot, 
                                                  // they only point to the same postion vector.
    //this.pivot = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000)
    //this.cameraObj = this.pivot
    this.moveUp = false
    this.moveDown = false
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.speed = 2
}

ACE3.Camera.prototype = {
    constructor: ACE3.Camera,
    type: "ACE3.Camera",   
    run: function() {
        this.control()
        var p = this.pivot.position
        var s = this.speed
        if (this.moveUp) p.y += s
        if (this.moveDown) p.y -= s
        if (this.moveForward) p.z -= s
        if (this.moveBackward) p.z += s
        if (this.moveLeft) p.x -= s
        if (this.moveRight) p.x += s       
    },
    /**
     * This sets the defaults keys for the camera
     */
    control: function() {
        var em = _ace3.eventManager
        var kc = em.keyCodes
        this.moveUp = em.pressed(kc.right_shift)
        this.moveDown = em.pressed(kc.right_control)
        this.moveForward = em.pressed(kc.arrow_up)
        this.moveBackward = em.pressed(kc.arrow_down)
        this.moveRight = em.pressed(kc.arrow_right)
        this.moveLeft = em.pressed(kc.arrow_left)
    }, 

    lookAt: function(vec3) {
        this.cameraObj.lookAt(vec3)
    },  
    
    
    
}
/**
* HTML Actors are outside the _ace3_container, so their events are not managed, nor intercepted
* by the eventManager, for many reasons this is useful. 
* An html actor always call it's click function when it's clicked. He has a standard onclick event
* on it, intercepted only by this element alone. No other element can activate this event.
* So it doesn't interfere with object picking. It's like to be on another window, even if visually
* it is drawn on top of the ace3 container.
*/
ACE3.ActorHTML = function() {
    ACE3.Actor.call(this)
    this.obj = null
    this.baseCss = ""
    this.baseClasses = ""
    this.content = ""
    // this.clickReset = true  // if true, the click on this button is the only event fired, because 
                            // the mouse status will be reset. So it's not going to generate 
                            // mess with undeground pickable objects.
                            // TODO : I have yet to think how to implement this.
    this.id = this.getType().replace(/\./gi, "_")  + THREE.Math.randInt(0,999) + THREE.Math.randInt(0,999) //id of the element

    this.onClickFunction = null

    this.onclick = "onclick=\"_ace3.findActorById('" + this.id + "').click()\""

    //this.onmouseover = "onmousedown=\"_ace3.eventManager.ignoreMouseEvent(); console.log('cc')\""

    this.interceptAttrs = this.onclick


}

ACE3.ActorHTML.extends(ACE3.Actor, "ACE3.ActorHTML")


ACE3.ActorHTML.prototype.init = function() {
    this.content = this.buildContent()
    $("body").append(this.content)
    $("#" + this.id).addClass(this.baseClasses)
    $("#" + this.id).css(this.baseCss)
    //this.addClass(this.baseClasses)
    //this.css(this.baseCss)
}

ACE3.ActorHTML.prototype.getId = function() {
    return this.id
}

ACE3.ActorHTML.prototype.hide = function() {
    $("#" + this.id).hide()
}
ACE3.ActorHTML.prototype.show = function() {
    $("#" + this.id).show()
}
ACE3.ActorHTML.prototype.remove = function() {
    $("#" + this.id).remove()
}
ACE3.ActorHTML.prototype.addStyle = function(style) {
    var el = $("#" + this.id)
    if (el[0] != undefined) {
        this.style = el.attr("style") + style
        el.attr("style", this.style) //adding the style to the current DOM element
    }else {
        this.style += style
    }
    //console.log(this.style)
}
ACE3.ActorHTML.prototype.setStyle = function(style) {
    this.style = style
    var el = $("#" + this.id)       
    if (el[0] != undefined) {
        el.attr("style", this.style)   
    }else {
    }
}

/**
* Standard way to build or rebuild the content when needed before adding to DOM. When the content is already added to the DOM
* there's no sense to use this method.
*/
ACE3.ActorHTML.prototype.buildContent = function() {
    return "<div id='" + this.id + "' style='" + this.style + "'> " + this.label + " </div>"
}

/**
* Some jquery shortcuts
* 
* Beware that those methods are ineffective when the actor is not yet initialized.
* If you need something different before adding to DOM use baseCss and baseClass instead
*/
ACE3.ActorHTML.prototype.css = function(name, value) {
    $("#" + this.id).css(name, value)
}
ACE3.ActorHTML.prototype.addClass = function(className) {
    $("#" + this.id).addClass(className)
}
ACE3.ActorHTML.prototype.removeClass = function(className) {
    $("#" + this.id).removeClass(className)
}


// TODO maybe the parameter is not neededs
ACE3.ActorHTML.prototype.click = function(className) {
    // if (this.clickReset) {
    //     // _ace3.eventManager.resetMousePressed()
    //     // _ace3.eventManager.resetMouseReleased()
    //     _ace3.eventManager.forceResetMouse()
    // }
    this.onClickFunction()
}

ACE3.ActorHTML = function() {
    ACE3.Actor.call(this)
    this.obj = null
    this.baseCss = ""
    this.baseClasses = ""
    this.content = ""
    this.id = this.getType().replace(/\./gi, "_")  + THREE.Math.randInt(0,999) + THREE.Math.randInt(0,999) //id of the element
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

/**
 * shows an html div positioned on top,left coords of screen for now
 * TODO : give the coords from the viewport screen.
 */
ACE3.DisplayValue = function(label, defaultValue, vec2pos) {
    ACE3.ActorHTML.call(this)
    this.obj = null
    this.div = null
    this.label = label  // label can be html code
    this.defaultValue = defaultValue
    this.labelId = null //html id of the element
    this.valueId = null //html id of the element
    this.value = defaultValue
    this.pos = vec2pos
    this.separator = ": "
    this.valueFunction = null

    this.baseCss = {
       position: "fixed",
       top: this.pos.y + "px",
       left: this.pos.x + "px",
       /*height: this.height + "px",*/
       /*width: this.width + "px",*/
       zIndex: 10,
       backgroundColor: "gold",
       color: "white",
       borderRadius: "3px",
    }

}

ACE3.DisplayValue.extends(ACE3.ActorHTML, "ACE3.DisplayValue")
    
ACE3.DisplayValue.prototype.buildContent = function() {
    this.labelId = "display_value_actor_label" + this.id
    this.valueId = "display_value_actor_value" + this.id
    var spanLabel = "<span id='" + this.labelId + "'>" + this.label + "</span>"
    var spanValue = "<span id='" + this.valueId + "'>" + this.value + "</span>"
    return "<div id='" + this.getId() + "'>" + spanLabel + this.separator + spanValue + "</div>"
}
    
ACE3.DisplayValue.prototype.setValue = function(value) {
    if (this.value != value) {
        this.value = value
        $("#" + this.valueId).html(value)
    }
}

ACE3.DisplayValue.prototype.run = function() {
  if (this.valueFunction != null) {
      this.setValue(this.valueFunction())
  }
}

/**
 * shows an html div positioned on top,left coords of screen for now
 * TODO : give the coords from the viewport screen.
 */
ACE3.DisplayValue = function(label, defaultValue, x, y) {
    ACE3.ActorHTML.call(this)
    this.obj = null
    this.div = null
    this.label = label
    this.defaultValue = defaultValue
    this.labelId = null //html id of the element
    this.valueId = null //html id of the element
    this.value = defaultValue
}

ACE3.DisplayValue.extends(ACE3.ActorHTML, "ACE3.DisplayValue")
    
ACE3.DisplayValue.prototype.init = function() {
    div_id = "display_value_actor_" + this.id
    $("#" + div_id).remove() //eventually manage this if the element does not exists.
    this.labelId = "display_value_actor_label" + this.id
    this.valueId = "display_value_actor_value" + this.id
    var spanLabel = "<span id='" + this.labelId + "'>" + this.label + "</span>"
    var spanValue = "<span id='" + this.valueId + "'>" + this.value + "</span>"
    var style = "position: fixed; color: white; z-index:10; top:" + y + "px; left:" + x + "px;" +
                "background-color:gold; border-radius: 3px; color: black;"
    this.div = "<div id='" + div_id + "' style='" + style + "'>" +
            spanLabel + " : " + spanValue + "</div>"
    $("body").append(this.div)
   
}
    
ACE3.DisplayValue.prototype.setValue = function(value) {
    if (this.value != value) {
        this.value = value
        $("#" + this.valueId).html(value)
    }
}

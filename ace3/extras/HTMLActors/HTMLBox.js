ACE3.HTMLBox = function(label, text, x, y, w, h, zindex, textColor, backColor) {
    ACE3.ActorHTML.call(this)
    this.x = x 
    this.y = y
    this.width = w
    this.height = h
    this.label = label
    this.text = text
    this.zindex = zindex
    this.textColor = textColor || "white"
    this.backColor = backColor || "blue"
    this.style = "top: " + this.y + "px; left:" + this.x + "px; height:" + this.height + 
                "px; width: " + this.width + "px; position: fixed; z-index:" + this.zindex + ";" +
                "background-color: " + this.backColor + "; color: " + this.textColor + "; border-radius:10px;";
}

ACE3.HTMLBox.extends(ACE3.ActorHTML, "ACE3.HTMLBox")

ACE3.HTMLBox.prototype.buildContent = function() {
    this.label = "<div style='text-align: center; font-weight: bold;'>" + this.label + "</div>"
    return "<div id='" + this.id +"' style='" + this.style + "'> " + this.label + this.text + " </div>" 
}    

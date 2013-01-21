ACE3.HTMLButton = function(label, x, y, width, height, onclick, zindex, textColor, backColor) {
    ACE3.ActorHTML.call(this)
    this.x = x 
    this.y = y
    this.width = width
    this.height = height
    this.label = label
    this.zindex = zindex
    this.center = { x: ( width + x) / 2, y: (height + y) / 2}
    this.onclick = onclick
    this.textColor = textColor || "white"
    this.backColor = backColor || "blue"
    this.style = "top: " + this.y + "px; left:" + this.x + "px; height:" + this.height + 
                    "px; width: " + this.width + "px; position: fixed; z-index:" + this.zindex + ";" +
                    "background-color: " + this.backColor + "; color: " + this.textColor + "; border-radius:10px; text-align:center;" +
                    "cursor: pointer;";
}

ACE3.HTMLButton.extends(ACE3.ActorHTML, "ACE3.HTMLButton")

ACE3.HTMLButton.prototype.buildContent = function() {
    return "<div id='" + this.id + "' onclick='" + this.onclick + "' style='" + this.style + "'> " + this.label + " </div>" 
}

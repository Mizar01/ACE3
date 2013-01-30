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

    this.baseClasses = "ace3_html_button"

    this.baseCss = {
               top: this.y + "px",
               left: this.x + "px",
               height: this.height + "px",
               width: this.width + "px",
               zIndex: this.zindex,
               backgroundColor: this.backColor,
               color: this.textColor,
               borderRadius: "10px",
               border: "3px solid " + this.textColor,
            }
}

ACE3.HTMLButton.extends(ACE3.ActorHTML, "ACE3.HTMLButton")

ACE3.HTMLButton.prototype.buildContent = function() {
    return "<div id='" + this.id + "' onclick='" + this.onclick + "' > " + this.label + " </div>" 
}

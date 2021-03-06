const HSL = function(h = 0, s = 0, l = 0) {
    this.h = h
    this.s = s
    this.l = l
}

HSL.prototype.toString = function(){
    return `hsl(${Math.round(this.h)}, ${Math.round(this.s*100)}%, ${Math.round(this.l*100)}%)`
}

export default HSL
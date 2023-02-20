import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {encURI} from "../../routines/encode-uri.js";
import {md5} from "../../routines/md5.js";
import {panic} from "../../routines/panic.js";
import {Registry} from "../../core/registry.js";

let GravatarDefaultOptions = {
    deferred: 0,
    email: "",
    size: 64,
    default: "mp",
    onCreate: f => f
}

export class Gravatar extends Component {
    image = null
    constructor(elem, options) {
        super(elem, "gravatar", merge({}, GravatarDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.getGravatar()
        }, this.options.deferred)
    }

    createStruct(){
        if (this.elem.tagName !== "IMG") {
            this.element.html(`
                <img/>
            `)
            this.image = this.element.children()
        } else {
            this.image = this.element
        }
    }

    getImagePath(email, size, def = "mp"){
        if (!email.trim()) return ""
        const _def = encURI(def) || '404';
        return "//www.gravatar.com/avatar/" + md5((email.toLowerCase()).trim()) + '?size=' + size + '&d=' + _def;
    }

    getGravatar(){
        const o = this.options
        this.image.attr("src", this.getImagePath(o.email, o.size, o.default))
    }

    email(new_val){
        if (!new_val) return this.options.email
        this.options.email = new_val
        this.getGravatar()
        return this
    }

    size(new_val){
        if (!new_val) return this.options.size
        this.options.size = new_val
        this.getGravatar()
        return this
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-email": {
                this.options.email = newVal
                break
            }
            case "data-size": {
                this.options.size = newVal
                break
            }
        }
        this.getGravatar()
    }
}

Registry.register("gravatar", Gravatar)
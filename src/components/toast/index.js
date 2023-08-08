import "./toast.css"
import {merge, noop, required, exec, undef} from "../../routines";
import {Registry} from "../../core/registry.js";

let ToastDefaultOptions = {
    callback: noop,
    timeout: 3000,
    distance: 20,
    position: "bottom",
    className: ""
};

export class Toast {
    options = null

    constructor(options) {
        if (!undef(globalThis["metroToastSetup"])) {
            ToastDefaultOptions = merge({}, ToastDefaultOptions, globalThis["metroToastSetup"])
        }
        this.options = merge({}, ToastDefaultOptions, options)
    }

    create(message, options = {}){
        const toast = $("<div>").addClass("toast").html(message).appendTo("body")
        const width = toast.outerWidth()

        this.options = merge({}, this.options, options)

        toast.css({
            opacity: 0
        })

        if (this.options.position === "top") {
            toast.addClass("show-top").css({
                top: this.options.distance
            });
        } else {
            toast.css({
                bottom: this.options.distance
            })
        }

        if (this.options.className) {
            toast.addClass(this.options.className)
        }

        toast.css({
            'left': '50%',
            'margin-left': -(width / 2)
        })

        Animation.animate({
            el: toast[0],
            draw: {
                opacity: [0, 1]
            },
            dur: 100,
            onDone: () => {
                setTimeout(()=>{
                    this.#destroy(toast)
                }, this.options.timeout)
            }
        })
    }

    #destroy(toast, cb){
        required(toast)

        Animation.animate({
            el: toast[0],
            draw: {
                opacity: [1, 0]
            },
            dur: 100,
            onDone: () => {
                exec(cb, {
                    message: toast.html()
                })
                toast.remove()
            }
        })
    }
}

globalThis.toast = options => new Toast(options)

Registry.register("toast", Toast)

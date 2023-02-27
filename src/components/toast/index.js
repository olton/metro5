import "./toast.css"
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";
import {required} from "../../routines/required.js";
import {exec} from "../../routines/exec.js";

let ToastDefaultOptions = {
    callback: noop,
    timeout: 3000,
    distance: 20,
    showTop: false
};

const Toast = {
    options: {},

    create(message, options = {}){
        const toast = $("<div>").addClass("toast").html(message).appendTo("body")
        const width = toast.outerWidth()

        this.options = merge({}, ToastDefaultOptions, options)

        toast.css({
            opacity: 0
        })

        if (this.options.showTop === true) {
            toast.addClass("show-top").css({
                top: this.options.distance
            });
        } else {
            toast.css({
                bottom: this.options.distance
            })
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
                    this.remove(toast)
                }, this.options.timeout)
            }
        })
    },

    remove(toast, cb){
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

Metro5.toast = Toast

export {Toast}
import "./notify.css"
import {merge, required, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let NotifyDefaultOptions = {
    width: 220,
    timeout: 5000,
    duration: 200,
    distance: "max",
    ease: "linear",
    canClose: true,
    position: "right"
}

export class Notify {
    options = null
    container = null

    constructor(options) {
        if (!undef(globalThis["metroNotifySetup"])) {
            NotifyDefaultOptions = merge({}, NotifyDefaultOptions, globalThis["metroNotifySetup"])
        }
        this.options = merge({}, NotifyDefaultOptions, options)
        this.#createContainer()
        this.#createEvents()
    }

    #createEvents(){
        this.container.on("click", ".notify__closer", (event) => {
            this.destroy($(event.target).parent()[0])
        })
    }

    #createContainer(){
        let el = $(".notify-container")
        if (el.length) {return el}
        this.container = $("<div>").addClass("notify-container").addClass(`position-${this.options.position}`).appendTo("body")
    }

    create({message, title = "", keepOpen = false, className = ""} = {}){
        required(message, `Empty message for notify!`)

        const o = this.options

        const notify = $("<div>").addClass("notify").css({ width: o.width })

        if (className) {
            notify.addClass(className)
        }

        if (title) {
            $("<div>").addClass("notify__title").html(title).appendTo(notify)
        }

        $("<div>").addClass("notify__message").html(message).appendTo(notify)

        if (o.canClose) {
            $("<span>").addClass("notify__closer").html("╳").appendTo(notify)
        }

        this.container.append(notify)

        const distance = o.distance === "max" || isNaN(o.distance) ? $(window).height() : o.distance

        Animation.animate({
            el: notify[0],
            draw: {
                marginTop: [distance, 0],
                opacity: [0, 1]
            },
            dur: o.duration,
            ease: o.ease,
            onDone: () => {
                setTimeout(() => {
                    if (keepOpen) {
                        return
                    }
                    this.destroy(notify)
                }, o.timeout)
            }
        })
    }

    destroy(notify){
        if (notify) {
            const el = $(notify)
            Animation.animate({
                el: el[0],
                draw: {
                    opacity: [1, 0]
                },
                dur: this.options.duration,
                onDone: () => {
                    el.remove()
                }
            })
        }
    }
}

// Metro5.Notify = new Notify()
Registry.register("notify", Notify)
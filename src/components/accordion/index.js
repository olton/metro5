import "./accordion.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";

let AccordionDefaultOptions = {
    deferred: 0,
    showMarker: true,
    markerPosition: "left",
    singleFrame: true,
    duration: 100,
    frameHeight: 0,
    onFrameOpen: f => f,
    onFrameClose: f => f,
    onBeforeFrameOpen: f => true,
    onBeforeFrameClose: f => true,
    onCreate: f => f
}

export class Accordion extends Component {
    frames = []
    constructor(elem, options = {}) {
        if (typeof globalThis["metroAccordionSetup"] !== 'undefined') {
            AccordionDefaultOptions = merge({}, AccordionDefaultOptions, globalThis["metroAccordionSetup"])
        }
        super(elem, "accordion", merge({}, AccordionDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
            this.fireEvent("create", {})
        }, this.options.deferred)
    }

    createStruct(){
        const o = this.options

        this.element.addClass("accordion")

        if (o.showMarker) {
            this.element.addClass("marker-on")
        }

        $.each(this.element.children(), function(index) {
            const div = $(this)
            const title = div.attr("title") || `Frame ${index+1}`
            const frame = $(`
                <div class="accordion__frame">
                    <div class="accordion__frame__heading">${title}</div>
                    <div class="accordion__frame__content"></div>
                </div>
            `).insertBefore(div)


            const content = frame.find(".accordion__frame__content").append(div)
            const heading = frame.find(".accordion__frame__heading")


            div.attr("title", "")

            if (div.hasClass("active")) {
                frame.addClass("active")
                div.removeClass("active")
                if (o.frameHeight) {
                    content.css({
                        height: o.frameHeight
                    })
                }
            } else {
                content.css({
                    height: 0
                })
            }
        })

        this.frames = this.element.children()
    }

    createEvents(){
        const that = this, el = this.element, o = this.options

        el.on("click", ".accordion__frame__heading", function(e){
            const frame = $(this).closest(".accordion__frame")
            if (frame.hasClass("active")) {
                that.closeFrame(frame)
            } else {
                that.openFrame(frame)
            }
            e.preventDefault()
        })
    }

    openFrame(frame){
        const o = this.options
        const fr = $(frame)

        if (fr.hasClass("active")) return
        if (typeof o.onBeforeFrameOpen === 'function' && !o.onBeforeFrameOpen.apply(this, [fr[0]])) return

        if (o.singleFrame) {
            this.closeAll()
        }

        fr.addClass("active")

        const content = fr.find(".accordion__frame__content")

        Animation.animate({
            el: content[0],
            draw: {
                height: [0, o.frameHeight ? o.frameHeight : content[0].scrollHeight]
            },
            dur: o.duration
        })

        this.fireEvent("frame-open", {
            frame
        })
    }
    closeFrame(frame){
        const o = this.options
        const fr = $(frame)

        if (!fr.hasClass("active")) return
        if (typeof o.onBeforeFrameClose === 'function' && !o.onBeforeFrameClose.apply(this, [fr[0]])) return

        fr.removeClass("active")

        const content = fr.find(".accordion__frame__content")

        Animation.animate({
            el: content[0],
            draw: {
                height: 0
            },
            dur: o.duration
        })

        this.fireEvent("frame-close", {
            frame
        })
    }
    closeAll(){
        const openedFrames = this.element.children(".active")
        openedFrames.each((_, f)=>{
            this.closeFrame(f)
        })
    }
}

Registry.register("accordion", Accordion)
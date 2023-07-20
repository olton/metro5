import "./progress.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";
import {noop} from "../../routines/noop.js";
import {undef} from "../../routines/undef.js";

let ProgressDefaultOptions = {
    value: 0,
    buffer: 0,
    useBuffer: false,
    useLoad: false,
    type: "default", // default, line
    variant: "default", // default, small
    showValue: false,
    valuePosition: "free", // center, free
    showLabel: false,
    labelPosition: "before", // before, after
    labelTemplate: "",
    onValueChange: noop,
    onBufferChange: noop,
    onComplete: noop,
    onBuffered: noop,
}

export class Progress extends Component {
    value = 0
    buffer = 0

    constructor(elem, options) {
        if (!undef(globalThis["metroProgressSetup"])) {
            ProgressDefaultOptions = merge({}, ProgressDefaultOptions, globalThis["metroProgressSetup"])
        }

        super(elem, "progress", merge({}, ProgressDefaultOptions, options));

        this.createStruct()
    }

    createStruct(){
        const element = this.element, o = this.options
        element.clear()
        element.addClass("progress")

        if (o.type === "line") {
            element.addClass("line")
        } else {
            element.append($("<div>").addClass("bar"))

            if (o.useBuffer) {
                element.append($("<div>").addClass("buffer"))
            }
            if (o.useLoad) {
                element.append($("<div>").addClass("load"))
            }
        }

        if (o.variant === "small") {
            element.addClass("small")
        }

        if (o.type !== 'line') {
            const value = $("<span>").addClass("value").appendTo(element);
            if (o.valuePosition === "center") value.addClass("centered");
            if (o.showValue === false) value.hide();
        }

        if (o.showLabel === true) {
            const label = $("<span>").addClass("progress-label").html(o.labelTemplate === "" ? o.value+"%" : o.labelTemplate.replace("%VAL%", o.value));
            if (o.labelPosition === 'before') {
                label.insertBefore(element);
            } else {
                label.insertAfter(element);
            }
        }

        this.val(o.value)
        this.buff(o.buffer)
    }

    val(newVal){
        const element = this.element, o = this.options

        if (o.type === "line") {
            return undefined
        }

        if (undef(newVal)) {
            return this.value
        }

        const value = element.find(".value");
        const bar  = element.find(".bar");

        this.value = parseInt(newVal, 10)

        bar.css("width", this.value + "%");
        value.html(this.value+"%");

        if (o.valuePosition === "free") {
            const diff = element.width() - bar.width()
            const valuePosition = value.width() > diff ? {left: "auto", right: diff + 'px'} : {left: this.value + '%'}
            value.css(valuePosition)
        }

        if (o.showLabel === true) {
            const label = element[o.labelPosition === "before" ? "prev" : "next"](".progress-label");
            if (label.length) {
                label.html(o.labelTemplate === "" ? this.value+"%" : o.labelTemplate.replace("%VAL%", this.value));
            }
        }

        this.fireEvent("ValueChange", {
            value: this.value
        })

        if (this.value === 100) {
            this.fireEvent("Complete")
        }
    }
    buff(newVal){
        const element = this.element, o = this.options

        if (o.type === "line") {
            return undefined
        }

        if (undef(newVal)) {
            return this.value
        }

        const buffer  = element.find(".buffer");

        this.buffer = parseInt(newVal, 10)

        buffer.css("width", this.buffer + "%");

        this.fireEvent("BufferChange", this.buffer)

        if (this.buffer === 100) {
            this.fireEvent("Buffered")
        }
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-value": this.val(newVal); break;
            case "data-buffer": this.buff(newVal); break;
        }
    }

    destroy() {
        super.destroy();
    }
}

Registry.register("progress", Progress)
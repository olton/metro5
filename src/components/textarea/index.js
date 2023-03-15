import "./textarea.css"
import {Component} from "../../core/component.js";
import {merge, noop, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let TextareaDefaultOptions = {
    label: "",
    charsCounter: null,
    charsCounterTemplate: "$1",
    defaultValue: "",
    prepend: "",
    append: "",
    clearButton: true,
    autoSize: true,
    maxHeight: 0,
    onChange: noop,
}

export class Textarea extends Component {
    textarea = null
    fake = null

    constructor(elem, options) {
        if (!undef(globalThis["metroTextareaSetup"])) {
            TextareaDefaultOptions = merge({}, TextareaDefaultOptions, globalThis["metroTextareaSetup"])
        }
        super(elem, "textarea", merge({}, TextareaDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const that = this, element = this.element, elem = this.elem, o = this.options;
        const fakeTextarea = $("<textarea>").addClass("fake-textarea");

        const textarea = element.wrap(
            $("<label>").addClass("textarea")
        )

        fakeTextarea.appendTo(textarea);

        if (!element[0].readOnly && o.clearButton) {
            $("<button>")
                .addClass("button input-clear-button")
                .attr("tabindex", -1)
                .attr("type", "button")
                .appendTo(textarea)
        }

        if (element.attr('dir') === 'rtl' ) {
            textarea.addClass("rtl").attr("dir", "rtl");
        }

        if (o.prepend) {
            $("<div>").html(o.prepend).addClass("prepend").appendTo(textarea);
        }

        if (o.append) {
            const append = $("<div>").html(o.append).addClass("append").appendTo(textarea);
            element.find(".input-clear-button").css({
                right: append.outerWidth() + 4
            });
        }

        if (o.defaultValue && element.val().trim() === "") {
            element.val(o.defaultValue);
        }

        if (o.label) {
            const label = $("<label>").addClass("label-for-input").html(o.label).insertBefore(textarea);
            if (element.attr("id")) {
                label.attr("for", element.attr("id"));
            }
            if (element.attr("dir") === "rtl") {
                label.addClass("rtl");
            }
        }

        if (o.autoSize === true) {
            textarea.addClass("autosize no-scroll-vertical");

            setTimeout(()=>{
                this.resize();
            }, 100);
        }

        fakeTextarea.val(element.val());

        this.textarea = textarea
        this.fake = fakeTextarea
    }

    createEvents(){
        const that = this, element = this.element, o = this.options;
        const chars_counter = $(o.charsCounter);

        this.textarea.on("click", ".input-clear-button", () => {
            element.val(o.defaultValue ? o.defaultValue : "").trigger('change').trigger('keyup');
            element[0].focus()
        });

        if (o.autoSize) {
            element.on("change input propertychange cut paste copy drop keyup", () => {
                this.fake.val(this.elem.value);
                this.resize();
            });
        }

        element.on("blur", ()=>{this.textarea.removeClass("focused");});
        element.on("focus", ()=>{this.textarea.addClass("focused");});

        element.on("keyup", () => {
            if (chars_counter.length) {
                if (chars_counter[0].tagName === "INPUT") {
                    chars_counter.val(this.length());
                } else {
                    chars_counter.html(o.charsCounterTemplate.replace("$1", this.length()));
                }
            }

            that.fireEvent("Change", {
                val: element.val(),
                length: that.length()
            });
        })
    }

    resize(){
        const element = this.element, o = this.options
        const currentHeight = this.fake[0].scrollHeight;

        if (o.maxHeight && currentHeight >= o.maxHeight) {
            this.textarea.removeClass("no-scroll-vertical");
            return ;
        }

        if (o.maxHeight && currentHeight < o.maxHeight) {
            this.textarea.addClass("no-scroll-vertical");
        }

        this.fake[0].style.cssText = 'height:auto;';
        this.fake[0].style.cssText = 'height:' + this.fake[0].scrollHeight + 'px';

        console.log(this.fake[0].value)

        element[0].style.cssText = 'height:' + this.fake[0].scrollHeight + 'px';
    }

    clear(){
        this.element.val("").trigger('change').trigger('keyup').focus();
    }

    toDefault(){
        this.element.val(this.options.defaultValue ? this.options.defaultValue : "").trigger('change').trigger('keyup').focus();
    }

    length(){
        const characters = this.elem.value.split('');
        return characters.length;
    }

    destroy() {
        this.textarea.remove()
    }
}

Registry.register("textarea", Textarea)
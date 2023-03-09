import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {undef} from "../../routines/undef.js";
import {noop} from "../../routines/noop.js";
import {Registry} from "../../core/registry.js";
import {exec} from "../../routines/exec.js";

let InputMaskDefaultOptions = {
    deferred: 0,
    pattern: ".",
    mask: "",
    placeholder: "_",
    editableStart: 0,
    threshold: 300,
    onChar: noop,
}

export class InputMask extends Component {
    placeholder = ""
    mask = ""
    maskArray = []
    pattern = null
    thresholdTimer = null

    constructor(elem, options) {
        if (!undef(globalThis["metroInputMaskSetup"])) {
            InputMaskDefaultOptions = merge({}, InputMaskDefaultOptions, globalThis["metroInputMaskSetup"])
        }
        super(elem, "input-mask", merge({}, InputMaskDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
        }, this.options.deferred)
    }

    createStruct(){
        const element = this.element, o = this.options

        if (!o.mask) {
            throw new Error('You must provide a pattern for masked input.')
        }

        if (typeof o.placeholder !== 'string' || o.placeholder.length > 1) {
            throw new Error('Mask placeholder should be a single character or an empty string.')
        }

        this.placeholder = o.placeholder;
        this.mask = (""+o.mask);
        this.maskArray = this.mask.split("");
        this.pattern = new RegExp("^"+o.pattern+"+$");

        this.value()
    }

    createEvents(){
        const that = this, element = this.element, o = this.options;
        const editableStart = o.editableStart;
        const id = this.element.id()

        const checkEditablePosition = (pos)=>{
            if (pos < editableStart) {
                setPosition(editableStart);
                return false;
            }
            return true;
        }

        const checkEditableChar = (pos)=>{
            return pos < this.mask.length && this.mask.charAt(pos) === this.placeholder;
        }

        const findNextEditablePosition = (pos)=>{
            let i, a = this.maskArray;

            for (i = pos; i <= a.length; i++) {
                if (a[i] === this.placeholder) {
                    return i;
                }
            }
            return pos;
        }

        const findFirstEditablePosition = () => {
            let i, a = this.maskArray;

            for (i = 0; i < a.length; i++) {
                if (a[i] === this.placeholder) {
                    return i;
                }
            }
            return a.length;
        }

        const setPosition = (pos)=>{
            this.elem.setSelectionRange(pos, pos);
        }

        const clearThresholdInterval = ()=>{
            clearInterval(this.thresholdTimer);
            this.thresholdTimer = null;
        }

        element.on("change", ()=>{
            const elem = this.elem
            if (elem.value === "") {
                elem.value = that.mask;
                setPosition(editableStart);
            }
        }, {ns: id});

        element.on("focus click", ()=>{
            setPosition(findFirstEditablePosition())
        }, {ns: id});

        element.on("keydown", (e)=>{
            const elem = this.elem
            const pos = elem.selectionStart;
            const val = elem.value;
            const code = e.code, key = e.key;

            if (code === "ArrowRight" || code === "End") {
                return true;
            } else {
                if (pos >= this.mask.length && (["Backspace", "Home", "ArrowLeft", "ArrowUp"].indexOf(code) === -1)) {
                    // Don't move over mask length
                    e.preventDefault();
                } else if (code === "Home" || code === "ArrowUp") {
                    // Goto editable start position
                    e.preventDefault();
                    setPosition(editableStart);
                } else if (code === "ArrowLeft") {
                    if (pos - 1 < editableStart) {
                        // Don't move behind a editable start position
                        e.preventDefault();
                    }
                } else if (code === "Backspace") {
                    e.preventDefault();
                    if (pos - 1 >= editableStart) {
                        if (checkEditableChar(pos - 1)) {
                            if (elem.value.charAt(pos - 1) !== that.placeholder) {
                                // Replace char if it is not a mask placeholder
                                elem.value = val.substr(0, pos - 1) + that.placeholder + val.substr(pos);
                            }
                        }
                        // Move to prev char position
                        setPosition(pos - 1);
                    }
                } else if (code === "Space") {
                    e.preventDefault();
                    setPosition(pos + 1);
                } else if (!this.pattern.test(key)) {
                    e.preventDefault();
                } else {
                    e.preventDefault();
                    if (checkEditableChar(pos)) {
                        elem.value = val.substr(0, pos) + (o.onChar === noop ? key : exec(o.onChar, [key], this)) + val.substr(pos + 1);
                        setPosition(findNextEditablePosition(pos + 1));
                    }
                }
            }
        }, {ns: id});

        element.on("keyup", function(){
            const el = this;

            clearThresholdInterval();

            that.thresholdTimer = setInterval(function(){
                clearThresholdInterval();
                setPosition(findNextEditablePosition(el.selectionStart));
            }, that.threshold)
        }, {ns: id});

    }

    value(){
        const that = this, elem = this.elem;
        const a = new Array(this.mask.length);
        let val;
        if (!elem.value) {
            elem.value = this.mask;
        } else {
            val = elem.value;
            $.each(this.maskArray, function(i, v){
                if (val[i] !== v && !that.pattern.test(val[i])) {
                    a[i] = that.placeholder;
                } else {
                    a[i] = val[i];
                }
            });
            this.elem.value = a.join("");
        }
    }
}

Registry.register("inputmask", InputMask)
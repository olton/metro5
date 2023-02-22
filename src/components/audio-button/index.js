import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";
import {exec} from "../../routines/exec.js";
import {Registry} from "../../core/registry.js";

let AudioButtonDefaultOptions = {
    volume: 0.5,
    src: "",
    onAudioStart: noop,
    onAudioEnd: noop,
    onCreate: noop
}

export class AudioButton extends Component {
    audio = null
    canPlay = false
    constructor(elem, options) {
        if (typeof globalThis["metroAudioButtonSetup"] !== "undefined") {
            AudioButtonDefaultOptions = merge({}, AudioButtonDefaultOptions, globalThis["metroAudioButtonSetup"])
        }
        super(elem, "audio-button", merge({}, AudioButtonDefaultOptions, options));
        this.createStruct()
        this.createEvents()
        this.fireEvent("create")
    }

    createStruct(){
        const o = this.options
        this.audio = new Audio(o.src)
        this.audio.volume = o.volume
    }

    createEvents(){
        this.audio.addEventListener('loadeddata', () => {
            this.canPlay = true;
        });

        this.audio.addEventListener('ended', () => {
            this.fireEvent("audioEnd", {
                src: this.options.src,
                audio: this.audio
            })
        })

        this.element.on("click", () => {
            this.play();
        }, {ns: this.element.id()});
    }

    play(cb){
        const o = this.options

        if (!this.canPlay) return

        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.play();

        exec(cb, [o.src, this.audio])
    }

    stop(cb){
        const o = this.options

        this.audio.pause();
        this.audio.currentTime = 0;

        exec(cb, [o.src, this.audio])
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-src": {
                this.options.src = newVal
                this.audio.src = newVal
                break
            }
            case "data-volume": {
                this.audio.volume = newVal
                break
            }
        }
    }
}

Registry.register("audiobutton", AudioButton)
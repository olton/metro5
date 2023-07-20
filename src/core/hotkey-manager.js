import {merge} from "../routines/index.js";

let HotkeyManagerDefaultOptions = {

}

const specialKeys = {
    8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
        20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
        37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
        104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
        112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
        120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 188: ",", 190: ".",
        191: "/", 224: "meta"
}

const shiftNums = {
    "~":"`", "!":"1", "@":"2", "#":"3", "$":"4", "%":"5", "^":"6", "&":"7",
        "*":"8", "(":"9", ")":"0", "_":"-", "+":"=", ":":";", "\"":"'", "<":",",
        ">":".",  "?":"/",   "|":"\\"
}

export class HotkeyManager {
    options = null
    hotkeys = []

    constructor(options) {
        this.options = merge({}, HotkeyManagerDefaultOptions, options)
        this.#createEvents()
    }

    #findKey(elem, key){
        for(let b of this.hotkeys) {
            if (b.elem === elem && b.key === key) {
                return b
            }
        }
        return undefined
    }

    #findElement(key){
        const elements = []
        for(let b of this.hotkeys) {
            if (b.key === key) {
                elements.push(b.elem)
            }
        }
        return elements
    }

    register(elem, key, repeat = false){
        const keyExist = this.#findKey(elem, key)
        if (!keyExist) {
            this.hotkeys.push({
                elem,
                key,
                repeat
            })
        }
        return this
    }

    #getModifier(e){
        const m = [];
        if (e.altKey) {m.push("alt");}
        if (e.ctrlKey) {m.push("ctrl");}
        if (e.shiftKey) {m.push("shift");}
        return m;
    }

    #getKey(e){
        let key, k = e.keyCode, char = String.fromCharCode( k ).toLowerCase();
        if( e.shiftKey ){
            key = shiftNums[ char ] ? shiftNums[ char ] : char;
        }
        else {
            key = specialKeys[ k ] === undefined
                ? char
                : specialKeys[ k ];
        }

        return this.#getModifier(e).length ? this.#getModifier(e).join("+") + "+" + key : key;
    }

    #createEvents(){
        document.addEventListener("keydown", (event) => {
            const key = this.#getKey(event)
            const elements = this.#findElement(key)

            if (elements.length === 0) return

            event.preventDefault()

            for(let el of elements) {
                const node = this.#findKey(el, key)
                if (event.repeat && node.repeat === 'false') return
                el.click()
            }
        })
    }
}
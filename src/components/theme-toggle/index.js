import "./theme-toggle.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";

let ThemeToggleDefaultOptions = {
    theme: "auto"
}

const sun  = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgICA8cGF0aCBmaWxsPSIjYWRiYWE5IiBkPSJNIDI0LjkwNjI1IDMuOTY4NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDI0Ljc4MTI1IDQgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDI0IDUgTCAyNCAxMSBBIDEuMDAwMSAxLjAwMDEgMCAxIDAgMjYgMTEgTCAyNiA1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAyNC45MDYyNSAzLjk2ODc1IHogTSAxMC42NTYyNSA5Ljg0Mzc1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAxMC4xNTYyNSAxMS41NjI1IEwgMTQuNDA2MjUgMTUuODEyNSBBIDEuMDAwMSAxLjAwMDEgMCAxIDAgMTUuODEyNSAxNC40MDYyNSBMIDExLjU2MjUgMTAuMTU2MjUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDEwLjc1IDkuODQzNzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDEwLjY1NjI1IDkuODQzNzUgeiBNIDM5LjAzMTI1IDkuODQzNzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDM4LjQzNzUgMTAuMTU2MjUgTCAzNC4xODc1IDE0LjQwNjI1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAzNS41OTM3NSAxNS44MTI1IEwgMzkuODQzNzUgMTEuNTYyNSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMzkuMDMxMjUgOS44NDM3NSB6IE0gMjUgMTUgQyAxOS40ODYgMTUgMTUgMTkuNDg2IDE1IDI1IEMgMTUgMzAuNTE0IDE5LjQ4NiAzNSAyNSAzNSBDIDMwLjUxNCAzNSAzNSAzMC41MTQgMzUgMjUgQyAzNSAxOS40ODYgMzAuNTE0IDE1IDI1IDE1IHogTSA0LjcxODc1IDI0IEEgMS4wMDQzODQ5IDEuMDA0Mzg0OSAwIDAgMCA1IDI2IEwgMTEgMjYgQSAxLjAwMDEgMS4wMDAxIDAgMSAwIDExIDI0IEwgNSAyNCBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgNC45MDYyNSAyNCBBIDEuMDAxMDk4IDEuMDAxMDk4IDAgMCAwIDQuODEyNSAyNCBBIDEuMDA0Mzg0OSAxLjAwNDM4NDkgMCAwIDAgNC43MTg3NSAyNCB6IE0gMzguNzE4NzUgMjQgQSAxLjAwNDM4NDkgMS4wMDQzODQ5IDAgMCAwIDM5IDI2IEwgNDUgMjYgQSAxLjAwMDEgMS4wMDAxIDAgMSAwIDQ1IDI0IEwgMzkgMjQgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDM4LjkwNjI1IDI0IEEgMS4wMDEwOTggMS4wMDEwOTggMCAwIDAgMzguODEyNSAyNCBBIDEuMDA0Mzg0OSAxLjAwNDM4NDkgMCAwIDAgMzguNzE4NzUgMjQgeiBNIDE1IDMzLjg3NSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMTQuNDA2MjUgMzQuMTg3NSBMIDEwLjE1NjI1IDM4LjQzNzUgQSAxLjAwMDEgMS4wMDAxIDAgMSAwIDExLjU2MjUgMzkuODQzNzUgTCAxNS44MTI1IDM1LjU5Mzc1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAxNS4wOTM3NSAzMy44NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDE1IDMzLjg3NSB6IE0gMzQuNjg3NSAzMy44NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDM0LjE4NzUgMzUuNTkzNzUgTCAzOC40Mzc1IDM5Ljg0Mzc1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAzOS44NDM3NSAzOC40Mzc1IEwgMzUuNTkzNzUgMzQuMTg3NSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMzQuODc1IDMzLjg3NSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMzQuNzgxMjUgMzMuODc1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAzNC42ODc1IDMzLjg3NSB6IE0gMjQuOTA2MjUgMzcuOTY4NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDI0Ljc4MTI1IDM4IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAyNCAzOSBMIDI0IDQ1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAyNiA0NSBMIDI2IDM5IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAyNC45MDYyNSAzNy45Njg3NSB6Ii8+Cjwvc3ZnPgo="
const moon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgICA8cGF0aCBkPSJNIDE2IDYgQyAxNS40NDggNiAxNSA2LjQ0OCAxNSA3IEwgMTUgOCBMIDE0IDggQyAxMy40NDggOCAxMyA4LjQ0OCAxMyA5IEMgMTMgOS41NTIgMTMuNDQ4IDEwIDE0IDEwIEwgMTUgMTAgTCAxNSAxMSBDIDE1IDExLjU1MiAxNS40NDggMTIgMTYgMTIgQyAxNi41NTIgMTIgMTcgMTEuNTUyIDE3IDExIEwgMTcgMTAgTCAxOCAxMCBDIDE4LjU1MiAxMCAxOSA5LjU1MiAxOSA5IEMgMTkgOC40NDggMTguNTUyIDggMTggOCBMIDE3IDggTCAxNyA3IEMgMTcgNi40NDggMTYuNTUyIDYgMTYgNiB6IE0gMjguMzEyNSAxMi45Njg3NSBMIDI3IDEzLjE1NjI1IEMgMjAuMTU2IDE0LjEzNTI1IDE1IDIwLjA4NyAxNSAyNyBDIDE1IDM0LjcyIDIxLjI4IDQxIDI5IDQxIEMgMzUuOTExIDQxIDQxLjg2Mjc1IDM1Ljg0NSA0Mi44NDM3NSAyOSBMIDQzLjAzMTI1IDI3LjY4NzUgTCA0MS43MTg3NSAyNy44NzUgQyA0MS4wNTk3NSAyNy45NjkgNDAuNTEgMjggNDAgMjggQyAzMy4zODMgMjggMjggMjIuNjE3IDI4IDE2IEMgMjggMTUuNDkgMjguMDMyIDE0LjkzOTI1IDI4LjEyNSAxNC4yODEyNSBMIDI4LjMxMjUgMTIuOTY4NzUgeiBNIDggMTggQyA3LjQ0OCAxOCA3IDE4LjQ0OCA3IDE5IEMgNi40NDggMTkgNiAxOS40NDggNiAyMCBDIDYgMjAuNTUyIDYuNDQ4IDIxIDcgMjEgQyA3IDIxLjU1MiA3LjQ0OCAyMiA4IDIyIEMgOC41NTIgMjIgOSAyMS41NTIgOSAyMSBDIDkuNTUyIDIxIDEwIDIwLjU1MiAxMCAyMCBDIDEwIDE5LjQ0OCA5LjU1MiAxOSA5IDE5IEMgOSAxOC40NDggOC41NTIgMTggOCAxOCB6Ii8+Cjwvc3ZnPgo="

export class ThemeToggle extends Component {
    image = null
    theme = "light"
    constructor(elem, options) {
        super(elem, 'theme-toggle', merge({}, ThemeToggleDefaultOptions, options) );
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const o = this.options
        this.element.addClass("theme-toggle").html(`<img/>`)
        this.image = this.element.children()
        if (o.theme === "auto") {
            this.theme = $.dark ? "dark" : "light"
        } else {
            this.theme = o.theme === "dark" ? "dark" : "light"
        }
        this.showToggle()
    }

    showToggle(){
        const html = $("html")
        if (this.theme === 'light') {
            html.removeClass("dark-mode")
            this.image.attr("src", moon)
        } else {
            html.addClass("dark-mode")
            this.image.attr("src", sun)
        }
    }

    createEvents(){
        this.element.on("click", ()=>{
            this.theme = this.theme === 'light' ? 'dark' : 'light'
            this.showToggle()
        })
    }

    theme(newVal){
        if (!newVal) return this.theme
        this.theme = newVal === "dark" ? "dark" : "light"
        this.showToggle()
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-theme": {
                this.options.theme = newVal
                this.showToggle()
                break
            }
        }
    }
}

Registry.register("theme-toggle", ThemeToggle)
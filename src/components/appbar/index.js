import "./appbar.css"
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {merge} from "../../routines/merge.js";
import {mediaExist} from "../../routines/media.js";
import {noop} from "../../routines/noop.js";

let AppbarDefaultOptions = {
    deferred: 0,
    expand: false,
    expandPoint: "",
    duration: 100,
    themeToggle: true,
    theme: "auto",
    onMenuOpen: noop,
    onMenuClose: noop,
    onCreate: noop
}

export class Appbar extends Component {
    hamburger = null
    menu = null
    schemeToggle = null
    constructor(elem, options) {
        if (typeof globalThis["metroAppbarSetup"] !== "undefined") {
            AppbarDefaultOptions = merge({}, AppbarDefaultOptions, globalThis["metroAppbarSetup"])
        }
        super(elem, "appbar", merge({}, AppbarDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
            this.fireEvent("create")
        }, this.options.deferred)
    }

    createStruct(){
        const element = this.element, o = this.options
        element.addClass("appbar")

        this.hamburger = element.find(".hamburger")
        if (!this.hamburger.length) {
            this.hamburger = $(`
                <button class="hamburger chevron-down">
                    <span class="line"></span>                
                    <span class="line"></span>                
                    <span class="line"></span>                
                </button>
            `)
            element.append(this.hamburger)
        }

        if (o.themeToggle) {
            this.themeToggle = $(`
                <div class="appbar-item theme-toggle-wrapper">
                    <div data-role="theme-toggle" data-theme="${o.theme}"></div>
                </div>
            `)
            element.append(this.themeToggle)
        }

        this.menu = element.find(".appbar-menu");

        if (this.menu.length === 0) {
            this.hamburger.css("display", "none");
        }

        if (this.hamburger.css('display') === 'block') {
            this.menu.css({height: 0}).addClass("collapsed");
            this.hamburger.removeClass("hidden");
        } else {
            this.hamburger.addClass("hidden");
        }

        if (o.expand === true) {
            element.addClass("appbar-expand");
            this.hamburger.addClass("hidden");
        } else {
            if (o.expandPoint && mediaExist(o.expandPoint)) {
                element.addClass("appbar-expand");
                this.hamburger.addClass("hidden");
                this.menu.css({height: "auto"})
            }
        }
        this.resize()
    }
    createEvents(){
        this.element.on("click", ".hamburger", () => {
            if (this.menu.length === 0) return;
            if (this.menu.hasClass("collapsed")) {
                this.openMenu();
            } else {
                this.closeMenu();
            }
        });

        $(window).on("resize", () => {
            this.resize()
        }, {ns: this.element.id()});
    }

    resize(){
        const o = this.options

        if (o.expand !== true) {
            if (o.expandPoint && mediaExist(o.expandPoint)) {
                this.element.addClass("appbar-expand");
            } else {
                this.element.removeClass("appbar-expand");
            }
        }

        if (this.menu.length === 0) return;

        if (this.hamburger.css('display') !== 'block') {
            this.hamburger.addClass("hidden");
            this.menu.css({
                overflow: "visible",
                height: "auto"
            })
        } else {
            this.hamburger.removeClass("hidden");
            this.menu.css({
                overflow: "hidden",
                height: 0
            })
        }
    }

    openMenu(){
        const o = this.options
        const menu = this.menu[0]
        Animation.animate({
            el: menu,
            draw: {
                height: [0, menu.scrollHeight]
            },
            dur: o.duration,
            onDone: () => {
                this.menu.removeClass("collapsed").css({height: "auto"})
                this.hamburger.addClass("active")
                this.fireEvent("menuOpen")
            }
        })
    }
    closeMenu(){
        const o = this.options
        const menu = this.menu[0]
        this.menu.css({height: menu.scrollHeight})
        Animation.animate({
            el: menu,
            draw: {
                height: [0]
            },
            dur: o.duration,
            onDone: () => {
                this.menu.addClass("collapsed")
                this.hamburger.removeClass("active")
                this.fireEvent("menuClose")
            }
        })
    }
}

Registry.register("appbar", Appbar)
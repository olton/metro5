import "./tabs.css"
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {exec, merge, noop, noop_arg, noop_true} from "../../routines/index.js";

let TabsDefaultOptions = {
    appendButton: true,
    tabsPosition: "left",
    onAppendButtonClick: noop,
    onTabCreate: noop_arg,
    onTabAppend: noop,
    onTabActivate: noop,
    onTabDeactivate: noop,
    onTabBeforeClose: noop_true,
    onTabClose: noop,
}

export class Tabs extends Component {
    constructor(elem, options) {
        super(elem, "tabs", merge({}, TabsDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    #drawCloser(){
        return $("<span>").addClass("tabs__item__closer").html(`<span>✕</span>`)
    }

    #drawAppend(){
        return $("<span>").addClass("tabs__item__add-tab").html(`<span>+</span>`)
    }

    createStruct(){
        const element = this.element, o = this.options

        element.addClass("tabs")
        element.addClass("tabs-position-" + o.tabsPosition)

        const items = element.children("li")

        items.each((index, el) => {
            const $el = $(el), html = $el.html(), active = $el.hasClass("active")

            const tab = this.#createTab({
                caption: html,
                icon: $el.attr("data-icon"),
                image: $el.attr("data-image"),
                canClose: $el.attr("data-close") !== "false"
            })

            if (active) {
                tab.addClass("active")
                exec(o.onTabActivate(tab[0]))
            }

            element.append(tab)

            $el.remove()
        })

        if (o.appendButton) {
            element.append( this.#drawAppend() )
        }
    }

    createEvents(){
        const that = this, element = this.element, o = this.options

        element.on("click", ".tabs__item__closer", (e) => {
            const tab = $(e.target).closest(".tabs__item")

            e.preventDefault()
            e.stopPropagation()

            if (!o.onTabBeforeClose(tab[0])) {
                return
            }

            if (tab.hasClass("active")) {
                const prev = tab.prev(".tabs__item"), next = tab.next(".tabs__item")
                if (prev.length) {
                    that.#activateTab(prev[0])
                } else if (next.length) {
                    that.#activateTab(next[0])
                } else {
                    // Do nothing
                }
            }

            that.#closeTab(tab[0])
        })

        element.on("click", ".tabs__item", (e) => {
            const tab = $(e.target).closest(".tabs__item")

            e.preventDefault()
            e.stopPropagation()

            if (tab.hasClass("active")) {
                return
            }

            that.#activateTab(tab[0])
        })

        element.on("click", ".tabs__item__add-tab", (e)=>{
            e.preventDefault()
            e.stopPropagation()

            exec(o.onTabAppend, [element[0]])
        })
    }

    #closeTab(tab){
        this.options.onTabClose(tab)
        $(tab).remove()

        return this
    }

    #activateTab(tab){
        const element = this.element, o = this.options

        element.find(".tabs__item").each((index, el)=>{
            const t = $(el)
            if (t.hasClass("active")) {
                o.onTabDeactivate(el)
                t.removeClass("active")
            }
        })

        $(tab).addClass("active")
        o.onTabActivate(tab)

        return tab
    }

    #createTab({caption, icon, image, canClose}){
        const item = $("<li>").addClass("tabs__item")

        if (icon || image) {
            item.append(
                $("<span>")
                    .addClass("tabs__item__icon")
                    .html(icon ? `<span class="${icon}">` : `<img src="${image}" alt="">`)
            )
        } else {
            item.addClass("no-icon")
        }

        item.append( $("<span>").addClass("tabs__item__caption").html(caption) )

        if (!canClose) {
            item.addClass("no-closer")
        }
        else {
            item.append( this.#drawCloser() )
        }

        return this.options.onTabCreate(item)
    }

    addTab(caption, icon, image, canClose = true){
        const element = this.element, o = this.options
        const appendButton = element.children(".tabs__item__add-tab")
        const tab = this.#createTab({caption, icon, image, canClose})

        if (appendButton.length) {
            tab.insertBefore(appendButton)
        } else {
            element.append(tab)
        }

        o.onTabAppend(tab[0])

        return this
    }

    getActiveTab(){
        return this.element.children(".active")
    }

    getActiveTabIndex(){
        return this.element.children(".active").index()
    }
}

Registry.register("tabs", Tabs)
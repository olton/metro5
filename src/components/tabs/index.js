import "./tabs.css"
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {exec, merge, noop, noop_arg, noop_true} from "../../routines/index.js";

Registry.required("dropdown")

let TabsDefaultOptions = {
    appendButton: true,
    tabsPosition: "left",
    customButtons: null,
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
        this.tabs = []
        this.invisibleTabsHolderToggle = null
        this.invisibleTabsHolderPlugin = null
        this.createStruct()
        this.createEvents()
    }

    #drawCloser(){
        return $("<span>").addClass("tabs__item__closer").html(`<span>✕</span>`)
    }

    createStruct(){
        const element = this.element, o = this.options

        this.component = $("<div>").addClass("tabs__container").insertBefore(element)

        element.addClass("tabs").appendTo(this.component)
        element.addClass("tabs-position-" + o.tabsPosition)

        const items = element.children("li:not(.tabs__custom)")

        let activeTabExists = false

        items.each((index, el) => {
            const $el = $(el), html = $el.html(), active = $el.hasClass("active")

            const tab = this.#createTab(html, $el.attr("data-icon"), $el.attr("data-image"), $el.attr("data-close") !== "false", $el.attr('data-data'))

            if (active) {
                activeTabExists = true
                tab.addClass("active")
                exec(o.onTabActivate, [tab[0]])
            }

            element.append(tab)
            exec(o.onTabAppend, [tab[0]])

            $el.remove()
        })

        if (!activeTabExists) {
            const tab = this.element.children(".tabs__item").first()
            tab.addClass("active")
            exec(o.onTabActivate, [tab[0]])
        }

        if (o.appendButton) {
            element.append( $("<li>").addClass("tabs__append").html(`<span class="tabs__service-button tabs__append-button">+</span>`) )
        }

        const serviceContainer = $("<li>").addClass("tabs__service").appendTo(element)
        serviceContainer.append(
            $("<div>").addClass("tabs__service-button").html(`
                        <span class="icon-chevron-down dropdown-toggle"></span>
                        <ul class="dropdown-menu tabs__invisible_tab_holder"></ul>
                    `)
        )
        this.invisibleTabsHolderToggle = serviceContainer.find(".tabs__service-button")
        this.invisibleTabsHolderPlugin = Metro5.makePlugin(serviceContainer.find(".tabs__invisible_tab_holder")[0], "dropdown", {
            onDropdown: el => {
                const toggleRect = this.invisibleTabsHolderToggle[0].getBoundingClientRect()
                $(el).css({
                    top: toggleRect.y + toggleRect.height + 10,
                    left: toggleRect.x - $(el).width() + toggleRect.width + 4
                })
            }
        })
        this.invisibleTabsHolderToggle.hide()

        this.#organizeTabs()
    }

    createEvents(){
        const that = this, element = this.element, o = this.options

        this.component.find(".tabs__item__closer").on("click", (e) => {
            const tab = $(e.target).closest(".tabs__item")
            const parent = tab.closest("ul")

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
                } else if (parent.hasClass("tabs__invisible_tab_holder") && parent.children(".tabs__item").length === 1) {
                    if (element.children(".tabs__item").length) {
                        that.#activateTab(element.children(".tabs__item").last()[0])
                    }
                }
            }

            that.#closeTab(tab[0])

            if (parent.hasClass("tabs__invisible_tab_holder") && parent.children(".tabs__item").length === 0) {
                this.invisibleTabsHolderPlugin.close()
                this.invisibleTabsHolderToggle.hide()
            }
        })

        this.component.find(".tabs__item").on("click", (e) => {
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

        $(window).on("resize", (e)=>{
            const toggleRect = this.invisibleTabsHolderToggle[0].getBoundingClientRect()
            this.invisibleTabsHolderPlugin.element.css({
                top: toggleRect.y + toggleRect.height + 10,
                left: toggleRect.x - this.invisibleTabsHolderPlugin.element.width() + toggleRect.width + 4
            })
            this.#organizeTabs()
        })
    }

    #organizeTabs(){
        const element = this.element
        const tabsWidth = this.elem.getBoundingClientRect().width
        const holder = this.invisibleTabsHolderPlugin.element
        const addTabButton = element.find(".tabs__append")

        holder.children(".tabs__item").each((index, el)=>{
            const tab = $(el)

            if (addTabButton.length) {
                tab.insertBefore(addTabButton)
            } else {
                tab.appendTo(element)
            }
        })

        element.children(".tabs__item").each((index, el)=>{
            const tab = $(el)
            const tabRect = el.getBoundingClientRect()
            if (tabRect.left + tabRect.width + 50 > tabsWidth) {
                tab.appendTo(holder)
            }
        })

        if (holder.children().length) {
            this.invisibleTabsHolderToggle.show(function(){
                $(this).css({
                    display: "flex"
                })
            })
        } else {
            this.invisibleTabsHolderToggle.hide()
        }

        this.invisibleTabsHolderPlugin.close()
    }

    #closeTab(tab){
        exec(this.options.onTabClose, [$(tab)])
        $(tab).remove()

        this.#organizeTabs()

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
        exec(o.onTabActivate, [$(tab)[0]])

        return this
    }

    #createTab(caption, icon, image, canClose, data){
        const item = $("<li>").addClass("tabs__item")

        if (icon || image) {
            item.append(
                $("<span>")
                    .addClass("tabs__item__icon")
                    .html(icon ? `<span class="${icon}">` : `<img src="${image}" alt="">`)
            )
        }

        item.append( $("<span>").addClass("tabs__item__caption").html(caption) )

        if (canClose)  {
            item.append( this.#drawCloser() )
        }

        item.data(data)

        exec(this.options.onTabCreate, [$(item)[0]])

        return item
    }

    addTab(caption, icon, image, canClose = true, data){
        const element = this.element, o = this.options
        const appendButton = element.children(".tabs__item__add-tab")
        const tab = this.#createTab(caption, icon, image, canClose, data)

        if (appendButton.length) {
            tab.insertBefore(appendButton)
        } else {
            element.append(tab)
        }

        this.#organizeTabs()

        exec(o.onTabAppend, [tab[0]])

        return this
    }

    getActiveTab(){
        return this.component.find(".tabs__item.active")[0]
    }

    getActiveTabIndex(){
        return this.component.find(".tabs__item").index(".active", false)
    }

    getTabByIndex(index){
        return this.component.find(".tabs__item").get(index)
    }

    getTabByTitle(caption){
        if (!caption) {
            return undefined
        }
        const tabs = this.component.find(".tabs__item")
        for(let tab of tabs) {
            if ($(tab).find(".caption").html() === caption) {
                return tab
            }
        }
        return undefined
    }

    setTab(el, {caption, icon, image, data}){
        const tab = $(el)

        if (caption) tab.find(".tabs__item__caption").html(caption)
        if (icon) tab.find(".tabs__item__icon > span").clearClasses().addClass(icon)
        if (image) tab.find(".tabs__item__icon > img").attr("src", image)

        tab.data(data)

        return this
    }

    destroy() {
        this.component.remove()
    }
}

Registry.register("tabs", Tabs)
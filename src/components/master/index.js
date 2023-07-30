import "./master.css"
import {Component} from "../../core/component.js";
import {exec, merge, noop, noop_true, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let MasterDefaultOptions = {
    locale: "en-US",
    clsHelpButton: "",
    clsPrevButton: "",
    clsNextButton: "",
    clsFinishButton: "",
    titleHelpButton: "",
    titlePrevButton: "",
    titleNextButton: "",
    titleFinishButton: "",
    onLeavePage: noop,
    onEnterPage: noop,
    onBeforeLeavePage: noop_true,
    onBeforeEnterPage: noop_true,
    onHelp: noop,
    onNext: noop,
    onPrev: noop,
    onFinish: noop,
}

const MASTER_ACTION_INIT = 0;
const MASTER_ACTION_NEXT = 1;
const MASTER_ACTION_PREV = 2;

export class Master extends Component {
    pages = null
    page = 0
    action = MASTER_ACTION_INIT

    constructor(elem, options) {
        if (!undef(globalThis["metroMasterSetup"])) {
            MasterDefaultOptions = merge({}, MasterDefaultOptions, globalThis["metroMasterSetup"])
        }
        super(elem, "master", merge({}, MasterDefaultOptions, options))
        this.#createStruct()
        this.#createEvents()
    }

    #createStruct(){
        const element = this.element, o = this.options
        const locale = Metro5.getLocale(o.locale, "buttons")

        this.pages = element.find(".master__page")

        // Add actions
        const masterActions = $("<div>").addClass("master__actions").appendTo(element)
        const actions = ["help", "prev", "next", "finish"]

        actions.map((v) => {
            this[`${v}Button`] = $("<button>")
                .addClass(`button master__btn-${v}`)
                .addClass(o[`cls${string(v).capitalize()}Button`])
                .html(locale[v])
                .appendTo(masterActions)

            if (o.titleHelpButton && v === "help") this[`${v}Button`].html(o.titleHelpButton)
            if (o.titleFinishButton && v === "finish") this[`${v}Button`].html(o.titleFinishButton)
            if (o.titlePrevButton && v === "prev") this[`${v}Button`].html(o.titlePrevButton)
            if (o.titleNextButton && v === "next") this[`${v}Button`].html(o.titleNextButton)
        })

        //
        this.#showPage()
    }

    #current(){
        return this.pages[this.page]
    }

    #prev(){
        return this.action === MASTER_ACTION_NEXT ? $(this.pages[this.page - 1]) :  $(this.pages[this.page + 1])
    }

    #showPage(){
        const element = this.element, o = this.options

        this.pages.hide()

        if (this.action !== MASTER_ACTION_INIT) {
            exec(o.onLeavePage, [this.page + 1, this.#prev()], this.#prev())
        }

        $(this.#current()).show(() => {
            exec(o.onEnterPage, [this.page + 1, this.#current()], this.#current())
        })

        if (this.page < this.pages.length - 1) {
            this['finishButton'].disable()
        } else {
            this['finishButton'].enable()
        }

        if (this.page === 0) {
            this['prevButton'].disable()
        } else {
            this['prevButton'].enable()
        }

        if (this.page === this.pages.length - 1) {
            this['nextButton'].disable()
        } else {
            this['nextButton'].enable()
        }
    }

    #createEvents(){
        const element = this.element, o = this.options

        element.on("click", ".master__btn-help", (event) => {
            event.preventDefault()
            exec(o.onHelp, [this.page + 1, this.#current()], this.#current())
        })

        element.on("click", ".master__btn-prev", (event) => {
            event.preventDefault()

            if (this.page === 0) {
                return
            }

            this.action = MASTER_ACTION_PREV
            this.page--

            exec(o.onBeforeEnterPage, [this.page + 1, this.#current()], this.#current())

            exec(o.onPrev, [this.page + 1, this.#current()], this.#current())

            this.#showPage()
        })

        element.on("click", ".master__btn-next", (event) => {
            event.preventDefault()

            if (this.page === this.pages.length - 1) {
                return
            }

            if (exec(o.onBeforeLeavePage, [this.page + 1, this.#current()], this.#current()) === false) {
                return
            }

            this.action = MASTER_ACTION_NEXT
            this.page++

            exec(o.onBeforeEnterPage, [this.page + 1, this.#current()], this.#current())

            exec(o.onNext, [this.page + 1, this.#current()], this.#current())

            this.#showPage()
        })

        element.on("click", ".master__btn-finish", (event) => {
            event.preventDefault()
            exec(o.onFinish, [this.page + 1, this.#current()], this.#current())
        })
    }
}

Registry.register("master", Master)
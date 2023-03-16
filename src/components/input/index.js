import "./input.css"
import {Component} from "../../core/component.js";
import {exec, isObjectType, merge, noop, objectLength, to_array, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";
import {GlobalEvents} from "../../core/global-events.js";

export const KEY_CONTROL_CODES = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    BREAK: 19,
    CAPS: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    COMMA: 188
}

let InputDefaultOptions = {
    label: "",

    autocomplete: null,
    autocompleteUrl: null,
    autocompleteUrlMethod: "GET",
    autocompleteUrlKey: null,
    autocompleteListHeight: 200,

    history: false,
    historyPreset: "",
    preventSubmit: false,
    defaultValue: "",
    size: "default",
    margin: "",
    padding: "",
    prepend: "",
    append: "",
    searchButton: false,
    clearButton: true,
    revealButton: true,
    customButtons: [],
    searchButtonClick: 'submit',

    onAutocompleteSelect: noop,
    onHistoryChange: noop,
    onHistoryUp: noop,
    onHistoryDown: noop,
    onClearClick: noop,
    onRevealClick: noop,
    onSearchButtonClick: noop,
    onEnterClick: noop,
}

export class Input extends Component {
    history = []
    autocomplete = []
    historyIndex = -1
    autocompleteList = null
    input = null

    constructor(elem, options) {
        if (!undef(globalThis["metroInputSetup"])) {
            InputDefaultOptions = merge({}, InputDefaultOptions, globalThis["metroInputSetup"])
        }
        super(elem, "input", merge({}, InputDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options
        const input = element.wrap(
            $("<label>").addClass("input")
        )

        if (element.attr("type") === undefined) {
            element.attr("type", "text");
        }

        if (element.attr('type') === 'password') {
            element.attr("autocomplete", "on")
        }

        if (o.historyPreset) {
            $.each(to_array(o.historyPreset, "|"), (_, el) => {
                this.history.push(el);
            });
            this.historyIndex = this.history.length - 1;
        }

        const buttonsGroup = $("<div>").addClass("button-group").appendTo(input)

        if (element.val().trim() === "") {
            element.val(o.defaultValue);
        }

        if (o.clearButton && !element[0].readOnly) {
            $("<button>").addClass("button input-clear-button").attr("tabindex", -1).attr("type", "button").html("&#x2715;").appendTo(buttonsGroup)
        }
        if (element.attr('type') === 'password' && o.revealButton) {
            $("<button>").addClass("button input-reveal-button").attr("tabindex", -1).attr("type", "button").html("&#x1F441;").appendTo(buttonsGroup)
        }
        if (o.searchButton === true) {
            $("<button>").addClass("button input-search-button").attr("tabindex", -1).attr("type", o.searchButtonClick === 'submit' ? "submit" : "button").html("<span class='icon-search'>").appendTo(buttonsGroup);
        }

        if (o.prepend) {
            $("<div>").html(o.prepend).addClass("prepend").appendTo(input);
        }
        if (o.append) {
            $("<div>").html(o.append).addClass("append").appendTo(input);
        }

        if (typeof o.customButtons === "string") {
            o.customButtons = isObjectType(o.customButtons);
        }
        if (typeof o.customButtons === "object" && objectLength(o.customButtons)) {
            $.each(o.customButtons, (_, item)=>{
                const customButton = $("<button>");

                customButton
                    .addClass("button input-custom-button")
                    .addClass(item.className)
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .html(item.html);

                if (item.attr && typeof item.attr === 'object') {
                    $.each(item.attr, function(k, v){
                        customButton.attr(string(k).dashedName().value, v);
                    });
                }

                customButton.data("action", item.onclick).appendTo(buttonsGroup);
            });
        }

        if (element.attr('data-exclaim')) {
            input.attr('data-exclaim', element.attr('data-exclaim'));
        }

        if (element.attr('dir') === 'rtl' ) {
            input.addClass("rtl").attr("dir", "rtl");
        }

        if (o.size !== "default") {
            input.css({
                width: o.size,
            });
        }
        if (o.margin) {
            input.css({
                margin: o.margin,
            });
        }
        if (o.padding) {
            input.css({
                padding: o.padding,
            });
        }

        if (o.label) {
            const label = $("<label>").addClass("label-for-input").html(o.label).insertBefore(input);
            if (element.attr("id")) {
                label.attr("for", element.attr("id"));
            }
            if (element.attr("dir") === "rtl") {
                label.addClass("rtl");
            }
        }

        if (!undef(o.autocomplete) || !undef(o.autocompleteUrl)) {
            this.autocompleteList = $("<div>").addClass("autocomplete-list").css({
                maxHeight: o.autocompleteListHeight,
                display: "none"
            }).appendTo(input);
        }

        if (o.autocomplete) {
            const autocomplete_obj = isObjectType(o.autocomplete);

            if (autocomplete_obj !== false) {
                this.autocomplete = autocomplete_obj;
            } else {
                this.autocomplete = to_array(o.autocomplete, "|");
            }
        }

        if (o.autocompleteUrl) {
            fetch(o.autocompleteUrl, {
                method: o.autocompleteUrlMethod
            }).then((response) => {
                return response.text()
            }).then((data) => {
                let newData = [];

                try {
                    newData = JSON.parse(data);
                    if (o.autocompleteUrlKey) {
                        newData = newData[o.autocompleteUrlKey];
                    }
                } catch (e) {
                    newData = data.split("\n");
                }

                this.autocomplete = this.autocomplete.concat(newData);
            });
        }

        this.input = input
    }

    createEvents(){
        const that = this, element = this.element, o = this.options;

        this.input.on("click", ".input-clear-button", () => {
            const curr = element.val();
            element.val(o.defaultValue ? o.defaultValue : "").fire('clear').fire('change').fire('keyup')[0].focus();
            if (this.autocompleteList) {
                this.autocompleteList.css({
                    display: "none"
                })
            }

            that.fireEvent("clearClick", {
                prev: curr,
                val: element.val()
            });
        });

        this.input.on("click", ".input-reveal-button", () => {
            if (element.attr('type') === 'password') {
                element.attr('type', 'text');
            } else {
                element.attr('type', 'password');
            }

            this.fireEvent("revealClick", {
                val: element.val()
            });
        });

        this.input.on("click", ".input-search-button", () => {
            if (o.searchButtonClick !== 'submit') {
                this.fireEvent("searchButtonClick", {
                    val: element.val()
                });
            } else {
                const form = this.input.closest("form")
                if (form.length) {
                    form.submit();
                }
            }
        });

        this.input.on("click", ".input-custom-button", function(){
            const button = $(this);
            const action = button.data("action");
            exec(action, [element.val(), button], this);
        });


        element.on("keyup", (e) => {
            const val = element.val().trim();

            if (o.history && e.keyCode === KEY_CONTROL_CODES.ENTER && val !== "") {
                element.val("");
                this.history.push(val);
                this.historyIndex = this.history.length - 1;

                this.fireEvent("historyChange", {
                    val: val,
                    history: this.history,
                    historyIndex: this.historyIndex
                })

                if (o.preventSubmit === true) {
                    e.preventDefault();
                }
            }

            if (o.history && e.keyCode === KEY_CONTROL_CODES.UP_ARROW) {
                this.historyIndex--;
                if (this.historyIndex >= 0) {
                    element.val("");
                    element.val(that.history[that.historyIndex]);

                    this.fireEvent("historyDown", {
                        val: element.val(),
                        history: this.history,
                        historyIndex: this.historyIndex
                    })
                } else {
                    this.historyIndex = 0;
                }
                e.preventDefault();
            }

            if (o.history && e.keyCode === KEY_CONTROL_CODES.DOWN_ARROW) {
                this.historyIndex++;
                if (this.historyIndex < this.history.length) {
                    element.val("");
                    element.val(this.history[this.historyIndex]);

                    this.fireEvent("historyUp", {
                        val: element.val(),
                        history: this.history,
                        historyIndex: this.historyIndex
                    })
                } else {
                    this.historyIndex = this.history.length - 1;
                }
                e.preventDefault();
            }
        });

        element.on("keydown", (e) => {
            if (e.keyCode === KEY_CONTROL_CODES.ENTER) {
                this.fireEvent("enter-click", {
                    val: element.val()
                });
            }
            if (e.ctrlKey && e.keyCode === 32) {
                that.drawAutocompleteList(this.elem.value.toLowerCase());
            }
        });

        element.on("blur", () => {
            this.input.removeClass("focused");
        });

        element.on("focus", () => {
            this.input.addClass("focused");
        });

        element.on("input", () => {
            that.drawAutocompleteList(this.elem.value.toLowerCase());
        });

        this.input.on("click", ".autocomplete-list .item", function(){
            const val = $(this).attr("data-autocomplete-value");
            element.val(val);
            that.autocompleteList.css({
                display: "none"
            });
            element.trigger("change");
            that.fireEvent("autocompleteSelect", {
                value: val
            });
        });
    }

    drawAutocompleteList(val){
        const that = this, element = this.element;
        let items;

        if (!this.autocompleteList) {
            return;
        }

        this.autocompleteList.clear();

        items = this.autocomplete.filter(function(item){
            return item.toLowerCase().includes(val);
        });

        this.autocompleteList.css({
            display: items.length > 0 ? "block" : "none"
        });

        $.each(items, (_, v) => {
            const index = v.toLowerCase().indexOf(val)
            const item = $("<div>").addClass("item").attr("data-autocomplete-value", v);
            let content

            if (index === 0) {
                content = "<strong>"+v.substr(0, val.length)+"</strong>"+v.substr(val.length);
            } else {
                content = v.substr(0, index) + "<strong>"+v.substr(index, val.length)+"</strong>"+v.substr(index + val.length);
            }

            item.html(content).appendTo(this.autocompleteList);

            this.fireEvent("draw-autocomplete-item", {
                item: item
            })
        });
    }

    getHistory(){
        return this.history;
    }

    getHistoryIndex(){
        return this.historyIndex;
    }

    setHistoryIndex(val){
        this.historyIndex = val >= this.history.length ? this.history.length - 1 : val;
    }

    setHistory(history, append) {
        const that = this, o = this.options;
        if (undef(history)) return;
        if (!Array.isArray(history) && typeof history === 'string') {
            history = to_array(history, "|")
        }
        if (append === true) {
            $.each(history, function () {
                that.history.push(this);
            })
        } else{
            this.history = history;
        }
        this.historyIndex = this.history.length - 1;
    }

    clear(){
        this.element.val('');
    }

    toDefault(){
        this.element.val(this.options.defaultValue ? this.options.defaultValue : "");
    }

    destroy() {
        this.input.remove()
    }
}

Registry.register("input", Input)
GlobalEvents.setEvent(()=>{
    $(document).on("click", function(){
        $('.input .autocomplete-list').hide(); // ???
    });
})
import "./lightbox.css"
import {Component} from "../../core/component.js";
import {merge, noop, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let LightboxDefaultOptions = {
    sourceTag: "img",
    loop: true,
    onDrawImage: noop,
}

export class Lightbox extends Component {
    sourceTag = "img"
    component = null
    lightbox = null
    overlay = null
    items = null

    constructor(elem, options) {
        if (!undef(globalThis["metroLightboxSetup"])) {
            LightboxDefaultOptions = merge({}, LightboxDefaultOptions, globalThis["metroLightboxSetup"])
        }
        super(elem, "lightbox", merge({}, LightboxDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options
        let lightbox, overlay;

        this.sourceTag = o.sourceTag

        overlay = $(".lightbox-overlay");

        if (overlay.length === 0) {
            overlay = $("<div>").addClass("lightbox-overlay").appendTo("body").hide();
        }

        lightbox = $("<div>").addClass("lightbox").appendTo("body").hide();

        $("<span>").addClass("lightbox__prev").appendTo(lightbox);
        $("<span>").addClass("lightbox__next").appendTo(lightbox);
        $("<span>").addClass("lightbox__closer").appendTo(lightbox);
        $("<div>").addClass("lightbox__image").appendTo(lightbox);

        this.component = lightbox;
        this.lightbox = lightbox;
        this.overlay = overlay;

        this.items = element.find(this.sourceTag)
    }

    createEvents(){
        const that = this, element = this.element, o = this.options
        const lightbox = this.component

        element.on("click", this.sourceTag, function(){
            that.open(this);
        });

        lightbox.on("click", ".lightbox__closer", function(){
            that.close();
        });

        lightbox.on("click", ".lightbox__prev", function(){
            that.prev();
        });

        lightbox.on("click", ".lightbox__next", function(){
            that.next();
        });
    }

    _goto(el){
        const that = this, o = this.options;
        const $el = $(el);
        const img = $("<img>")
        let src, imageContainer, imageWrapper, activity;

        imageContainer = this.lightbox.find(".lightbox__image");

        imageContainer.find(".lightbox__image-wrapper").remove();
        imageWrapper = $("<div>")
            .addClass("lightbox__image-wrapper")
            .attr("data-title", ($el.attr("alt") || $el.attr("data-title") || ""))
            .appendTo(imageContainer);

        activity = $("<div>").appendTo(imageWrapper);

        Metro5.makePlugin(activity[0], "activity", {
            type: "cycle",
            style: "color"
        });

        this.current = el;

        if (el.tagName === "IMG" || el.tagName === "DIV") {
            src = $el.attr("data-original") || $el.attr("src");
            img.attr("src", src);
            img[0].onload = function(){
                const port = this.height > this.width;
                img.addClass(port ? "lightbox__image-portrait" : "lightbox__image-landscape");
                img.attr("alt", $el.attr("alt"));
                img.appendTo(imageWrapper);
                activity.remove();
                that.fireEvent("drawImage", {
                    image: img[0],
                    item: imageWrapper[0]
                });
            }
        }
    }

    _index(el){
        let index = -1;

        this.items.each(function(i){
            if (this === el) {
                index = i;
            }
        });

        return index;
    }

    next(){
        let index, current = this.current;

        index = this._index(current);

        if (index + 1 >= this.items.length) {
            if (this.options.loop) {
                index = -1;
            } else {
                return;
            }
        }

        this._goto(this.items[index + 1]);
    }

    prev(){
        let index, current = this.current;

        index = this._index(current);

        if (index - 1 < 0) {
            if (this.options.loop) {
                index = this.items.length;
            } else {
                return;
            }
        }

        this._goto(this.items[index - 1]);
    }

    open(el){
        // this._setupItems();

        this._goto(el);

        this.overlay.show();
        this.lightbox.show();

        return this;
    }

    close(){
        this.overlay.hide();
        this.lightbox.hide();
    }
}

Registry.register("lightbox", Lightbox)
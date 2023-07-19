import {Component} from "../../core/component.js";
import {exec, merge, noop, pageXY} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let DragDefaultOptions = {
    dragger: null,
    dragArea: "parent",
    boundaryRestriction: true,
    canDrag: true,
    onDragStart: noop,
    onDragEnd: noop,
    onDragMove: noop,
}

export class Drag extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroDragSetup"] !== "undefined") {
            DragDefaultOptions = merge({}, DragDefaultOptions, globalThis["metroDragSetup"])
        }

        super(elem, "drag", merge({}, DragDefaultOptions, options))

        this.dragger = null

        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options
        const offset = element.offset()

        element.css({
            position: "absolute"
        })

        this.dragger = o.dragger ? $(o.dragger) : element
        this.dragger[0].ondragstart = () => false

        if (o.dragArea === 'document' || o.dragArea === 'window') {
            o.dragArea = "body";
        }

        this.dragArea = o.dragArea === 'parent' ? element.parent() : $(o.dragArea);
        if (o.dragArea !== 'parent') {
            element.appendTo(this.dragArea);
            element.css({
                top: offset.top,
                left: offset.left
            });
        }
    }

    createEvents(){
        const element = this.element, o = this.options
        const id = element.id()
        const position = {
            x: 0,
            y: 0
        }

        this.dragger.on("mousedown touchstart", (startEvent) => {
            const coord = o.dragArea !== "parent" ? element.offset() : element.position(),
                shiftX = pageXY(startEvent).x - coord.left,
                shiftY = pageXY(startEvent).y - coord.top;

            const moveElement = (event) => {
                let top = pageXY(event).y - shiftY;
                let left = pageXY(event).x - shiftX;

                if (o.boundaryRestriction) {
                    if (top < 0) top = 0;
                    if (left < 0) left = 0;

                    if (top > this.dragArea.outerHeight() - element.outerHeight()) top = this.dragArea.outerHeight() - element.outerHeight();
                    if (left > this.dragArea.outerWidth() - element.outerWidth()) left = this.dragArea.outerWidth() - element.outerWidth();
                }

                position.y = top;
                position.x = left;

                element.css({
                    left: left,
                    top: top
                });
            };


            if (this.options.canDrag === false) {
                return ;
            }

            if (startEvent.which && startEvent.which !== 1) {
                return ;
            }

            this.drag = true;

            element.addClass("element-draggable");

            moveElement(startEvent);

            this.fireEvent("drag-start", {
                element: element[0],
                position: position,
            });

            $(document).on("mousemove touchmove", (moveEvent) => {
                moveEvent.preventDefault();
                moveElement(moveEvent);
                this.fireEvent("drag-move", {
                    element: element[0],
                    position: position,
                });
            }, {ns: id, passive: false});

            $(document).on("mouseup touchend", () => {
                element.removeClass("element-draggable");

                if (this.drag) {
                    $(document).off("mousemove touchmove", {ns: id});
                    $(document).off("mouseup touchend", {ns: id});
                }

                this.drag = false;
                this.move = false;

                this.fireEvent("drag-end", {
                    element: element[0],
                    position: position,
                });

            }, {ns: id});
        })
    }

    on(){
        this.options.canDrag = true
    }

    off(){
        this.options.canDrag = false
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-can-drag": {
                this.options.canDrag = newVal
                break
            }
        }
    }

    destroy() {
        this.dragger.off("mousedown touchstart", {ns: this.element.id()})
    }
}

Registry.register("drag", Drag)
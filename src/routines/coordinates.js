export const clientXY = function(e){
    return {
        x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
        y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY
    };
}

export const screenXY = function(e){
    return {
        x: e.changedTouches ? e.changedTouches[0].screenX : e.screenX,
        y: e.changedTouches ? e.changedTouches[0].screenY : e.screenY
    };
}

export const pageXY = function(e){
    return {
        x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
        y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
    };
}
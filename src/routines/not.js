export const not = function (val){
    return typeof val !== "undefined" && val !== null && (""+val).trim() !== ""
}
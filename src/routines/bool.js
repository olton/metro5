export const bool = function (val) {
    switch (val) {
        case "0":
        case "false":
        case "not":
        case "no":
        case false:
        case 0: return false
        default: return true
    }
}
export const compare = (curr, next, dir = "asc") => {
    let result = 0

    if (curr < next) {
        result = dir === "asc" ? -1 : 1
    }
    if (curr > next) {
        result = dir === "asc" ? 1 : -1
    }
    return result
}
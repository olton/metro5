export const objectLength = (obj) => {
    if (typeof obj !== "object") return null
    return Object.keys(obj).length;
}
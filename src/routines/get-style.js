export const getStyle = (element, pseudo) => window.getComputedStyle($(element)[0], pseudo)
export const getStyleOne = (el, property, pseudo) => getStyle(el, pseudo).getPropertyValue(property)
export const getInlineStyles = element => {
    let i, l, styles = {}, el = $(element)[0];
    for (i = 0, l = el.style.length; i < l; i++) {
        let s = el.style[i]
        styles[s] = el.style[s]
    }

    return styles
}

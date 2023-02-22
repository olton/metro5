export const medias = {
    FS: "(min-width: 0px)",
    XS: "(min-width: 360px)",
    SM: "(min-width: 576px)",
    MD: "(min-width: 768px)",
    LG: "(min-width: 992px)",
    XL: "(min-width: 1200px)",
    XXL: "(min-width: 1452px)"
}

export const media_mode = {
    FS: "fs",
    XS: "xs",
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
    XXL: "xxl"
}

globalThis.METRO_MEDIA = []

export const media = query => window.matchMedia(query).matches
export const mediaModes = () => globalThis.METRO_MEDIA

export const mediaExist = media => globalThis.METRO_MEDIA.includes(media)

export const inMedia = media => globalThis.METRO_MEDIA.includes(media) && globalThis.METRO_MEDIA.indexOf(media) === globalThis.METRO_MEDIA.length - 1

for(let key in medias) {
    if (media(medias[key])) {
        globalThis.METRO_MEDIA.push(media_mode[key]);
    }
}

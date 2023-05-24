export const clearName = n => n ? n.replaceAll("-", "") : ""
export const clearStr = s => s.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
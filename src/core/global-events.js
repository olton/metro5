globalThis.METRO_GLOBAL_EVENTS = []

export const GlobalEvents = {
    setEvent(fn, ctx = null){
        if (METRO_GLOBAL_EVENTS.includes(fn)) return
        METRO_GLOBAL_EVENTS.push(fn.bind(ctx))
        return METRO_GLOBAL_EVENTS.length
    },

    deleteEvent(fn){
        const index = METRO_GLOBAL_EVENTS.indexOf(fn)
        if (index === -1) return
        delete METRO_GLOBAL_EVENTS[index]
    },

    getGlobalEvents(){
        return METRO_GLOBAL_EVENTS
    },

    sizeOfGlobalEvents(){
        return METRO_GLOBAL_EVENTS.length
    }
}
import {Metro} from "../src/core/metro"
import * as Components from "../src/components"
import * as CommonCss from "../src/common"

globalThis.Metro = new Metro({
    onInit: ()=>console.log("Hello world!")
})
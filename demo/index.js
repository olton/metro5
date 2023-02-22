import {Metro} from "../src/core/metro"
import "../icons/mif.css"
import * as CommonCss from "../src/common"
import * as Components from "../src/components"

globalThis.Metro = new Metro({
    removeCloakTimeout: 1000,
    onInit: ()=>{
        $(".hamburger").on("click", function() {
            $(this).toggleClass("active")
        })
    }
})


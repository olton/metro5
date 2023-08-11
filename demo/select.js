import {Metro5} from "../src/index.js"
import {Select} from "../src/components/select"
import {Grid} from "../src/components/grid"
import {Dropdown} from "../src/components/dropdown"

window.Metro = new Metro5({
    removeCloakTimeout: 1000,
    onInit: ()=>{
        console.log("Metro5 Initialed.")
    }
})
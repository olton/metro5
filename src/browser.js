import * as Routines from "./routines"
import {Metro5} from "./core/metro"

globalThis.Metro = new Metro5()
globalThis.Metro5.Routines = Routines

import * as CommonCss from "./common"
import * as Components from "./components"
import * as MifIcons from "./icons"

globalThis.Notify = new Components.Notify()
globalThis.Toast = new Components.Toast()
import modularus from "@scribe-systems/modularus";

import messages from "@/translations"

import Boilerplate from '../components/BoilerplateView.vue'
import API from '../api/api'

export class BoilerplateModule extends modularus.ModularusModule {
    components = [
        new modularus.ModularusComponent("TestOrg_Boilerplate_BoilerplateView", Boilerplate),
    ]
    apis = [
        new API() 
    ]
    pages = []
    views = [
        new modularus.SView(
            "fas fa-clipboard-list", //icon
            "module.testorg.boilerplate.boilerplate", //translation key
            ["boilerplate"], //subroute key
            0, //priority
            [],
            "TestOrg_Boilerplate_BoilerplateView", //component name
            "integrator" //parent name
        )
    ]
    globals = [
    ]
    
    translations = messages
    
    context = {
        baseURL: "/"
    }


    // Will be automatically changed (see build/rollup.config.js)
    get version(): string {
        return 'PACKAGE_JSON_VERSION'
    }
    get name(): string {
        return "BoilerplateModule"
    }
    get changeLog(): string {
        return `_CHANGELOG_`
    }
}

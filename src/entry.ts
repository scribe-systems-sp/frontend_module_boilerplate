import { QVueGlobals } from 'quasar'

import { BoilerplateModule } from "@/modularus/BoilerplateModule"

import { IntegratorAPI } from "@scribe-systems/scribe-api-integrator/modularus"
import { UsermanagerAPI } from "@scribe-systems/scribe-api-usermanager/modularus"
import { UserPrefsAPI, UserPrefsToolsAPI } from "@scribe-systems/scribe-api-userprefs/modularus"

import { IBoilerplateAPIClient } from './api/api'

import { } from 'vue-i18n'

//Declare typings
interface APIWrapper<T> {
    getClient: () => Promise<T>
}

interface APIs {
    IntegratorAPI: APIWrapper<IntegratorAPI>
    UsermanagerAPI: APIWrapper<UsermanagerAPI>
    UserPrefsAPI: APIWrapper<UserPrefsAPI>
    UserPrefsToolsAPI: APIWrapper<UserPrefsToolsAPI>
    Module_TestOrg_BoilerplateAPI: APIWrapper<IBoilerplateAPIClient>
}

declare module 'vue/types/vue' {
  interface Vue {
    $apis: APIs;
    $q: QVueGlobals
  }
}


window.Modularus.loadModule(new BoilerplateModule())
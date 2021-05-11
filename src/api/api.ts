import { SApi } from '@scribe-systems/modularus/lib/SApi'
import { Modularus } from '@scribe-systems/modularus/lib/Modularus'
import axios, { AxiosInstance } from 'axios'


declare global {
    interface Window { Modularus: Modularus; }
}

export interface IBoilerplateAPIClient {
    status(): Promise<boolean>
}

export class BoilerplateAPIClient implements IBoilerplateAPIClient {
    baseURL: string
    usedAxios: AxiosInstance

    constructor(baseURL: string, usedAxios: AxiosInstance) {
        this.baseURL = baseURL
        this.usedAxios = usedAxios
    }

    async status() {
        const response = await this.usedAxios.get("modules/native/moduleloader/api/v1/status")
        return response.status === 200
    }
}

export default class BoilerplateAPI extends SApi {
    loaded = false
    apiClient?: BoilerplateAPIClient
    loadedInterceptors: any[] = []

    getApiIdentifier(): String {
        return "Module_TestOrg_BoilerplateAPI"
    }
    async isLoaded(): Promise<boolean> {
        return this.loaded
    }
    async loadApi(baseURL: string): Promise<void> {
        this.apiClient = new BoilerplateAPIClient(baseURL, axios)
        this.loaded = true
    }
    async api(): Promise<any> {
        for (let index = 0; index < this.loadedInterceptors.length; index++) {
            const element = this.loadedInterceptors[index];
            this.apiClient?.usedAxios.interceptors.request.eject(element)
        }
        
        for (let index = 0; index < window.Modularus.requestInterceptors.length; index++) {
            const element = window.Modularus.requestInterceptors[index];
            let nr = this.apiClient?.usedAxios.interceptors.request.use(element)
            this.loadedInterceptors.push(nr)
        }

        return this.apiClient
    }
}

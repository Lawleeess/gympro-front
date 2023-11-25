import { environment } from "src/environments/environment";

export class Configuration {
    public production = environment.production;
    public endpoint = environment.apiUrl;
}

export const ConfigurationFactory = () => {
    const env = new Configuration();

    const browserWindow = window || {};
    const browserWindowEnv = browserWindow['__env'] || {};

    for (const key in browserWindowEnv) {
        if (browserWindowEnv.hasOwnProperty(key)) {
            env[key] = window['__env'][key];
        }
    }
    return env;
};

// Export const to use in modules
export const ConfigurationProvider = {
    provide: Configuration,
    useFactory: ConfigurationFactory,
    deps: [],
};

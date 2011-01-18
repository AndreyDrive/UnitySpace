// using Namespace
// using ResourceManager

Resources.set({
    System: {
        InitializeManager: {
            ModuleAlreadyAdd: 'Module {0} already add.'  
        },
        Modules: {
            UnknownModuleName: 'Unknown module name.',
            RequiedModule: 'Module {0} required.',

            CommandShellModule: {
                EmptyModuleMethod: 'Empty module {0} method.'
            },
            ExtJSModule: {
                UnsupportHeaderType: 'Unsupported response header type.'
            },
            GINAModule: {
                UnknownCurrentUser: 'Unknown current user.'
            },
            ProjectProfileModule: {
                NullProjectName: '',
                ProfileNotLoaded: 'Project profile not loaded.'
            }
        },
        Net: {
            ActionResponse: {
                UnknownResponse: 'Unknown server response.'
            }
        },
        Controllers: {
            ControllerAlreadyRegistrate: 'Controller {0} already registrate.',
            ControllerNotRegistrate: 'Controller {0} not registrate.'
        },
        Security: {
            AuthenticateProviderManager: {
                ProviderAlreadyRegistrate: 'Authenticate provider {0} already registrate.',
                ProviderNotRegistrate: 'Authenticate provider {0} not registrate.'
            }
        }
    },
    ArgumentNullException: {
        Message: 'Argument {0} is null.'
    }
});
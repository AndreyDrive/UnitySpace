// using System.Security.Namespace
//using System.Engine

/**
 * @class UnitySpace.System.Security.AuthenticateProviderManager
 * @namespace UnitySpace.System.Security
 * @extends Object
 * AuthenticateProviderManager class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.AuthenticateProviderManager class
 */
UnitySpace.System.Security.AuthenticateProviderManager = function() {
    UnitySpace.System.Security.AuthenticateProviderManager.superclass.constructor.apply(this, arguments);
    this.providers = {};
};

Ext.extend(UnitySpace.System.Security.AuthenticateProviderManager, Object, {
    providers: null,

    /**
     * Return authenticate provider instance by name
     * @param {String} name Name of controller
     */
    get: function(name) {
        var providers = this.providers[name];
        if (!Ext.isDefined(providers))
            throw new UnitySpace.System.Security.AuthenticateProviderException(
                    Resources.get("System.Security.ProviderNotRegistrate"),
                    name);

        if (!providers.instance) {
            var restfull = Engine.config.get('Connection.restfull', false);
            providers.instance = new providers.className();
        }

        return providers.instance;
    },

    /**
     * Registrate new authenticate provider.
     * @param {String} name Controller name
     * @param {Function} className Controller class
     */
    registrate: function(name, className) {
        if (Ext.isEmpty(name))
            throw new UnitySpace.ArgumentNullException("name");

        if (Ext.isDefined(this.providers[name]))
            throw new UnitySpace.System.Security.AuthenticateProviderException(
                    Resources.get("System.Security.AuthenticateProviderManager.ProviderAlreadyRegistrate"),
                    name);

        this.providers[name] = {
            className: className,
            instance: null
        };
    }
});

Engine.authenticateProviders = new UnitySpace.System.Security.AuthenticateProviderManager();
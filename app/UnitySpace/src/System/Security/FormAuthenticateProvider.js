// using System.Security.Namespace
// using System.Security.BaseAuthenticateProvider

/**
 * @class UnitySpace.System.Security.FormAuthenticateProvider
 * @namespace UnitySpace.System.Security
 * @extends UnitySpace.System.Security.BaseAuthenticateProvider
 * FormAuthenticateProvider class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.FormAuthenticateProvider class
 */
UnitySpace.System.Security.FormAuthenticateProvider = function() {
    UnitySpace.System.Security.FormAuthenticateProvider.superclass.constructor.apply(this, arguments);

    this.name = Engine.config.get('Authenticate.name');
    this.password = Engine.config.get('Authenticate.password');
    this.rememberMe = Engine.config.get('Authenticate.rememberMe');
};

Ext.extend(UnitySpace.System.Security.FormAuthenticateProvider, UnitySpace.System.Security.BaseAuthenticateProvider, {
    authenticate: function(successFn, failureFn) {
        var accountController = Engine.api.get("UnitySpace.Account");
        accountController.signin(
            this.name,
            this.password,
            this.rememberMe,
            successFn,
            failureFn);
    }
});

Engine.authenticateProviders.registrate('FormAuthenticate', UnitySpace.System.Security.FormAuthenticateProvider)
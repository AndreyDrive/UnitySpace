// using System.Security.Namespace

/**
 * @class UnitySpace.System.Security.BaseAuthenticateProvider
 * @namespace UnitySpace.System.Security
 * @extends Object
 * AuthenticateProvider class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.AuthenticateProvider class
 */
UnitySpace.System.Security.BaseAuthenticateProvider = function() {
    UnitySpace.System.Security.BaseAuthenticateProvider.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Security.BaseAuthenticateProvider, Object, {
    authenticate: function(successFn, failureFn) {

    }
});
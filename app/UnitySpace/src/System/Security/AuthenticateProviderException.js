// using System.Security.Namespace
// using Exception

/**
 * @class UnitySpace.System.Security.AuthenticateProviderException
 * @namespace UnitySpace.System.Security
 * @extends UnitySpace.Exception
 * Controller exception class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.AuthenticateProviderException class
 */

UnitySpace.System.Security.AuthenticateProviderException = function() {
    UnitySpace.System.Security.AuthenticateProviderException.superclass.constructor.apply(this, arguments);
    this.name = 'AuthenticateProviderException';
};

Ext.extend(UnitySpace.System.Security.AuthenticateProviderException, UnitySpace.Exception, {});

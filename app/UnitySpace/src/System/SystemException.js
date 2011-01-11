// using System.Net.Namespace
// using Exception
/**
 * @class UnitySpace.System.SystemException
 * @namespace UnitySpace.System
 * @extends UnitySpace.Exception
 * Application error class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of SystemException class
 */
UnitySpace.System.SystemException = function() {
    UnitySpace.System.SystemException.superclass.constructor.apply(this, arguments);
    this.name = 'SystemException';
};

Ext.extend(UnitySpace.System.SystemException, UnitySpace.Exception, {});

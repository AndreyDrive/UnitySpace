// using System.Net.Namespace
// using Exception
/**
 * @class UnitySpace.System.ApplicationException
 * @namespace UnitySpace.System
 * @extends UnitySpace.Exception
 * Application error class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of ApplicationException class
 */
UnitySpace.System.ApplicationException = function() {
    UnitySpace.System.ApplicationException.superclass.constructor.apply(this, arguments);
    this.name = 'ApplicationException';
};

Ext.extend(UnitySpace.System.ApplicationException, UnitySpace.Exception, {});

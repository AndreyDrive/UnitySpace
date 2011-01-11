// using System.Net.Namespace
// using Exception
/**
 * @class UnitySpace.System.Net.ConnectionException
 * @namespace UnitySpace.System.Net
 * @extends UnitySpace.Exception
 * Connection error class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of ConnectionException class
 */
UnitySpace.System.Net.ConnectionException = function() {
    UnitySpace.System.Net.ConnectionException.superclass.constructor.apply(this, arguments);
    this.name = 'ConnectionException';
};

Ext.extend(UnitySpace.System.Net.ConnectionException, UnitySpace.Exception, {});

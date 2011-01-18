// using Namespace
// using Exception
/**
 * @class UnitySpace.ArgumentNullException
 * @namespace UnitySpace
 * @extends UnitySpace.Exception
 * Argument null exception class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.ArgumentNullException class
 * @param {String} paramName Name of null parameter 
 */
UnitySpace.ArgumentNullException = function(paramName) {
    //UnitySpace.ArgumentNullException.constructor.apply(this, arguments);
    this.message = String.format(Resources.get("ArgumentNullException.Message"),  paramName);
    this.name = 'ArgumentNullException';
};

Ext.extend(UnitySpace.ArgumentNullException, UnitySpace.Exception, {});
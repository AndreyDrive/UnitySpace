// using System.Controllers.Namespace
// using Exception

/**
 * @class UnitySpace.System.Controllers.ControllerException
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.Exception
 * Controller exception class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.ControllerException class
 * @param {String} paramName Name of null parameter
 */

UnitySpace.System.Controllers.ControllerException = function() {
    UnitySpace.System.Controllers.ControllerException.superclass.constructor.apply(this, arguments);
    this.name = 'ControllerException';
};

Ext.extend(UnitySpace.System.Controllers.ControllerException, UnitySpace.Exception, {});

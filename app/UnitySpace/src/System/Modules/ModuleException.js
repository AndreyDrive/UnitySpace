// using System.Modules.Namespace

/**
 * @class UnitySpace.System.Modules.ModuleException
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.Exception
 * Module exception class.
 * @author Max Kazarin
 */

UnitySpace.System.Modules.ModuleException = function() {
    UnitySpace.System.Modules.ModuleException.constructor.apply(this, arguments);
    this.name = 'ModuleException';
};

Ext.extend(UnitySpace.System.Modules.ModuleException, UnitySpace.Exception, {});

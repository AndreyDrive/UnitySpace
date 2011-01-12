// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.RepositoryController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.RolesController class
 */
UnitySpace.System.Controllers.RepositoryController = function() {
    UnitySpace.System.Controllers.RepositoryController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.RepositoryController, UnitySpace.System.Controllers.BaseController, {
});

Engine.api.registrate("UnitySpace.Repository", UnitySpace.System.Controllers.RepositoryController);
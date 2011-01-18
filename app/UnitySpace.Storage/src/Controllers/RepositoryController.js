// using Controllers.BaseStorageController

/**
 * @class UnitySpace.Storage.Controllers.RepositoryController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.Storage.Controllers.BaseMockController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Storage.Controllers.RolesController class
 */
UnitySpace.Storage.Controllers.RepositoryController = function() {
    UnitySpace.Storage.Controllers.RepositoryController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.Storage.Controllers.RepositoryController, UnitySpace.Storage.Controllers.BaseMockController, {
});

Engine.api.registrate("UnitySpace.Repository", UnitySpace.Storage.Controllers.RepositoryController, true);
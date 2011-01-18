// using Controllers.BaseStorageController

/**
 * @class UnitySpace.Storage.Controllers.RolesController
 * @namespace UnitySpace.System.Mock.Controllers
 * @extends UnitySpace.Storage.Controllers.BaseMockController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Storage.Controllers.RolesController class
 */
UnitySpace.Storage.Controllers.RolesController = function() {
    UnitySpace.Storage.Controllers.RolesController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.Storage.Controllers.RolesController, UnitySpace.Storage.Controllers.BaseMockController, {

    /**
     * Get all roles. Requesr url GET /roles.
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function (successFn, failureFn, responseFn, format){
        this.success(UnitySpace.Storage.Controllers.Roles, 200, successFn, responseFn);
    },

    /**
     * Set user roles in project. Request url POST /project/(projectId)/user/(userId)
     * @param {Number} projectId Project id
     * @param {Number} userId User id
     * @param {Array} roles Roles
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    create: function (projectId, userId, roles, successFn, failureFn, responseFn, format){
        return null;
    },

    /**
     * Remove user roles in project. Request url DELET /project/(projectId)/user/(userId)
     * @param {Number} projectId Project id
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    remove: function (projectId, userId, successFn, failureFn, responseFn, format){
        return null;
    }
});

Engine.api.registrate("UnitySpace.Roles", UnitySpace.Storage.Controllers.RolesController, true);
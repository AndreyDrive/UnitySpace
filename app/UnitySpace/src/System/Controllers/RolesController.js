// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.RolesController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.RolesController class
 */
UnitySpace.System.Controllers.RolesController = function() {
    UnitySpace.System.Controllers.RolesController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.RolesController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Get all roles. Requesr url GET /roles.
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function (successFn, failureFn, responseFn, format){
        this.invoke(
            '/roles',
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/'+projectId+'/user/'+userId,
            'POST',
            {
                roles: roles
            },
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/'+projectId+'/user/'+userId,
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Roles", UnitySpace.System.Controllers.RolesController);
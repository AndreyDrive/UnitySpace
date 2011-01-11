// System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.UsersController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * UsersController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.UsersController class
 */
UnitySpace.System.Controllers.UsersController = function() {
    UnitySpace.System.Controllers.UsersController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.UsersController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Get user in project by id. Request url GET /user/(userId)/project/(projectId)/.
     * @param {Number} projectId Project id
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(projectId, userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/'+userId+'/project/'+projectId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Get users in project by id. Request url GET /user/project/(projectId).
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getAll: function(projectId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/project/'+projectId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Create new user. Request url POST /user/project/(projectId)
     * @param {Number} projectId Project id.
     * @param {Object} user User object
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    create: function(projectId, user, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/project/' + projectId,
            'POST',
            {
                user: user
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Change user. Request url PUT /user/(userId).
     * @param {Number} userId User id
     * @param {Object} user User object
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    change: function(userId, user, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/'+userId,
            'PUT',
            {
                user: user
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Remove user. Request url DELETE /user/(userId).
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    remove: function(userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/'+userId,
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Users", UnitySpace.System.Controllers.UsersController);
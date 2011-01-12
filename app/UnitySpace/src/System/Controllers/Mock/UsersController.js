// using System.Controllers.BaseController
// using System.Controllers.Mock.Mock

/**
 * @class UnitySpace.System.Controllers.Mock.UsersController
 * @namespace UnitySpace.System.Controllers.Mock
 * @extends UnitySpace.System.Controllers.BaseController
 * UsersController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.Mock.UsersController class
 */
UnitySpace.System.Controllers.Mock.UsersController = function() {
    UnitySpace.System.Controllers.Mock.UsersController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.Mock.UsersController, UnitySpace.System.Controllers.BaseController, {

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
        return null;
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
        return null;
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
        return null;
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
        return null;
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
        return null;
    }
});
// using Controllers.BaseStorageController

/**
 * @class UnitySpace.Storage.Controllers.ProjectsController
 * @namespace UnitySpace.Storage.Controllers
 * @extends UnitySpace.Storage.Controllers.BaseMockController
 * ProjectsController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Storage.Controllers.ProjectsController class
 */
UnitySpace.Storage.Controllers.ProjectsController = function() {
    UnitySpace.Storage.Controllers.ProjectsController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.Storage.Controllers.ProjectsController, UnitySpace.Storage.Controllers.BaseMockController, {

    /**
     * Get project by id. Request url GET /project/(projectId)
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(projectId, successFn, failureFn, responseFn, format) {
        return null;
    },

    /**
     * Get all project of user. Request url GET project/user/(userId)
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getAll: function(userId, successFn, failureFn, responseFn, format) {
        return null;
    },

    /**
     * Get current project of user. Request url GET /project/current/user/(userId).
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getCurrent: function(userId, successFn, failureFn, responseFn, format) {
        return null;
    },

        /**
     * Set current project for user. Request url GET /project/current/user/(userId).
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    setCurrent: function(projectId, userId, successFn, failureFn, responseFn, format) {
        return null;
    },

        /**
     * Get project components. Request url GET /project/(projectId)/applications.
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getApplications: function(projectId, successFn, failureFn, responseFn, format) {
        return null;
    },

    /**
     * Create new project. Request url POST /project.
     * @param {Object} project Project object.
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    create: function(project, successFn, failureFn, responseFn, format) {
        return null;
    },

    /**
     * Change user. Request url PUT /project/(projectId).
     * @param {Number} projectId Project id
     * @param {Object} project Project object
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    change: function(projectId, project, successFn, failureFn, responseFn, format) {
        return null;
    },

    /**
     * Remove user. Request url PUT /project/(projectId).
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    remove: function(projectId, successFn, failureFn, responseFn, format) {
        return null;
    }
});

Engine.api.registrate("UnitySpace.Projects", UnitySpace.Storage.Controllers.ProjectsController, true);
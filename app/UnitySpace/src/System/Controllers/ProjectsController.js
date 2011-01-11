// System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.ProjectsController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * ProjectsController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.ProjectsController class
 */
UnitySpace.System.Controllers.ProjectsController = function() {
    UnitySpace.System.Controllers.ProjectsController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.ProjectsController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Get project by id. Request url GET /project/(projectId)
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(projectId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/'+projectId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/user/'+userId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/current/user/'+userId,
            url,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/current/user/'+userId,
            'POST',
            {projectId: projectId},
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/'+projectId+'/applications',
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            'project',
            'POST',
            {
                project: project
            },
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/'+projectId,
            'PUT',
            {
                project: project
            },
            successFn,
            failureFn,
            responseFn,
            format);
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
        this.invoke(
            '/project/'+projectId,
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Users", UnitySpace.System.Controllers.UsersController);
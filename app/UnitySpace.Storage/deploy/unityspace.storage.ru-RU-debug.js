/*!
 * UnitySpace.Storage license
 */
Ext.namespace("UnitySpace.Storage");
// using Namespace

Ext.namespace('UnitySpace.Storage.Controllers');// using Controllers.Namespace

/**
 * @class UnitySpace.Storage.Controllers.RepositoryController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Storage.Controllers.RolesController class
 */
UnitySpace.Storage.Controllers.BaseMockController = function() {
    UnitySpace.Storage.Controllers.BaseMockController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.Storage.Controllers.BaseMockController, UnitySpace.System.Controllers.BaseController, {
    success: function(data, statusCode, successFn, responseFn) {
        var response = this._response(data, statusCode);
        this._safeCall(successFn, [response, null]);
        this._safeCall(responseFn, [null, true, response]);
    },

    failure: function(message, statusCode, failureFn, responseFn) {
        var data = null;
        if (message)
            data = {alert: message};

        var response = this._response(data, statusCode);
        this._safeCall(failureFn, [response, null]);
        this._safeCall(responseFn, [null, true, response]);
    },

    _safeCall: function(fn, args) {
        if (fn != null)
            fn.defer(1, this, args, false);
    },

    _response: function(data, statusCode) {
        var result = {
            responseData: data,
            status: 200
        };
        if (statusCode)
            result.status = statusCode;
        
        return result;
    }
});// using Controllers.BaseStorageController

/**
 * @class UnitySpace.Storage.Controllers.AccountController
 * @namespace UnitySpace.Storage.Controllers
 * @extends UnitySpace.Storage.Controllers.BaseMockController
 * AccountController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Storage.Controllers.AccountController class
 */
UnitySpace.Storage.Controllers.AccountController = function() {
    UnitySpace.Storage.Controllers.AccountController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.Storage.Controllers.AccountController, UnitySpace.Storage.Controllers.BaseMockController, {

    /**
     * Signin. Request url POST /signin.
     * @param {String} userName User name
     * @param {String} password User password
     * @param {Boolean} remember User remember flag
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    signin: function(userName, password, remember, successFn, failureFn, responseFn, format) {
        this.success(UnitySpace.Storage.Controllers.Roles, 200, successFn, responseFn);
    },

    /**
     * Signout. Request url DELETE /signout
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    signout: function(successFn, failureFn, responseFn, format) {
        return null;
    },

    /**
     * Get current user. Request url GET /user
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(successFn, failureFn, responseFn, format) {
        this.failure(null, 401, failureFn, responseFn);
    }
});

Engine.api.registrate("UnitySpace.Account", UnitySpace.Storage.Controllers.AccountController, true);
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

Engine.api.registrate("UnitySpace.Projects", UnitySpace.Storage.Controllers.ProjectsController, true);// using Controllers.BaseStorageController

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

Engine.api.registrate("UnitySpace.Repository", UnitySpace.Storage.Controllers.RepositoryController, true);// using Controllers.BaseStorageController

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

Engine.api.registrate("UnitySpace.Roles", UnitySpace.Storage.Controllers.RolesController, true);// using Controllers.BaseStorageController

/**
 * @class UnitySpace.Storage.Controllers.UsersController
 * @namespace UnitySpace.Storage.Controllers
 * @extends UnitySpace.Storage.Controllers.BaseMockController
 * UsersController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Storage.Controllers.UsersController class
 */
UnitySpace.Storage.Controllers.UsersController = function() {
    UnitySpace.Storage.Controllers.UsersController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.Storage.Controllers.UsersController, UnitySpace.Storage.Controllers.BaseMockController, {

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

Engine.api.registrate("UnitySpace.Users", UnitySpace.Storage.Controllers.UsersController, true);// using Namespace

Ext.namespace("UnitySpace.Storage.Models");
// using Models.Namespace

UnitySpace.Storage.Models.User = {

};// using Namespace
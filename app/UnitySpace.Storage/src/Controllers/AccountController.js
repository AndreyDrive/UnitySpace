// using Controllers.BaseStorageController

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

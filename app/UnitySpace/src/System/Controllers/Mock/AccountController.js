// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.AccountController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * AccountController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.AccountController class
 */
UnitySpace.System.Controllers.Mock.AccountController = function() {
    UnitySpace.System.Controllers.Mock.AccountController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.Mock.AccountController, UnitySpace.System.Controllers.BaseController, {

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
        return null;
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
        return null;
});

Engine.api.registrate("UnitySpace.Account", UnitySpace.System.Controllers.Mock.AccountController);
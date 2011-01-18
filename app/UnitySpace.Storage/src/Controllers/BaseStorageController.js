// using Controllers.Namespace

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
});
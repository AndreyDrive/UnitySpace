// using System.Controllers.BaseController
// using System.Controllers.Mock.Mock

/**
 * @class UnitySpace.System.Controllers.Mock.RepositoryController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.Mock.RolesController class
 */
UnitySpace.System.Controllers.Mock.BaseMockController = function() {
    UnitySpace.System.Controllers.Mock.BaseMockController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.Mock.BaseMockController, UnitySpace.System.Controllers.BaseController, {
    success: function(data, successFn, responseFn) {
        this._safeCall(successFn, [this._response(data), null]);
        this._safeCall(responseFn, [null, true, this._response(data)]);
    },

    failure: function(message, failureFn, responseFn) {
        var data = {alert: message};
        this._safeCall(failureFn, [null, true, this._response(data)]);
        this._safeCall(responseFn, [this._response(data), null]);
    },

    _safeCall: function(fn, args) {
        if (fn != null)
            fn.defer(1, this, args, false);
    },

    _response: function(data) {
        return {responseData: data};
    }
});
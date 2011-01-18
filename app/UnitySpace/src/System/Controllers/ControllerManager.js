// using System.Controllers.Namespace
// using System.Engine

/**
 * @class UnitySpace.System.Controllers.ControllerManager
 * @namespace UnitySpace.System.Controllers
 * @extends Object
 * Controller manager class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.ControllerManager class
 */
UnitySpace.System.Controllers.ControllerManager = function() {
    UnitySpace.System.Controllers.ControllerManager.superclass.constructor.apply(this, arguments);
    this.controllers = {};
};

Ext.extend(UnitySpace.System.Controllers.ControllerManager, Object, {
    /**
     * Return controller instance by name
     * @param {String} name Name of controller
     */
    get: function(name) {
        var controller = this.controllers[name];
        if (!Ext.isDefined(controller))
            throw new UnitySpace.System.Controllers.ControllerException(
                    Resources.get("System.Controllers.ControllerNotRegistrate"),
                    name);

        if (!controller.instance) {
            var restfull = Engine.config.get('Connection.restfull', false);
            controller.instance = new controller.className({
                restfull: restfull
            });
        }

        return controller.instance;
    },

    /**
     * Registrate new controller.
     * @param {String} name Controller name
     * @param {Function} controllerClass Controller class
     * @param {Boolean} override Override
     */
    registrate: function(name, controllerClass, override) {
        if (Ext.isEmpty(name))
            throw new UnitySpace.ArgumentNullException("name");

        if (!override && Ext.isDefined(this.controllers[name]))
            throw new UnitySpace.System.Controllers.ControllerException(
                    Resources.get("System.Controllers.ControllerAlreadyRegistrate"),
                    name);
        
        this.controllers[name] = {
            className: controllerClass,
            instance: null
        };
    }
});

Engine.api = new UnitySpace.System.Controllers.ControllerManager();
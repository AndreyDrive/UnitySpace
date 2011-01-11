// using System.Modules.Namespace

/**
 * @class UnitySpace.System.Modules.BaseModule
 * @namespace UnitySpace.System.Modules 
 * @extends Ext.util.Observable
 * This is a base module class
 * @author Max Kazarin
 */
UnitySpace.System.Modules.BaseModule = Ext.extend(Ext.util.Observable, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: null,

    /**
     * List of required modules.
     * @type {String}
     */
    requiredModules: null,

    /**
     * Class resources
     * @type {Object}
     */
    resources: null,

    /**
     * Validate module requirement.
     */
    validate: function() {
        if (!this.name)
            throw new UnitySpace.System.Modules.ModuleException(this.resources.UnknownModuleName);

        if (!this.requiredModules)
            return;

        var requiredModules = this.requiredModules.split(',');
        for (var index = 0; index < requiredModules.length; index++) {
            var moduleName = requiredModules[index].trim();
            if (!Engine.isInitializeModule(moduleName))
                throw new UnitySpace.System.Modules.ModuleException(this.resources.RequiedModule, moduleName);
        }
    },

    /**
     * Publish new message throw pubsub channel.
     * @param eventName Event name to publish. For modules, chanel name is /module/{moduleName}/{eventName}
     * @param event Event object to publish
     */
    publish: function(eventName, event) {
        var eventChannel = '/modules/' + this.name.toLowerCase();

        if (Ext.isDefined(eventName))
            eventChannel +=  '/' + eventName;

        UnitySpace.System.Modules.BaseModule.superclass.publish(eventChannel, event);
    },

    subscribe: function(eventName, handler, scope, config) {
        var eventChannel = '/modules/' + this.name.toLowerCase();

        if (Ext.isDefined(eventName))
            eventChannel +=  '/' + eventName;

        UnitySpace.System.Modules.BaseModule.superclass.subscribe(eventName, handler, scope, config);
    },
    /**
     * Initialize module resources
     */
    initialize: function() {
    },

    /**
     * Dispose module resources
     */
    dispose: function() {
        
    }
});
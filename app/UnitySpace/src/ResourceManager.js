// using Namespace

/**
 * @class UnitySpace.Resources
 * @namespace UnitySpace
 * @extends Object
 * Resources class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Resources class
 */

var Resources = {
    set: function(config) {
        this.resources = config;
    },

    get: function(name, defaultValue) {
        var getter = new Function('resources', 'return resources.'+name);
        var value;
        try {
            value = getter(this.resources);
            value = Ext.isDefined(value) ? value : defaultValue;
        }
        catch (exception) {}

        return value
    }
};
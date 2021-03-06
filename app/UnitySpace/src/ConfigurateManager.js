/**
 * @class UnitySpace.ConfigurateManager
 * @namespace UnitySpace
 * @extends Object
 * ConfigurateManager class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.ConfigurateManager class
 */
UnitySpace.ConfigurateManager = function(configuration) {
    UnitySpace.ConfigurateManager.superclass.constructor.apply(this, arguments);
    this.configuration = configuration;
};

Ext.extend(UnitySpace.ConfigurateManager, Object, {
    get: function(name, defaultValue) {
        var getter = new Function('config', 'return config.'+name);
        var value;
        try {
            value = getter(this.configuration);
            value = Ext.isDefined(value) ? value : defaultValue;
        }
        catch (exception) {}

        return value
    },

    set: function(name, value) {
        var setter = new Function('config', 'value', 'return config.' + name + ' = value');
        try {
            setter(this.configuration, value);
        }
        catch (exception) {}
    }
});
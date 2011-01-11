// using System.Modules.Namespace

/**
 * @class UnitySpace.System.Modules.Project
 * @namespace UnitySpace.System.Modules
 * @extends Object
 * Project class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of Project class.
 * @param {Object} config Project configuration
 */
UnitySpace.System.Modules.Project = function(config) {
    this.initialize(config);
};

UnitySpace.System.Modules.Project = Ext.extend(Object, {
    // protected
    initialize: function(config) {
        //Ext.applyIf(this, config);
        this.id = config.id;
        this.name = config.name;
        this.roles = config.roles;
        this.applications = config.applications;
    }
});
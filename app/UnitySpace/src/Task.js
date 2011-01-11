// using Namespace

/**
 * @class UnitySpace.Task
 * @namespace UnitySpace
 * @extends Object
 * Task class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Task class
 */
UnitySpace.Task = function(config) {
    Ext.apply(this, config);
};

Ext.extend(UnitySpace.Task, Object, {

    // private
    defaultFn: function(synchronizer) {synchronizer();},

    /**
     * Task name
     */
    name: null,

    /**
     * Task method
     */
    method: this.defaultFn,

    /**
     * Task method scope
     */
    scope: window,

    /**
     * Last task flag
     */
    isLast: false,

    /**
     * Time to wait before execute task
     */
    wait: 0
});
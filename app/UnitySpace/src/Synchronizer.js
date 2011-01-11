// using Namespace

/**
 * @class UnitySpace.Synchronizer
 * @namespace UnitySpace
 * @extends Object
 * Synchronizer class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.Synchronizer class
 * @param {Number} count Count of object to synchronize
 */
UnitySpace.Synchronizer = function(count) {
    this.count = count;
};

Ext.extend(UnitySpace.Synchronizer, Object, {
    // protected
    count: 0,

    /**
     * Lock synchronizer. Decrease count of object to synchronize 
     */
    lock: function(){
        this.count--;

        return this.count > 0;
    }
});
// using System.Namespace

/**
 * @class UnitySpace.System.Manifest
 * @namespace UnitySpace.System
 * @extends Object
 * Manifest class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Manifest class
 */
UnitySpace.System.Manifest = function(config) {
    Ext.apply(this, config);
};

Ext.extend(UnitySpace.System.Manifest, Object, {
    namespace: 'Applications',
    name: null,
    title: null,
    authors: null,
    description: null,
    version: null,
    system: false,
    singleInstance: false,
    type: null
});
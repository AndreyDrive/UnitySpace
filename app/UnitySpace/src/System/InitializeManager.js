// using System.Namespace
// using System.SystemException

/**
 * @class UnitySpace.System.InitializeManager
 * @namespace UnitySpace.System
 * @extends Object
 * InitializeManager class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.InitializeManager class
 */
UnitySpace.System.InitializeManager = function() {
    UnitySpace.System.InitializeManager.superclass.constructor.apply(this, arguments);
    this.modules = [];
};

Ext.extend(UnitySpace.System.InitializeManager, Object, {
    add: function(modules) {
        if (Ext.isArray(modules))
            Ext.each(modules, this._add, this);
        else
            this._add(modules);
    },

    _add: function(moduleName) {
        if (this.modules.contains(moduleName))
            throw new UnitySpace.System.SystemException(Resources.get("System.InitializeManager.ModuleAlreadyAdd"), moduleName);

        this.modules.push(moduleName);
    },

    insertBefore: function(module, moduleName) {
        if (this.modules.contains(moduleName))
            throw new UnitySpace.System.SystemException(Resources.get("System.InitializeManager.ModuleAlreadyAdd"), moduleName);

        this.modules.insertBefore(module, moduleName);
    },

    insertAfter: function(module, moduleName) {
        if (this.modules.contains(moduleName))
            throw new UnitySpace.System.SystemException(Resources.get("System.InitializeManager.ModuleAlreadyAdd"), moduleName);

        this.modules.insertAfter(module, moduleName);
    },

    remove: function(moduleName) {
        this.modules.remove(moduleName);
    },

    getModule: function(index) {
        return this.modules[index];
    },

    getCount: function() {
        return this.modules.length;
    }
});
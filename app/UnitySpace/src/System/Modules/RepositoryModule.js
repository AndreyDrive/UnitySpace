// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.RepositoryModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * Repository module class. Used for manage repository. Module name is <strong>Repository</strong>
 * Required {@link UnitySpace.System.Modules.GINAModule}
 * @author Max Kazarin
 */
UnitySpace.System.Modules.RepositoryModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'Repository',

    /**
     * List of required modules.
     * @type {String}
     */
    requiredModules: 'GINA',
    
    manifestHash: null,

    /**
     * Initialize module resources
     */
    initialize: function() {
        UnitySpace.System.Modules.RepositoryModule.superclass.initialize.apply(this, arguments);
        this.manifestHash = {};
        this.reposirotyController = Engine.api.get('UnitySpace.Repository');

        this.publishInitialized();
    },

    /**
     * Get and load manifests from repository
     * @param name
     */
    get: function(name, callback) {
        if (Ext.isEmpty(name))
            throw new UnitySpace.ArgumentNullException('name');

        var names = name.split(',');
        var needManifestsToLoad = [];
        var needManifests = [];

        // check local manifest
        Ext.each(names, function(name) {
            var manifestName = name.trim();
            if (!Ext.isDefined(this.manifestHash[manifestName]))
                needManifestsToLoad.push(manifestName);
            needManifests.push(manifestName);
        }, this);

        if (needManifestsToLoad.length > 0) {
            this.reposirotyController.get(
                    needManifestsToLoad,
                    this.onGetSuccess.createDelegate(this, [needManifests, callback], true),
                    this.onGetFailure.createDelegate(this, [callback], true));
        }
        else
            this._getLocal(needManifests, callback)
    },

    // private
    onGetSuccess: function(response, options, needManifests, callback) {
        Ext.each(response.responseData, function(manifest) {
            this.manifestHash[manifest.name] = new UnitySpace.Manifest(manifest);
        }, this);

        this._getLocal(needManifests, callback);
    },

    // private
    onGetFailure: function(response, options, callback) {
        var message = UnitySpace.System.Net.ActionResponse.parse(response);
        Engine.error(new UnitySpace.System.Modules.ModuleException(message));
        callback();        
    },

    // private
    _getLocal: function(needManifests, callback) {
        var result = {};
        Ext.each(needManifests, function(manifest) {
            result[manifest] = this.manifestHash[manifest];
        }, this);

        callback(result);
    },
    
    /**
     * Check required manifest on repository 
     * @param name
     */
    required: function(name, callback) {
        if (Ext.isEmpty(name))
            throw new UnitySpace.ArgumentNullException('name');

        var names = name.split(',');
        var manifests = [];
        Ext.each(names, function(name) {
            manifests.push(name.trim());                
        }, this);

        this.reposirotyController.required(
                manifests,
                this.onRequiredSuccess.createDelegate(this, [callback], true),
                this.onRequiredFailure.createDelegate(this, [callback], true));
    },

    onRequiredSuccess: function(response, options, callback) {
        callback(true);
    },

    onRequiredFailure: function(response, options, callback) {
        var message = UnitySpace.System.Net.ActionResponse.parse(response);
        Engine.error(new UnitySpace.System.Modules.ModuleException(message));

        callback(false);
    },

    /**
     * Get all manifest from repository 
     * @param start
     * @param limit
     */
    list: function(start, limit) {

    }
});

Engine.registrate(UnitySpace.System.Modules.RepositoryModule);
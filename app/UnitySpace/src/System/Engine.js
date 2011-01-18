// using System.Namespace
// using TaskQueue
// using System.InitializeManager

/**
 * @class UnitySpace.System.Engine
 * @namespace UnitySpace.System
 * @extends Ext.utils.Observable
 * UnitySpace engine class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of engine class
 */

UnitySpace.System.Engine = function() {
    this.Module = {};
    this.modules = {};
    this.config = null;
    this.init = new UnitySpace.System.InitializeManager();
    this.taskQueue = new UnitySpace.TaskQueue();
};

Ext.extend(UnitySpace.System.Engine, Ext.util.Observable, {
    taskQueue: null,
    modules: null,

    /**
     * Initialize engine
     */
    initialize: function() {
        var console = new UnitySpace.System.Console();
        console.initialize();

        console.write('Initialize modules...\n');
        console.setTemplate('<div>Module {0}...<span style="float:right; color:{2}">[{1}]</span></div><div style="padding-left:20px; color:yellow;">{3}</div>');

        this.subscribe('/modules', this._moduleInitialized, this);
        this.initializedModules = 0;
        this._moduleInitialize();
    },

    _moduleInitialized: function(event, channel) {
        var eventName = channel
                .split('/')
                .pop();
        if (eventName == 'initialized' || eventName == 'error') {
            this.initializedModules++;
            if (this.initializedModules == this.init.getCount()) {
                this.unsubscribe('/modules', this._moduleInitialized);
            // initialize complete
            // run
                return;
            }
            
            this._moduleInitialize();
        }
    },

    _moduleInitialize:function () {
        var moduleName = this.init.getModule(this.initializedModules);
        if (!this.modules.hasOwnProperty(moduleName)) {
            log(String.format('Module {0} not initialize. Not registrate.', moduleName));
        }
        
        var moduleInfo = this.modules[moduleName];
        var errorMessage = null;
        var module = null;
        var result = true;
        try {
            module = new moduleInfo.className();
            module.validate();
            module.initialize();
            moduleInfo.instance = module;
            this.Module[module.name] = module;
        }
        catch(exception) {
            result = false;
            var message = exception.message;
            if (exception instanceof UnitySpace.Exception) {
                message = exception.message;
            }
            errorMessage = 'Error: '+message;
        }
/*        console.write(
                module.name,
                result ? 'OK' : 'FAILED',
                result ? 'green' : 'red',
                errorMessage);*/
        //return result;
    },

    /**
     * Run engine
     */
    run: function() {
        this.taskQueue.run();
    },

    /**
     * Add task to engine. Used in modules
     * @param {UnitySpace.Task} task Task object {@link UnitySpace.Task}
     */
    addTask: function(task) {
        this.taskQueue.add(task);
    },

    /**
     * Registrate module
     * @param {Function} className Class to registrate
     */
    registrate: function(className) {
        var name = className.prototype.name;
        if (!name)
            throw Resources.get("System.Modules.UnknownModuleName");

        this.modules[name] = {className: className};
    },

    /**
     * Check if module is initialized
     * @param {String} moduleName Module name
     */
    isInitializeModule: function(moduleName) {
        if (this.modules[moduleName] == null)
            return false;

        return (this.modules[moduleName].instance != null);
    },

    /**
     * Error
     * @param {String} message Error message
     */
    error: function(message) {
        if (message instanceof UnitySpace.Exception)
            this.publish('/error', message);
        else
            this.publish('/error', new UnitySpace.SystemException(message));
    },

    configurate: function(config) {
        this.config = new UnitySpace.ConfigurateManager(config);
    },

    /**
     * Dispose engine
     */
    dispose: function() {
        this.taskQueue.clear();

        Ext.each(this.modules, function(module) {
            try {
                module.instance.dispose();
            }
            catch(exception) {

            }
        }, this);

        delete this.modules;
        this.modules = null;
    }
});

var Engine = new UnitySpace.System.Engine();
Engine.init.add(["Debug"
    ,"ExtJS"
    ,"Keyboard"
    ,"GINA"
    ,"Repository"
    ,"ProjectProfile"]);

Ext.onReady(function() {
    Engine.initialize();
    Engine.run();
});
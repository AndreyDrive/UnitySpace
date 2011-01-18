// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.CommandShellModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * Command shell module class. Used for command parse and execute. Module name is <strong>CommandShell</strong>
 * Required {@link UnitySpace.System.Modules.ApplicationsCatalogModule} and
 * {@link UnitySpace.System.Modules.TaskManagerModule}
 * @author Max Kazarin
 */
UnitySpace.System.Modules.CommandShellModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'CommandShell',

    /**
     * List of required modules.
     * @type {String}
     */
    requiredModules: 'ApplicationsCatalog, TaskManager',

    /**
     * Initialize module resources
     */
    initialize: function() {
        UnitySpace.System.Modules.ErrorModule.superclass.initialize.apply(this, arguments);

        this.applicationCatalog = Engine.Module.ApplicationsCatalog;
        this.taskManager = Engine.Module.TaskManager;

        this.publishInitialized();
    },

    /**
     * Execute command
     * @param {String} cmdString Command string
     */
    exec: function(cmdString) {
        this.treadExec.defer(1, this, [cmdString]);
    },

    // protected
    treadExec: function(cmdString) {
        if (!cmdString)
            return;

        cmdString = cmdString.trim();
        var name = cmdString;
        var spaceIndex = cmdString.indexOf(' ');
        var cmdArguments = null;
        if (spaceIndex > 0) {
            name = cmdString.substr(0, spaceIndex);
            cmdArguments = cmdString.substr(spaceIndex + 1, cmdString.length - spaceIndex - 1);
            cmdArguments = cmdArguments.split(',');
        }

        if (this.execModule(name, cmdArguments)) return;

        this.execApplication(name, cmdArguments);
    },

    // protected
    // Execute application
    execApplication: function(name, cmdArguments) {
        var application = null;
        try {
            application = this.applicationCatalog.getApplication(name);
        }
        catch(e) {}

        if (!application)
            return false;

        this.taskManager.createTask(
            application,
            this.onCreateTask.createDelegate(this, [cmdArguments], true));

        return true;
    },

    // protected
    // Execute module method
    execModule: function(name, cmdArguments) {
        var module = null;
        try {
            module = Engine.Module[name];
        }
        catch(e) {}

        if (!module)
            return false;

        if (!cmdArguments || cmdArguments.length == 0)
            throw String.format(this.resources.EmptyModuleMethod, name);

        var method = cmdArguments[0];
        cmdArguments.shift();
        
        module[method].apply(module, cmdArguments);

        return true;
    },

    // protected
    // Configure task for execute
    onCreateTask: function(task, cmdArguments) {
        if (!task)
            return;

        task.main(cmdArguments);
    }
/*

    // protected
    // Set window start mode
    setWindowMode: function(window, runMode) {
        switch (runMode) {
            case WebDesktop.core.ERunMode.Minimized:
                window.minimize();
            break;
            case WebDesktop.core.ERunMode.Maximized:
                window.maximize();
            break;
        }
    }
*/
});

Engine.registrate(UnitySpace.System.Modules.CommandShellModule);
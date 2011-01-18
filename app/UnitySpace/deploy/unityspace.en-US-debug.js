/*!
 * UnitySpace license
 */
/*
var ControllerFactoryPool = new WebDesktop.core.ControllerFactoryPool('NET');

Ext.override(WebDesktop.core.modules.ExtJSModule, {
	prepareForDecode: function(response) {
        // For .net application server
        var dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g');
        if (response.responseText)
            response.responseText = response.responseText.replace(dateRegEx, "$1new Date($2)");
	}
});

Ext.override(WebDesktop.core.modules.GINAModule.UserProxy, {
	initialize: function(config) {
		//this.avatar = "JavaScripts/WebDesktop/deploy/resources/images/default/startmenu/default-user-icon.png";
        this.name = config.name;
		this.canChangePassword = config.canChangePassword;
		this.creationDate = config.creationDate;
		this.description = config.description;
		this.email = config.email;
		this.id = config.id;
		this.isApproved = config.isApproved;
		this.isLockedOut = config.isLockedOut;
		this.isOnline = config.isOnline;
		this.lastActivityDate = config.lastActivityDate;
		this.lastLockoutDate = config.lastLockoutDate;
		this.lastLoginDate = config.latLoginDate;
		this.lastPasswordChangeDate = config.lastPasswordChangeDate;
        this.fullName = '';
        if (config.lastName)
            this.fullName = config.lastName + ' ';
        if (config.lastName)
            this.fullName = config.firstName + ' ';
        if (config.middleName)
            this.fullName = config.middleName;

        if (this.fullName == '')
            this.fullName = config.name;

        this.avatar = 'JavaScripts/WebDesktop/deploy/resources/images/default/startmenu/default-user-icon.png';
	}
});*/
Ext.namespace('UnitySpace');// using Namespace

/**
 * @class UnitySpace.Exception
 * @namespace UnitySpace
 * @extends Object
 * Exception class
 * @author Max Kazarin
 * @constructor
 * Allows to define a simple or formatted string and pass an arbitrary number of parameters. Each
 * parameter must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
<pre><code>
throw new Exception('Simple exception message');
throw new Exception('Formatted exception message: {0}', 'argument length is null');
</code></pre>
 * @param {String} message Exception message.
 * @param {String} param1 (optional) First parameter of formated message
 * @param {String} param2 (optional) Etc..
 */
UnitySpace.Exception = function(message, param1, param2) {
    if (arguments.length === 0)
        return;

    this.message = arguments[0];

    if (this.message instanceof Error)
        this.message = this.message.message;

    if (arguments.length > 1) {
        arguments[0] = this.message;
        //var params = arguments.slice(1);
        //this.message = String.format(this.message, params);
        this.message = String.format.apply(this, arguments);
    }
};

Ext.extend(UnitySpace.Exception, Object, {
    /**
     * Exception message
     * @type {String}
     */
    message: null,

    /**
     * Exception name
     * @type {String}
     */
    name: 'Exception',

    toString: function() {
        return String.format('{0}: {1}', this.name, this.message);
    }
});// using Namespace
// using Exception
/**
 * @class UnitySpace.ArgumentNullException
 * @namespace UnitySpace
 * @extends UnitySpace.Exception
 * Argument null exception class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.ArgumentNullException class
 * @param {String} paramName Name of null parameter 
 */
UnitySpace.ArgumentNullException = function(paramName) {
    //UnitySpace.ArgumentNullException.constructor.apply(this, arguments);
    this.message = String.format(Resources.get("ArgumentNullException.Message"),  paramName);
    this.name = 'ArgumentNullException';
};

Ext.extend(UnitySpace.ArgumentNullException, UnitySpace.Exception, {});/**
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
});// using Namespace

/**
 * @class UnitySpace.PubSub
 * @namespace UnitySpace
 * @extends Ext.util.Observable
 * PubSub singleton class
 * @singleton
 * @author David Davis, Max Kazarin
 */
UnitySpace.PubSub = new Ext.util.Observable();

Ext.override(Ext.util.Observable, {

    /**
     * Subscribe on new event
     * @param {String} eventName Name of event to subscribe
     * @param {Function} handler Event handler function
     * @param {Object} scope Scope of event handler
     * @param {Object} config Event configuration object
     */
    subscribe: function( eventName, handler, scope, config ) {
        UnitySpace.PubSub.addEvents( eventName );
        UnitySpace.PubSub.on( eventName, handler, scope, config);
    },

    /**
     * Publish event. Send event to all channel and subchannel.
     * @param {String} eventName Name of event to publish
     * @param {Object} event Event object
     * @return {Boolean} returns true if any of the handlers return true or false otherwise it returns false;
     */
    publish: function( eventName, event ) {
        if ( UnitySpace.PubSub.eventsSuspended === true )
            return true;
        if ( !UnitySpace.PubSub.events )
            return false;

        // a global event listener
        var globalEventListener = UnitySpace.PubSub.events[ '*' ];
        if ( globalEventListener ) {
            if ( globalEventListener.fire.call( globalEventListener, event, eventName ) === false )
                return true;
        }

        var eventHandler = null;

        // send event to all channel and subchannel
        var channels = eventName.substr(1).split('/');
        var matched = false;
        do {
            eventHandler = UnitySpace.PubSub.events['/'+channels.join( '/' ).toLowerCase()];
            if ( eventHandler ) {
                matched = true;
                if ( eventHandler.fire.call( eventHandler, event, eventName ) === false )
                    return true;
            }
            channels.pop();
        } while (channels.length > 0);

        return matched;
    },

    unsubscribe: function(eventName, handler) {
        UnitySpace.PubSub.un( eventName, handler);        
    },

    /**
     * Remove events subscription
     * @param {String} eventName Name of event
     */
    removeSubcribers: function( eventName ) {
        for (var evt in UnitySpace.PubSub.events) {
            if ( evt == eventName ||
                 !eventName) {
                var eventHandler = UnitySpace.PubSub.events[evt];
                if (eventHandler)
                    eventHandler.clearListeners();
            }
        }
    }
});// using Namespace

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
};// using Namespace
// using ResourceManager

Resources.set({
    System: {
        InitializeManager: {
            ModuleAlreadyAdd: 'Module {0} already add.'  
        },
        Modules: {
            UnknownModuleName: 'Unknown module name.',
            RequiedModule: 'Module {0} required.',

            CommandShellModule: {
                EmptyModuleMethod: 'Empty module {0} method.'
            },
            ExtJSModule: {
                UnsupportHeaderType: 'Unsupported response header type.'
            },
            GINAModule: {
                UnknownCurrentUser: 'Unknown current user.'
            },
            ProjectProfileModule: {
                NullProjectName: '',
                ProfileNotLoaded: 'Project profile not loaded.'
            }
        },
        Net: {
            ActionResponse: {
                UnknownResponse: 'Unknown server response.'
            }
        },
        Controllers: {
            ControllerAlreadyRegistrate: 'Controller {0} already registrate.',
            ControllerNotRegistrate: 'Controller {0} not registrate.'
        },
        Security: {
            AuthenticateProviderManager: {
                ProviderAlreadyRegistrate: 'Authenticate provider {0} already registrate.',
                ProviderNotRegistrate: 'Authenticate provider {0} not registrate.'
            }
        }
    },
    ArgumentNullException: {
        Message: 'Argument {0} is null.'
    }
});// using Namespace

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
});// using Namespace
// using Resources

Ext.namespace('UnitySpace.System.Net');
// using System.Net.Namespace
// using Exception
/**
 * @class UnitySpace.System.ApplicationException
 * @namespace UnitySpace.System
 * @extends UnitySpace.Exception
 * Application error class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of ApplicationException class
 */
UnitySpace.System.ApplicationException = function() {
    UnitySpace.System.ApplicationException.superclass.constructor.apply(this, arguments);
    this.name = 'ApplicationException';
};

Ext.extend(UnitySpace.System.ApplicationException, UnitySpace.Exception, {});
// using Namespace
// using Resources

Ext.namespace('UnitySpace.System');
// using System.Namespace

/**
 * @class UnitySpace.System.Console
 * @namespace UnitySpace.System
 * @extends Object
 * Console class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Console class
 */
UnitySpace.System.Console = function() {
    UnitySpace.System.Console.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Console, Object, {
    name: 'Console',
    outputElement: null,
    template: null,

    /**
     * Initialize console
     */
    initialize: function() {
        this.outputElement = Ext.getBody().insertHtml('beforeEnd', '<div id="console"></div>', true);
    },

    /**
     * Write to console
     * @param {String} message Console message
     */
    write: function(message) {
        if (!this.template)
            this.outputElement.insertHtml('beforeEnd', message);
        else
            this.template.append(this.outputElement, arguments);
    },

    /**
     * Set console template
     * @param {String} template Console template
     */
    setTemplate: function(template) {
        this.template = new Ext.Template(template);
        this.template.compile();
    },

    /**
     * Clear console template
     */
    clearTemplate: function() {
        if (this.template) {
            delete this.template;
            this.template = null;
        }
    },

    /**
     * Close console
     */
    close: function() {
        this.outputElement.remove();
    }
});// using System.Namespace

Ext.namespace('UnitySpace.System.Controllers');// using Namespace

/**
 * @class UnitySpace.TaskQueue
 * @namespace UnitySpace
 * @extends Ext.util.Observable
 * Task queue class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.TaskQueue class
 */
UnitySpace.TaskQueue = function(config) {
    UnitySpace.TaskQueue.superclass.constructor.apply(this, arguments);

    Ext.apply(this, config);
    this.addEvents('run','stop');
    this.tasks = new Array();
    this.lastTasks = new Array();
};

Ext.extend(UnitySpace.TaskQueue, Ext.util.Observable, {
    tasks: null,
    lastTasks: null,
    sync: true,
    activeTasks: 0,
    isRunning: false,
    hasError: false,

    /**
     * Add new task to queue
     * @param {UnitySpace.Task} task Task description object {@link UnitySpace.Task}
     */
    add: function(task) {
        /*task = Ext.applyIf(task, {
            //method: null,
            //scope: this,
            isLast: false,
            wait: 0
        });*/

        if (task.isLast)
            this.lastTasks.push(task);
        else
            this.tasks.push(task);
    },

    /**
     * Remove task from queue
     * @param {UnitySpace.Task} task Task description object {@link UnitySpace.Task}
     */
    remove: function(task) {
        for (var index = 0; index < this.tasks.length; index++) {
            if (this.tasks[index] === task) {
                this.tasks.splice(index, 1);
                break;
            }
        }
    },

    /**
     * Clear task queue
     */
    clear: function() {
        this.stop();
        
        this.tasks = new Array();
        this.lastTasks = new Array();
    },

    /**
     * Stop run tasks execute
     */
    stop: function() {
        this.isRunning = false;
        this.fireEvent('stop', this);
        this.destroy();
    },

    /**
     * Run tasks execute
     */
    run: function() {
        if (this.isRunning)
            return;
        this.hasError = false;

        this.prepareTasks();        
        this.runEntry();
    },

    // protected
    prepareTasks: function() {
        if (!this.lastTasks)
            return;

        this.tasks = this.tasks.concat(this.lastTasks);
        this.lastTasks = null;
    },

    // protected
    runEntry: function() {
        if (this.sync)
            this.runSync();
        else
            this.runAsync();
    },

    // protected
    runSync: function() {
        if (this.isRunning && this.tasks.length === 0) {
            this.stop();
            return;
        }

        var task = this.getNextTask();
        if (task != null) {
            this.isRunning = true;
            this.fireEvent('run', this);
                this.runTask(task);
        }
    },

    // private
    runAsync: function() {
        if (this.isRunning) {
            this.activeTasks--;
            if (this.tasks.length === 0 && this.activeTasks === 0) {
                this.stop();
            }
            return;
        }

        var task = this.getNextTask();
        if (task != null) {
            this.isRunning = true;
            this.fireEvent('run', this);

            do {
                this.activeTasks++;
                this.runTask(task);
            }
            while ((task = this.getNextTask()) != null);
        }
    },

    // protected
    getNextTask: function() {
        return this.tasks.shift();
    },

    // protected
    runTask: function(task) {
        var param = [function(withError, cancel) {
            if (withError)
                this.hasError = true;
            if (!cancel)
                this.runEntry.defer(1, this);
            else
                this.stop();
        }.createDelegate(this)];

        if (task.params)
            param = param.concat(task.params);

        if (task.wait > 0)
            task.method.defer(task.wait, task.scope, param);
        else if (!this.sync)
            task.method.defer(1, task.scope, param);
        else {
            var fn = task.method.createDelegate(task.scope, param);
            fn();
        }
    },

    /**
     * Destroy class instance
     */
    destroy: function() {
        if (this.lastTasks)
            delete this.lastTasks;
        if (this.tasks)
            delete this.tasks;
    }
});// using System.Net.Namespace
// using Exception
/**
 * @class UnitySpace.System.SystemException
 * @namespace UnitySpace.System
 * @extends UnitySpace.Exception
 * Application error class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of SystemException class
 */
UnitySpace.System.SystemException = function() {
    UnitySpace.System.SystemException.superclass.constructor.apply(this, arguments);
    this.name = 'SystemException';
};

Ext.extend(UnitySpace.System.SystemException, UnitySpace.Exception, {});
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
});// using System.Namespace
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
});// using System.Controllers.Namespace
// using System.Engine

/**
 * @class UnitySpace.System.Controllers.ControllerManager
 * @namespace UnitySpace.System.Controllers
 * @extends Object
 * Controller manager class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.ControllerManager class
 */
UnitySpace.System.Controllers.ControllerManager = function() {
    UnitySpace.System.Controllers.ControllerManager.superclass.constructor.apply(this, arguments);
    this.controllers = {};
};

Ext.extend(UnitySpace.System.Controllers.ControllerManager, Object, {
    /**
     * Return controller instance by name
     * @param {String} name Name of controller
     */
    get: function(name) {
        var controller = this.controllers[name];
        if (!Ext.isDefined(controller))
            throw new UnitySpace.System.Controllers.ControllerException(
                    Resources.get("System.Controllers.ControllerNotRegistrate"),
                    name);

        if (!controller.instance) {
            var restfull = Engine.config.get('Connection.restfull', false);
            controller.instance = new controller.className({
                restfull: restfull
            });
        }

        return controller.instance;
    },

    /**
     * Registrate new controller.
     * @param {String} name Controller name
     * @param {Function} controllerClass Controller class
     * @param {Boolean} override Override
     */
    registrate: function(name, controllerClass, override) {
        if (Ext.isEmpty(name))
            throw new UnitySpace.ArgumentNullException("name");

        if (!override && Ext.isDefined(this.controllers[name]))
            throw new UnitySpace.System.Controllers.ControllerException(
                    Resources.get("System.Controllers.ControllerAlreadyRegistrate"),
                    name);
        
        this.controllers[name] = {
            className: controllerClass,
            instance: null
        };
    }
});

Engine.api = new UnitySpace.System.Controllers.ControllerManager();// using System.Controllers.Namespace
// using System.Controllers.ControllerManager

/**
 * @class UnitySpace.System.Controllers.BaseController
 * @namespace UnitySpace.System.Controllers
 * @extends Object
 * BaseController class
 * @author Max Kazarin
 * @constructor
 * Create new instance f UnitySpace.System.Controllers.BaseController class
 */
UnitySpace.System.Controllers.BaseController = function(config) {
    UnitySpace.System.Controllers.BaseController.superclass.constructor.apply(this, arguments);
    
    Ext.apply(this, config);
};

Ext.extend(UnitySpace.System.Controllers.BaseController, Object, {
    /**
     * Default request format. Default value json.
     */
    defaultFormat: 'json',

    /**
     * RESTfull flag. If true then add .format to end of url. Default false.
     */
    restfull: false,

    // protected
    getName: function() {
        return null;
    },

    // private
	getUrl: function(methodName, format) {

        var name = this.getName();

        if (methodName)
            if (name && name != '')
                name += '/' + methodName;
            else
                name = methodName;

        if (!this.restfull)
            name += '.'+this.getFormat(format);
        return name;
	},

    // private
    getFormat: function(format) {
        if (!format)
            return this.defaultFormat;

        return format;
    },

    // private
    getHeader: function(format) {
        switch (format) {
            case 'json':
                return {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                };
            case 'xml':
                    //TODO Добавить формат для xml.
            break;
            case 'html':
                    //TODO Добавить формат для html
            break;
        }
    },

    // private
    getData: function(method, params, format) {
        switch (format) {
            case 'json':
                if (method == 'GET')
                    return {params: params};
                else
                    return { jsonData: Ext.encode(params) };
            case 'xml':
                return { xmlData: params };
            default:
                return { params: params };
        }
    },

    /**
     * Invoke controller request
     * @param {String} methodName Method name
     * @param {String} method Http method name GET, POST, PUT, DELETE
     * @param {Object} params Parameters to send
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    invoke: function(methodName, method, params, successFn, failureFn, responseFn, format) {
	    var headerFormat = this.getFormat(format);
        var config = {
            url: this.getUrl(methodName, format),
            method: method,
            disableCaching: false,
            success: Ext.isDefined(successFn) ? successFn.safe() : null,
            failure: Ext.isDefined(failureFn) ? failureFn.safe() : null,
            callback: Ext.isDefined(responseFn) ? responseFn.safe(): null
        };

        Ext.apply(config, this.getHeader(headerFormat));
        Ext.apply(config, this.getData(method, params, headerFormat));

        Ext.Ajax.request(config);
    }
});// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.AccountController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * AccountController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.AccountController class
 */
UnitySpace.System.Controllers.AccountController = function() {
    UnitySpace.System.Controllers.AccountController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.AccountController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Signin. Request url POST /signin.
     * @param {String} userName User name
     * @param {String} password User password
     * @param {Boolean} remember User remember flag
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    signin: function(userName, password, remember, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/signin',
            'POST',
            {
                model : {
                    name: userName,
                    password: password,
                    remember: remember
                }
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Signout. Request url DELETE /signout
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    signout: function(successFn, failureFn, responseFn, format) {
        this.invoke(
            '/signout',
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Get current user. Request url GET /user
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user',
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Account", UnitySpace.System.Controllers.AccountController);// using System.Controllers.Namespace
// using Exception

/**
 * @class UnitySpace.System.Controllers.ControllerException
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.Exception
 * Controller exception class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.ControllerException class
 * @param {String} paramName Name of null parameter
 */

UnitySpace.System.Controllers.ControllerException = function() {
    UnitySpace.System.Controllers.ControllerException.superclass.constructor.apply(this, arguments);
    this.name = 'ControllerException';
};

Ext.extend(UnitySpace.System.Controllers.ControllerException, UnitySpace.Exception, {});
// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.ProjectsController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * ProjectsController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.ProjectsController class
 */
UnitySpace.System.Controllers.ProjectsController = function() {
    UnitySpace.System.Controllers.ProjectsController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.ProjectsController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Get project by id. Request url GET /project/(projectId)
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(projectId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/'+projectId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Get all project of user. Request url GET project/user/(userId)
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getAll: function(userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/user/'+userId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Get current project of user. Request url GET /project/current/user/(userId).
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getCurrent: function(userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/current/user/'+userId,
            url,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

        /**
     * Set current project for user. Request url GET /project/current/user/(userId).
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    setCurrent: function(projectId, userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/current/user/'+userId,
            'POST',
            {projectId: projectId},
            successFn,
            failureFn,
            responseFn,
            format);
    },

        /**
     * Get project components. Request url GET /project/(projectId)/applications.
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getApplications: function(projectId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/'+projectId+'/applications',
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Create new project. Request url POST /project.
     * @param {Object} project Project object.
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    create: function(project, successFn, failureFn, responseFn, format) {
        this.invoke(
            'project',
            'POST',
            {
                project: project
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Change user. Request url PUT /project/(projectId).
     * @param {Number} projectId Project id
     * @param {Object} project Project object
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    change: function(projectId, project, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/'+projectId,
            'PUT',
            {
                project: project
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Remove user. Request url PUT /project/(projectId).
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    remove: function(projectId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/project/'+projectId,
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Projects", UnitySpace.System.Controllers.ProjectsController);// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.RepositoryController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.RolesController class
 */
UnitySpace.System.Controllers.RepositoryController = function() {
    UnitySpace.System.Controllers.RepositoryController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.RepositoryController, UnitySpace.System.Controllers.BaseController, {
});

Engine.api.registrate("UnitySpace.Repository", UnitySpace.System.Controllers.RepositoryController);// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.RolesController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * RolesController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.RolesController class
 */
UnitySpace.System.Controllers.RolesController = function() {
    UnitySpace.System.Controllers.RolesController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.RolesController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Get all roles. Requesr url GET /roles.
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function (successFn, failureFn, responseFn, format){
        this.invoke(
            '/roles',
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Set user roles in project. Request url POST /project/(projectId)/user/(userId)
     * @param {Number} projectId Project id
     * @param {Number} userId User id
     * @param {Array} roles Roles
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    create: function (projectId, userId, roles, successFn, failureFn, responseFn, format){
        this.invoke(
            '/project/'+projectId+'/user/'+userId,
            'POST',
            {
                roles: roles
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Remove user roles in project. Request url DELET /project/(projectId)/user/(userId)
     * @param {Number} projectId Project id
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    remove: function (projectId, userId, successFn, failureFn, responseFn, format){
        this.invoke(
            '/project/'+projectId+'/user/'+userId,
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Roles", UnitySpace.System.Controllers.RolesController);// using System.Controllers.BaseController

/**
 * @class UnitySpace.System.Controllers.UsersController
 * @namespace UnitySpace.System.Controllers
 * @extends UnitySpace.System.Controllers.BaseController
 * UsersController class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.UsersController class
 */
UnitySpace.System.Controllers.UsersController = function() {
    UnitySpace.System.Controllers.UsersController.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Controllers.UsersController, UnitySpace.System.Controllers.BaseController, {

    /**
     * Get user in project by id. Request url GET /user/(userId)/project/(projectId)/.
     * @param {Number} projectId Project id
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    get: function(projectId, userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/'+userId+'/project/'+projectId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Get users in project by id. Request url GET /user/project/(projectId).
     * @param {Number} projectId Project id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    getAll: function(projectId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/project/'+projectId,
            'GET',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Create new user. Request url POST /user/project/(projectId)
     * @param {Number} projectId Project id.
     * @param {Object} user User object
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    create: function(projectId, user, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/project/' + projectId,
            'POST',
            {
                user: user
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Change user. Request url PUT /user/(userId).
     * @param {Number} userId User id
     * @param {Object} user User object
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    change: function(userId, user, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/'+userId,
            'PUT',
            {
                user: user
            },
            successFn,
            failureFn,
            responseFn,
            format);
    },

    /**
     * Remove user. Request url DELETE /user/(userId).
     * @param {Number} userId User id
     * @param {Function} successFn Success callback function
     * @param {Function} failureFn Failure callback function
     * @param {Function} responseFn Response callback function
     * @param {String} format (optional) format
     */
    remove: function(userId, successFn, failureFn, responseFn, format) {
        this.invoke(
            '/user/'+userId,
            'DELETE',
            null,
            successFn,
            failureFn,
            responseFn,
            format);
    }
});

Engine.api.registrate("UnitySpace.Users", UnitySpace.System.Controllers.UsersController);// using System.Namespace

/**
 * @class UnitySpace.System.EManifestType
 * @namespace UnitySpace.System
 * @extends Object
 * EManifestType enumerator
 * @author Max Kazarin
 * @singleton
 */
UnitySpace.System.EManifestType = {

    /**
     * Window application type
     */
    WindowApplication: 1,

    /**
     * Console application type
     */
    ConsoleApplication: 2,

    /**
     * Control library type
     */
    ControlLibrary: 10,

    /**
     * Class library type
     */
    ClassLibrary: 11
};// using System.Namespace

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
});// using System.Namespace
// using Resources

Ext.namespace('UnitySpace.System.Modules');
// using System.Modules.Namespace

/**
 * @class UnitySpace.System.Modules.BaseModule
 * @namespace UnitySpace.System.Modules 
 * @extends Ext.util.Observable
 * This is a base module class
 * @author Max Kazarin
 */
UnitySpace.System.Modules.BaseModule = Ext.extend(Ext.util.Observable, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: null,

    /**
     * List of required modules.
     * @type {String}
     */
    requiredModules: null,

    /**
     * Class resources
     * @type {Object}
     */
    resources: null,

    /**
     * Validate module requirement.
     */
    validate: function() {
        if (!this.name)
            throw new UnitySpace.System.Modules.ModuleException(this.resources.UnknownModuleName);

        if (!this.requiredModules)
            return;

        var requiredModules = this.requiredModules.split(',');
        for (var index = 0; index < requiredModules.length; index++) {
            var moduleName = requiredModules[index].trim();
            if (!Engine.isInitializeModule(moduleName))
                throw new UnitySpace.System.Modules.ModuleException(this.resources.RequiedModule, moduleName);
        }
    },

    /**
     * Publish new message throw pubsub channel.
     * @param eventName Event name to publish. For modules, chanel name is /module/{moduleName}/{eventName}
     * @param event Event object to publish
     */
    publish: function(eventName, event) {
        var eventChannel = '/modules/' + this.name.toLowerCase();

        if (Ext.isDefined(eventName))
            eventChannel +=  '/' + eventName;

        UnitySpace.System.Modules.BaseModule.superclass.publish(eventChannel, event);
    },

    subscribe: function(eventName, handler, scope, config) {
        var eventChannel = '/modules/' + this.name.toLowerCase();

        if (Ext.isDefined(eventName))
            eventChannel +=  '/' + eventName;

        UnitySpace.System.Modules.BaseModule.superclass.subscribe(eventName, handler, scope, config);
    },
    /**
     * Initialize module resources
     */
    initialize: function() {
        log(String.format('Initialize module {0}.', this.name));
    },

    publishInitialized: function() {
        this.publish('initialized');
    },

    publishError: function(error) {
        this.publish('error');
    },
    /**
     * Dispose module resources
     */
    dispose: function() {
        
    }
});// using System.Modules.BaseModule

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

Engine.registrate(UnitySpace.System.Modules.CommandShellModule);// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.DebugModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * Debug module class. Used for console logging in debug mode. Module name is <strong>Debug</strong>
 * No required modules.
 * @author Max Kazarin
 */

UnitySpace.System.Modules.DebugModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'Debug',

    /**
     * Initialize module resources
     */    
    initialize: function() {
        UnitySpace.System.Modules.DebugModule.superclass.initialize.apply(this, arguments);

        if (!Ext.isDefined(DEBUG))
            return;

        //DEBUG = true;
/*
        var doMock = Engine.config.get('Debug.mock', false);
        if (doMock) {
            log('Mock enable');
            UnitySpace.System.Controllers.Mocking();
        }
*/
        //log = log4javascript.getLogger();
		// Create a PopUpAppender with default options
		//var popUpAppender = new log4javascript.InPageAppender();
        //var popUpAppender = new log4javascript.PopUpAppender();
        //var popUpAppender = new log4javascript.BrowserConsoleAppender();

		// Change the desired configuration options
		//popUpAppender.setFocusPopUp(true);
		//popUpAppender.setNewestMessageAtTop(true);

		// Add the appender to the logger
		//log.addAppender(popUpAppender);

        this.subscribe( '*', this._logChannels);

        this.publishInitialized();
    },

    /**
     * @private
     * Log channels activity
     * @param {Object} event Event object
     * @param {String} channel Channel name
     */
    _logChannels: function(event, channel) {
        var message = event;

        if (event instanceof UnitySpace.Exception)
            message = event.toString();
        else if (Ext.isFunction(event))
            message = 'function';
        else if (Ext.isObject(event))
            message = 'object';
        else if (!Ext.isDefined(event))
            message = '';

        log(String.format('channel: [{0}] {1}', channel, message));
    }
});

Engine.registrate(UnitySpace.System.Modules.DebugModule);
// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.ExtJSModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * ExtJS module. Used for integrate ExtJS framework. Module name is <strong>ExtJS</strong>
 * No required modules.
 * @author Max Kazarin
 */
UnitySpace.System.Modules.ExtJSModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'ExtJS',

    /**
     * Initialize module resources
     */
    initialize: function() {
        UnitySpace.System.Modules.ExtJSModule.superclass.initialize.apply(this, arguments);

        //2010-08-04T12:31:34Z
        Ext.DefaultDateFormat = 'Y-m-d\\TH:i:s\\Z';
        Ext.BLANK_IMAGE_URL = 'javascripts/ext-3.3.0/resources/images/default/s.gif';
        Ext.QuickTips.init();

        Ext.PAGE_SIZE = 10;
        Ext.LoadMask.prototype.msgCls = 'x-mask-loading';

        Ext.Ajax.defaultHeaders = {
	        'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        };

        this.hookException();

        this.hookNetwork();

        this.hookRest();

        this.publishInitialized();
    },

    // private
    // Hook rest behavior of extjs
    hookRest: function() {
        Ext.urlEncode  = function(o, pre){
            //Debug();
            var empty,
                buf = [],
                e = encodeURIComponent;

            Ext.iterate(o, function(key, item){
                empty = Ext.isEmpty(item);
                if (!empty)
                    Ext.each(empty ? key : item, function(val){
                        buf.push('/', e(key), '/', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? Ext.encode(val).replace(/"/g, '') : e(val)) : '');
                    });
            });
            if(!pre){
                buf.shift();
                pre = '';
            }
            return pre + buf.join('');
        };

        Ext.urlAppend = function(url, s){
            if(!Ext.isEmpty(s)){
                return url + '/' + s;
            }
            return url;
        }

    },

    // private
    // Hook exception handling
    hookException: function() {
        if (!DEBUG)
            this._initializeExtErrorHandler();
        //this._initializeConnection();
        Ext.apply(Function.prototype, {
            safe: function() {
                var method = this;
                return function() {
                    if (!DEBUG)
                        try {
                            method.apply(this, arguments)
                        }
                        catch(exception) {
                            Engine.error(new UnitySpace.System.ApplicationError(exception));
                        }
                    else
                        method.apply(this, arguments)
                }
            }
        });
    },

    // private
    // Error handler
    _initializeExtErrorHandler: function() {
        var baseFire =  Ext.util.Event.prototype.fire;
        Ext.util.Event.prototype.fire = function() {
            var result = false;
            try{
                result = baseFire.apply(this, arguments);
            }
            catch(exception) {
                Engine.error(new UnitySpace.System.ApplicationError(exception));
            }
            return result;
        };
  /*
        var baseCreateListener = Ext.util.Event.prototype.createListener;
        Ext.util.Event.prototype.createListener = function(fn, scope, o){
            var safeFn = function() {
                try{
                    fn.apply(scope, arguments);
                }
                catch(exception) {
                    GlobalErrorHandler(exception);
                }
            };

            var result = baseCreateListener.apply(this, [safeFn, scope, o]);
            result.fn = fn;
            return result;
        };*/
    },

    // private
    // Hook extjs network behavior
    hookNetwork: function() {
        Ext.Ajax.on('requestcomplete', function(conn, response, options) {
            try {
                var header = response.getAllResponseHeaders();
                log('url='+options.url + '\nheader=' +header);
                //if (options.headers.Accept.indexOf('application/json') != -1)
                if (header.indexOf('application/json') != -1)
                    this.decodeResponse(response);
            }
            catch(exception) {
                response.responseData = null;
                options.success = null;
                Engine.error(new UnitySpace.System.Net.ConnectionException(exception));
            }
        }, this);

        Ext.Ajax.on('requestexception',  function(conn, response, options) {
            if (response.isTimeout) {
                return;
            }

            if (response.isAbort)  {
                return;
            }

            try {
                if (response.status == 0 || !Ext.isDefined(response.responseText))
                    throw response.statusText;

                if (!options.headers.Accept)
                    this.decodeResponse(response);
                else if (options.headers.Accept.indexOf('application/json') != -1)
                    this.decodeResponse(response);


                if (response.responseData && !UnitySpace.System.Net.ActionResponse.canParse(response))
                    throw response.responseText;
            }
            catch(exception) {
                response.responseData = null;
                options.failure = null;
                Engine.error(new UnitySpace.System.Net.ConnectionException(exception));                
            }
        }, this);

    },

    // private
    // Prepare response for further decoding.
    prepareForDecode: Ext.emptyFn,
    
    // private
    // Decode response. Some server send encoded result
    decodeResponse: function(response) {
        this.prepareForDecode(response);

        if (!response.getResponseHeader) {
            response.responseData = Ext.decode(response.responseText);
            return;
        }

        var contentType = response.getResponseHeader('Content-Type');
        response.responseData = null;
        if (!contentType)
            return;

        if (contentType.indexOf('json') != -1) {
            if (response.responseText && response.responseText.trim() != '')
                response.responseData = Ext.decode(response.responseText);
        }
        else
            throw this.resources.UnsupportHeaderType;
    }
});

Engine.registrate(UnitySpace.System.Modules.ExtJSModule);
// using System.Namespace

Ext.namespace('UnitySpace.System.Security');
// using System.Security.Namespace

/**
 * @class UnitySpace.System.Security.Ability
 * @namespace UnitySpace.System.Security
 * @extends Object
 * Ability class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.Ability class
 */
UnitySpace.System.Security.Ability = function() {
    UnitySpace.System.Security.Ability.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Security.Ability, Object, {
    context: null,

    initialize: function(user, project) {
        this.user = user;
        this.project = project;
    },

    ability: function(project) {
        this.context = {
            user: this.user,
            project: project ? project : this.project
        };

        return this;
    },

    can: function(name) {
        var result = null;
        var can = null;

        var roles = this.context.project.roles;
        if (!roles)
            return false;

        for (var index = 0; index <= roles.length; index++) {
            if (index == roles.length) {
                can = this.rules.All[name];
            }
            else {
                var rules = this.rules[roles[index]];
                if (!rules)
                    continue;

                can = rules[name];
            }

            if (Ext.isFunction(can)) {
                var arg = null;
                if (arguments.length > 1) {
                    arg = [];
                    for (index = 1; index < arguments.length; index++)
                        arg.push(arguments[index]);
                }
                result = can.apply(this, arg);
            }
            else
                result = can;

            if (result != null)
                return result;
        }

        return false;
    },

    rules: {
        Owner: {
            leave_project: false,
            edit_project: true,
            read_application: true,
            remove_project: true,

            remove_user: function(roles) {
                return roles.indexOf('Owner') == -1;
            },
            edit_user: true,
            read_roles: true,
            add_user: true
        },
        Admin: {
            edit_project: true,
            read_application: true,

            remove_user: function(roles) {
                return roles.indexOf('Owner') == -1;
            },
            edit_user: function(roles) {
                return roles.indexOf('Owner') == -1;
            },
            read_roles: true,
            add_user: true
        },
        All: {
            switch_project: function(projectId) {
                return this.project.id != projectId;
            },
            leave_project: true,
            //switch_project: true//,
            read_user: true
        }
    }
});

//Security.Ability.Rules = Security.Ability.prototype.rules;// using System.Modules.BaseModule
// using System.Security.Ability

/**
 * @class UnitySpace.System.Modules.DebugModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * GINA module class. GINA - Graphical Identification and Authentication. Module name is <strong>GINA</strong>
 * No required modules.
 * @author Max Kazarin
 */
UnitySpace.System.Modules.GINAModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'GINA',

    /**
     * Initialize module resources
     */
    initialize: function() {
        UnitySpace.System.Modules.GINAModule.superclass.initialize.apply(this, arguments);

        this.ability = new UnitySpace.System.Security.Ability();

        this.accountController = Engine.api.get("UnitySpace.Account");

        this.rolesInitialize();
        this.authenticate();
/*
        Engine.addTask({
            method: this.authenticate
            ,scope: this
            //,isLast: true
        });
*/

        //this.initialized();
    },

    // private
    rolesInitialize: function(synchronizer) {
        var rolesController = Engine.api.get("UnitySpace.Roles");
        rolesController.get(
            this.onInitializeRolesSuccess.createDelegate(this, [synchronizer], true),
            this.onInitializeRolesFailure.createDelegate(this, [synchronizer], false)
        );
    },

    // private
    onInitializeRolesSuccess: function(response) {
        this.roles = response.responseData;
    },

    // private
    onInitializeRolesFailure: function(response) {
        Engine.error(new UnitySpace.System.Net.ConnectionException(response.responseData));
    },

    // private
    authenticate: function() {
        this.logon();
    },

    /**
     * Return roles;
      */
    getRoles: function() {
        return this.roles;
    },

    /**
     * Logon
     */
    logon: function() {
        this.accountController.get(
                this.onGetCurrentUserSuccess.createDelegate(this),
                this.onGetCurrentUserFailure.createDelegate(this));
    },

    // private
    onGetCurrentUserSuccess: function(response) {
        debug();
        this.setCurrentUser(response.responseData);
        this.publish( 'logon');
    },

    // private
    onGetCurrentUserFailure: function(response) {
        if (response.status != 401) {
            Engine.error(new UnitySpace.System.Net.ConnectionException(response.responseData));
            return;
        }

/*
        this.publish('beforelogon', {
            validate: this.validateUser.createDelegate(this),
            complite: this.completeLogon.createDelegate(this)            
        });
*/
        var providerName = Engine.config.get('Authenticate.type', 'FormAuthenticate');
        var provider = Engine.authenticateProviders.get(providerName);

        this.publish('beforelogon', provider);
        this.validateUser(provider);
/*
        this.logonWindow = new WebDesktop.controls.LogonWindow({
            listeners: {
                validate: this.validateUser,
                close: this.completeLogon,
                scope: this
            }
        });
        this.logonWindow.show();
*/
    },

    // private
    validateUser: function(provider) {

        provider.authenticate(
            this.onValidateUserSuccess.createDelegate(this),
            this.onValidateUserFailure.createDelegate(this));
/*
        this.accountController.signin(
            name,
            password,
            rememberMe,
            this.onValidateUserSuccess.createDelegate(this),
            this.onValidateUserFailure.createDelegate(this));
*/
    },

    // private
    onValidateUserSuccess: function(response) {
        this.setCurrentUser(response.responseData);
        this.publishInitialized();
        this.publish('logon');
    },

    onValidateUserFailure: function(response) {
        var message = UnitySpace.System.Net.ActionResponse.parse(response);
        this.publishError(new UnitySpace.System.Net.ModuleException(message));
    },
    /**
     * Logoff
     */
    logoff: function() {
        this.publish( 'logoff');
    },

    // private
    continueLogoff: function() {
        this.accountController.signout(
                this.onLogoffSuccess.createDelegate(this),
                this.onLogoffFailure.createDelegate(this));
    },

    // private
    onLogoffSuccess:function() {
        this.setCurrentUser();
        this.logon();
    },

    // private
    onLogoffFailure: function(response) {
        var message = UnitySpace.System.Net.ActionResponse.parse(response);
        Engine.error(new UnitySpace.System.Net.ConnectionException(message));
    },

    // private
    setCurrentUser: function(user) {
        if (!user)
            this.currentUser = null
        else
            this.currentUser = new UnitySpace.System.Modules.User(user);
    },

    /**
     * Return current user with ability
     * @return {Object} Current user
     */
    getCurrentUser: function() {
        if (!this.currentUser)
            throw this.resources.UnknownCurrentUser;
        if (!this.currentUser['ability']) {
            this.ability.user = this.currentUser;
            this.currentUser['ability'] = this.ability.ability.createDelegate(this.ability);
        }

        return this.currentUser;
    },

    /**
     * Check if user is current.
     * @param {String} name User name
     */
    isCurrentUser: function(name) {
        return (name == this.getCurrentUser().name);
    }
});

Engine.registrate(UnitySpace.System.Modules.GINAModule);// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.KeyboardModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * Keyboard module class. Used for initialize keymap. Module name is <strong>Keyboard</strong>
 * No required modules.
 * @author Max Kazarin
 */
UnitySpace.System.Modules.KeyboardModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'Keyboard',

    /**
     * KeyMap
     * @type {Object}
     */
    keyMap: null,

    initialize: function() {
        UnitySpace.System.Modules.KeyboardModule.superclass.initialize.apply(this, arguments);

        this.keyMap = new Ext.KeyMap(document, [{
            key: Ext.EventObject.BACKSPACE,
            stopEvent: false,
            fn: function(key, e) {
                var t = e.target.tagName;
                if ( !t )
                    return;
                t = t.toLowerCase();
                if (t != "input" && t != "textarea") {
                    log( 'stopping backspace for tag: '+t);
                    e.stopEvent();
                }
            }
        }]);

        this.publishInitialized();
    },

    addHotKey: function(config) {
/*
        var config = Ext.applyIf({
            handler: function() {
                Engine.Module.CommandShell.exec(cmdString, runMode || WebDesktop.ERunMode.Normal)
            }
        }, key);
*/
        this.keyMap.addBinding(config);
    }
});

Engine.registrate(UnitySpace.System.Modules.KeyboardModule);
// using System.Modules.Namespace

/**
 * @class UnitySpace.System.Modules.ModuleException
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.Exception
 * Module exception class.
 * @author Max Kazarin
 */

UnitySpace.System.Modules.ModuleException = function() {
    UnitySpace.System.Modules.ModuleException.constructor.apply(this, arguments);
    this.name = 'ModuleException';
};

Ext.extend(UnitySpace.System.Modules.ModuleException, UnitySpace.Exception, {});
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
});// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.ProjectProfileModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * Project profile module class. Used for managed project profile. Module name is <strong>ProjectProfile</strong>
 * Required {@link UnitySpace.System.Modules.GINAModule}
 * @author Max Kazarin
 */
UnitySpace.System.Modules.ProjectProfileModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'ProjectProfile',

    /**
     * List of required modules.
     * @type {String}
     */
    requiredModules: 'GINA',

    /**
     * Project profile
     * @type {Object}
     */
    profile: null,

    defaultProject: null,

    /**
     * Initialize module resources
     */
    initialize: function() {
        UnitySpace.System.Modules.ProjectProfileModule.superclass.initialize.apply(this, arguments);

        this.projectsController = Engine.api.get('UnitySpace.Projects');

        Engine.addTask({
            method: this.switchToDefaultProject
            ,scope: this
        });

        this.publishInitialized();

    },

    getCurrentProject: function() {
        return this.currentProject;
    },

    getCurrentProjectId: function() {
        if (this.currentProject)
            return this.currentProject.id;

        return Resources.get("System.Modules.NullProjectName");
    },

/*
    addApplication: function(projectId, application, successFn, failureFn, responseFn) {
        if (!application)
            throw new UnitySpace.ArgumentNullException('application');

        if (!this.getProfile())
            throw new UnitySpace.System.Modules.ModuleException(this.resources.ProfileNotLoaded);

        var currentProject = (projectId == this.getCurrentProjectId());
        if (!projectId)
            projectId = this.getCurrentProjectId();

        this.projectsController.addApplication(
                projectId,
                application,
                currentProject ?
                    this.onAddApplicationSuccess.createDelegate(this, [application, successFn], true) :
                    successFn,
                failureFn,
                responseFn);
    },

    onAddApplicationSuccess: function(response, options, application, successFn) {
        var applicationInfo = Applications.Manifest[application];
        var node = this._addApplicationToProfile(applicationInfo);

        this.publish( 'add', node);
        if (successFn) successFn(response, options);
    },

    removeApplication: function(projectId, application, successFn, failureFn, responseFn) {
        if (!application)
            throw new UnitySpace.ArgumentNullException('application');

        if (!this.getProfile())
            throw new UnitySpace.System.Modules.ModuleException(this.resources.ProfileNotLoaded);

        var currentProject = (projectId == this.getCurrentProjectId());
        if (!projectId)
            projectId = this.getCurrentProjectId();

        this.projectsController.removeApplication(
                projectId,
                application,
                currentProject ?
                    this.onRemoveApplicationSuccess.createDelegate(this, [application, successFn], true) :
                    successFn,
                failureFn,
                responseFn);
    },

    onRemoveApplicationSuccess: function(response, options, application, successFn) {
        var applicationInfo = Applications.Manifest[application];
        this._removeApplicationFromProfile(applicationInfo);

        this.publish( 'remove', application);
        if (successFn) successFn(response, options);
    },
*/

    switchProject: function(id){
        this.publish('beforeload');
        if (id)
            this.projectsController.get(
                id,
                this.onGetCurrentProjectSuccess.createDelegate(this),
                this.onFailure.createDelegate(this));
        else {
            this.projectsController.getAll(
                null,
                this.onGetCurrentProjectSuccess.createDelegate(this),
                this.onFailure.createDelegate(this));
        }
    },

    switchToDefaultProject: function() {
        this.projectsController.getCurrent(
            null,
            this.onGetCurrentProjectSuccess.createDelegate(this),
            this.onFailure.createDelegate(this));
    },

    onGetCurrentProjectSuccess: function(response) {
        var projects = response.responseData;

        if (!Ext.isDefined(projects) || projects == null)
            this._loadAdminProject();
        else if (Ext.isObject(projects)) {
            this._loadDefaultProject(projects);
        }
        else if ( Ext.isArray(projects) && projects.length == 1 )
            this._loadDefaultProject(projects[0]);
        else
            this._chooseProject(projects);
    },

    _loadAdminProject: function() {
        this.currentProject = this.getDefaultProject();
        this._loadProject();
    },

    getDefaultProject: function() {
        if (!this.defaultProject)
            this.defaultProject = new UnitySpace.System.Modules.Project({
                id: 0,
                name: 'Default Project',
                roles: 'Owner'
            });
        return this.defaultProject; 
    },

    _loadDefaultProject: function(project) {
        this._switchProject(project);
    },

    _chooseProject: function(projects) {
        /*var projectSwitchWindow = new WebDesktop.controls.ProjectSwitchWindow({
            projects: projects,
            listeners: {
                close: function(sender) {this._switchProject(sender.selectProject)},
                scope: this
            }
        });
        projectSwitchWindow.show();*/
        this.publish('beforeswitch');
    },

   switchProject: function(project) {
        this.currentProject = new UnitySpace.System.Modules.Project(project);
        this.publish('switch');

        if (this.currentProject != null) {
            this.projectsController.setCurrent(
                    null,
                    this.currentProject.id,
                    this._loadProject.createDelegate(this),
                    this.onFailure.createDelegate(this));
        }
        else
            this._loadProject();
    },

    _loadProject: function() {
        var project = this.getCurrentProject();
        Engine.Module.GINA.getCurrentUser().ability().project = project;
        if (project.id == 0) {
            this.onGetApplications(null);
            return;
        }

        this.projectsController.getApplications(
                project.id,
                this.onGetApplicationSuccess.createDelegate(this),
                this.onFailure.createDelegate(this));
    },

    onGetApplicationSuccess: function(response, option) {
        this.onGetApplications(response.responseData);
    },

    onFailure: function(response, option) {
        var message = WebDesktop.net.ActionResponse.parse(response);
        Engine.error(new UnitySpace.System.Net.ConnectionException(message));
    },

    onGetApplications: function(applications) {
        var project = this.getCurrentProject();
        project.applications = applications;
        this.publish( 'loaded');
    }
});

Engine.registrate(UnitySpace.System.Modules.ProjectProfileModule);// using System.Modules.BaseModule

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

Engine.registrate(UnitySpace.System.Modules.RepositoryModule);// using System.Modules.Namespace

/**
 * @class UnitySpace.System.Modules.User
 * @namespace UnitySpace.System.Modules
 * @extends Object
 * User class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of User class.
 * @param {Object} config User configuration
 */
UnitySpace.System.Modules.User = function(config) {
    this.initialize(config);
};

UnitySpace.System.Modules.User = Ext.extend(Object, {
    // protected
    initialize: function(config) {
        //Ext.applyIf(this, config);
        this.id = config.id;
        this.name = config.email;
        this.email = config.email;
        this.firstName = config.first_name;
        this.isOnline = config.is_online;
        this.lastName = config.last_name;
        this.city = config.city;
        this.country = config.country;
        this.address = config.address;
        this.avatar = config.avatar;
        this.fullName = String.format('{0} {1}', this.lastName, this.firstName);
    }
});// using System.Net.Namespace

/**
 * @class UnitySpace.System.Net.ActionResponse
 * @namespace UnitySpace.System.Net
 * @extends Object
 * Class for parse server result.
 * @author Max Kazarin
 * @singleton
 */
UnitySpace.System.Net.ActionResponse = {
    /**
     * Check if response can be parsed.
     * @param {Object} response Response object
     */
    canParse: function(response) {
        var data = response.responseData;
        if (!data)
            return false;

        return Ext.isDefined(data.alert);
    },

    /**
     * Parse response.
     * @param {Object} response Response object
     * @return {String} Server message or error message
     */
    parse: function(response) {
        var data = response.responseData;
        if (!data)
            return this.resources.UnknownResponse;

        var message = data['alert'];
        if (message)
            return message;

        return this.resources.UnknownResponse;
    }
};// using System.Net.Namespace
// using Exception
/**
 * @class UnitySpace.System.Net.ConnectionException
 * @namespace UnitySpace.System.Net
 * @extends UnitySpace.Exception
 * Connection error class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of ConnectionException class
 */
UnitySpace.System.Net.ConnectionException = function() {
    UnitySpace.System.Net.ConnectionException.superclass.constructor.apply(this, arguments);
    this.name = 'ConnectionException';
};

Ext.extend(UnitySpace.System.Net.ConnectionException, UnitySpace.Exception, {});
// using System.Security.Namespace
// using Exception

/**
 * @class UnitySpace.System.Security.AuthenticateProviderException
 * @namespace UnitySpace.System.Security
 * @extends UnitySpace.Exception
 * Controller exception class.
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Controllers.AuthenticateProviderException class
 */

UnitySpace.System.Security.AuthenticateProviderException = function() {
    UnitySpace.System.Security.AuthenticateProviderException.superclass.constructor.apply(this, arguments);
    this.name = 'AuthenticateProviderException';
};

Ext.extend(UnitySpace.System.Security.AuthenticateProviderException, UnitySpace.Exception, {});
// using System.Security.Namespace
//using System.Engine

/**
 * @class UnitySpace.System.Security.AuthenticateProviderManager
 * @namespace UnitySpace.System.Security
 * @extends Object
 * AuthenticateProviderManager class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.AuthenticateProviderManager class
 */
UnitySpace.System.Security.AuthenticateProviderManager = function() {
    UnitySpace.System.Security.AuthenticateProviderManager.superclass.constructor.apply(this, arguments);
    this.providers = {};
};

Ext.extend(UnitySpace.System.Security.AuthenticateProviderManager, Object, {
    providers: null,

    /**
     * Return authenticate provider instance by name
     * @param {String} name Name of controller
     */
    get: function(name) {
        var providers = this.providers[name];
        if (!Ext.isDefined(providers))
            throw new UnitySpace.System.Security.AuthenticateProviderException(
                    Resources.get("System.Security.ProviderNotRegistrate"),
                    name);

        if (!providers.instance) {
            var restfull = Engine.config.get('Connection.restfull', false);
            providers.instance = new providers.className();
        }

        return providers.instance;
    },

    /**
     * Registrate new authenticate provider.
     * @param {String} name Controller name
     * @param {Function} className Controller class
     */
    registrate: function(name, className) {
        if (Ext.isEmpty(name))
            throw new UnitySpace.ArgumentNullException("name");

        if (Ext.isDefined(this.providers[name]))
            throw new UnitySpace.System.Security.AuthenticateProviderException(
                    Resources.get("System.Security.AuthenticateProviderManager.ProviderAlreadyRegistrate"),
                    name);

        this.providers[name] = {
            className: className,
            instance: null
        };
    }
});

Engine.authenticateProviders = new UnitySpace.System.Security.AuthenticateProviderManager();// using System.Security.Namespace

/**
 * @class UnitySpace.System.Security.BaseAuthenticateProvider
 * @namespace UnitySpace.System.Security
 * @extends Object
 * AuthenticateProvider class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.AuthenticateProvider class
 */
UnitySpace.System.Security.BaseAuthenticateProvider = function() {
    UnitySpace.System.Security.BaseAuthenticateProvider.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Security.BaseAuthenticateProvider, Object, {
    authenticate: function(successFn, failureFn) {

    }
});// using System.Security.Namespace
// using System.Security.BaseAuthenticateProvider

/**
 * @class UnitySpace.System.Security.FormAuthenticateProvider
 * @namespace UnitySpace.System.Security
 * @extends UnitySpace.System.Security.BaseAuthenticateProvider
 * FormAuthenticateProvider class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.FormAuthenticateProvider class
 */
UnitySpace.System.Security.FormAuthenticateProvider = function() {
    UnitySpace.System.Security.FormAuthenticateProvider.superclass.constructor.apply(this, arguments);

    this.name = Engine.config.get('Authenticate.name');
    this.password = Engine.config.get('Authenticate.password');
    this.rememberMe = Engine.config.get('Authenticate.rememberMe');
};

Ext.extend(UnitySpace.System.Security.FormAuthenticateProvider, UnitySpace.System.Security.BaseAuthenticateProvider, {
    authenticate: function(successFn, failureFn) {
        var accountController = Engine.api.get("UnitySpace.Account");
        accountController.signin(
            this.name,
            this.password,
            this.rememberMe,
            successFn,
            failureFn);
    }
});

Engine.authenticateProviders.registrate('FormAuthenticate', UnitySpace.System.Security.FormAuthenticateProvider)// using Namespace

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
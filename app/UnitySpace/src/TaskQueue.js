// using Namespace

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
        var param = [function(withError) {
            if (withError)
                this.hasError = true;
            this.runEntry.defer(1, this);
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
});
// using System.Modules.BaseModule

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

        if (!Ext.isDefined(log4javascript))
            throw new UnitySpace.System.Modules.ModuleException(UnitySpace.Resources.System.Modules.DebugModule.Log4JavaScriptNotFound);

        var doMock = Engine.config.get('Debug.mock', false);
        if (doMock) {
            log('Mock enable');
            UnitySpace.System.Controllers.Mocking();
        }
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
    },

    /**
     * @private
     * Log channels activity
     * @param {Object} event Event object
     * @param {String} channel Channel name
     */
    _logChannels: function(event, channel) {
        var message = event;
        if (Ext.isFunction(event))
            message = 'function';
        else if (!Ext.isDefined(event))
            message = '';
        log(String.format('channel: [{0}] {1}', channel, message));
    }
});

Engine.registrate(UnitySpace.System.Modules.DebugModule);

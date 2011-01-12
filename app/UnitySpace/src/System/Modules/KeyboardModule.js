// using System.Modules.BaseModule

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

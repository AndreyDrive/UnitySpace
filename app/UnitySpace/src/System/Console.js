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
});
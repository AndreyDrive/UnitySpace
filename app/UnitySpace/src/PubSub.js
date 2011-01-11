// using Namespace

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
});
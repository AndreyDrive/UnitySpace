// using System.Net.Namespace

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
};
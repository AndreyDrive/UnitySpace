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

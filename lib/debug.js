debug = new Function('debugger;');

if (window.console && window.console.log) {
    log = function () { window.console.log(arguments.length > 1 ? arguments : arguments[0]); };
} else if ( Ext.log ) {
    log = window.Ext.log;
} else {
    log = Ext.emptyFn;
}
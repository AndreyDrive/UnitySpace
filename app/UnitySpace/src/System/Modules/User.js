// using System.Modules.Namespace

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
});
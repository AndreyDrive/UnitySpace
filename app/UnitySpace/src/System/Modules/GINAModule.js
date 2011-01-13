// using System.Modules.BaseModule
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

        Engine.addTask({
            method: this.initializeRoles
            ,scope: this
            //,isLast: true
        });

        Engine.addTask({
            method: this.authenticate
            ,scope: this
            //,isLast: true
        });
    },

    // private
    authenticate: function(synchronizer) {
        synchronizer();
        this.logon();
    },

    // private
    initializeRoles: function(synchronizer) {
        var rolesController = Engine.api.get("UnitySpace.Roles");
        rolesController.get(
            this.onInitializeRolesSuccess.createDelegate(this, [synchronizer], true),
            this.onInitializeRolesFailure.createDelegate(this)
        );
    },

    // private
    onInitializeRolesSuccess: function(response, option, synchronizer) {
        this.roles = response.responseData;
        synchronizer();
    },

    // private
    onInitializeRolesFailure: function(response) {
        Engine.error(new UnitySpace.System.Net.ConnectionException(response.responseData));
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
        this.publish('beforelogon', this.validateUser.createDelegate(this));

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
    validateUser: function(name, password, rememberMe) {
        var providerName = Engine.config.get('Authenticate.type', 'FormAuthenticate');
        var provider = Engine.authenticateProviders.get(providerName);

        provider.authenticate(
            name,
            password,
            rememberMe,
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
        this.publish('logon');
    },

    onValidateUserFailure: function(response) {
        var message = UnitySpace.System.Net.ActionResponse.parse(response);
        this.publish('error', message);
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

Engine.registrate(UnitySpace.System.Modules.GINAModule);
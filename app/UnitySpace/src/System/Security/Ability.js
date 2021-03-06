// using System.Security.Namespace

/**
 * @class UnitySpace.System.Security.Ability
 * @namespace UnitySpace.System.Security
 * @extends Object
 * Ability class
 * @author Max Kazarin
 * @constructor
 * Create new instance of UnitySpace.System.Security.Ability class
 */
UnitySpace.System.Security.Ability = function() {
    UnitySpace.System.Security.Ability.superclass.constructor.apply(this, arguments);
};

Ext.extend(UnitySpace.System.Security.Ability, Object, {
    context: null,

    initialize: function(user, project) {
        this.user = user;
        this.project = project;
    },

    ability: function(project) {
        this.context = {
            user: this.user,
            project: project ? project : this.project
        };

        return this;
    },

    can: function(name) {
        var result = null;
        var can = null;

        var roles = this.context.project.roles;
        if (!roles)
            return false;

        for (var index = 0; index <= roles.length; index++) {
            if (index == roles.length) {
                can = this.rules.All[name];
            }
            else {
                var rules = this.rules[roles[index]];
                if (!rules)
                    continue;

                can = rules[name];
            }

            if (Ext.isFunction(can)) {
                var arg = null;
                if (arguments.length > 1) {
                    arg = [];
                    for (index = 1; index < arguments.length; index++)
                        arg.push(arguments[index]);
                }
                result = can.apply(this, arg);
            }
            else
                result = can;

            if (result != null)
                return result;
        }

        return false;
    },

    rules: {
        Owner: {
            leave_project: false,
            edit_project: true,
            read_application: true,
            remove_project: true,

            remove_user: function(roles) {
                return roles.indexOf('Owner') == -1;
            },
            edit_user: true,
            read_roles: true,
            add_user: true
        },
        Admin: {
            edit_project: true,
            read_application: true,

            remove_user: function(roles) {
                return roles.indexOf('Owner') == -1;
            },
            edit_user: function(roles) {
                return roles.indexOf('Owner') == -1;
            },
            read_roles: true,
            add_user: true
        },
        All: {
            switch_project: function(projectId) {
                return this.project.id != projectId;
            },
            leave_project: true,
            //switch_project: true//,
            read_user: true
        }
    }
});

//Security.Ability.Rules = Security.Ability.prototype.rules;
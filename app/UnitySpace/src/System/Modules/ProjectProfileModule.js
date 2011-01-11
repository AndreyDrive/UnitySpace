// using System.Modules.BaseModule

/**
 * @class UnitySpace.System.Modules.ProjectProfileModule
 * @namespace UnitySpace.System.Modules
 * @extends UnitySpace.System.Modules.BaseModule
 * Project profile module class. Used for managed project profile. Module name is <strong>ProjectProfile</strong>
 * Required {@link UnitySpace.System.Modules.GINAModule}
 * @author Max Kazarin
 */
UnitySpace.System.Modules.ProjectProfileModule = Ext.extend(UnitySpace.System.Modules.BaseModule, {
    /**
     * Module name. Must be unique.
     * @type {String}
     */
    name: 'ProjectProfile',

    /**
     * List of required modules.
     * @type {String}
     */
    requiredModules: 'GINA',

    /**
     * Project profile
     * @type {Object}
     */
    profile: null,

    defaultProject: null,

    /**
     * Initialize module resources
     */
    initialize: function() {
        debug();
        UnitySpace.System.Modules.ProjectProfileModule.superclass.initialize.apply(this, arguments);

        this.projectsController = Engine.api.get('UnitySpace.Projects');
    },

    getCurrentProject: function() {
        return this.currentProject;
    },

    getCurrentProjectId: function() {
        if (this.currentProject)
            return this.currentProject.id;

        return UnitySpace.Resources.System.Modules.NullProjectName;
    },

/*
    addApplication: function(projectId, application, successFn, failureFn, responseFn) {
        if (!application)
            throw new UnitySpace.ArgumentNullException('application');

        if (!this.getProfile())
            throw new UnitySpace.System.Modules.ModuleException(this.resources.ProfileNotLoaded);

        var currentProject = (projectId == this.getCurrentProjectId());
        if (!projectId)
            projectId = this.getCurrentProjectId();

        this.projectsController.addApplication(
                projectId,
                application,
                currentProject ?
                    this.onAddApplicationSuccess.createDelegate(this, [application, successFn], true) :
                    successFn,
                failureFn,
                responseFn);
    },

    onAddApplicationSuccess: function(response, options, application, successFn) {
        var applicationInfo = Applications.Manifest[application];
        var node = this._addApplicationToProfile(applicationInfo);

        this.publish( 'add', node);
        if (successFn) successFn(response, options);
    },

    removeApplication: function(projectId, application, successFn, failureFn, responseFn) {
        if (!application)
            throw new UnitySpace.ArgumentNullException('application');

        if (!this.getProfile())
            throw new UnitySpace.System.Modules.ModuleException(this.resources.ProfileNotLoaded);

        var currentProject = (projectId == this.getCurrentProjectId());
        if (!projectId)
            projectId = this.getCurrentProjectId();

        this.projectsController.removeApplication(
                projectId,
                application,
                currentProject ?
                    this.onRemoveApplicationSuccess.createDelegate(this, [application, successFn], true) :
                    successFn,
                failureFn,
                responseFn);
    },

    onRemoveApplicationSuccess: function(response, options, application, successFn) {
        var applicationInfo = Applications.Manifest[application];
        this._removeApplicationFromProfile(applicationInfo);

        this.publish( 'remove', application);
        if (successFn) successFn(response, options);
    },
*/

    switchProject: function(id){
        this.publish('beforeload');
        if (id)
            this.projectsController.get(
                id,
                this.onGetCurrentProjectSuccess.createDelegate(this),
                this.onFailure.createDelegate(this));
        else {
            this.projectsController.getAll(
                null,
                this.onGetCurrentProjectSuccess.createDelegate(this),
                this.onFailure.createDelegate(this));
        }
    },

    switchToDefaultProject: function() {
        this.projectsController.getCurrent(
            null,
            this.onGetCurrentProjectSuccess.createDelegate(this),
            this.onFailure.createDelegate(this));
    },

    onGetCurrentProjectSuccess: function(response) {
        var projects = response.responseData;

        if (!Ext.isDefined(projects) || projects == null)
            this._loadAdminProject();
        else if (Ext.isObject(projects)) {
            this._loadDefaultProject(projects);
        }
        else if ( Ext.isArray(projects) && projects.length == 1 )
            this._loadDefaultProject(projects[0]);
        else
            this._showSwitchProjectWindow(projects);
    },

    _loadAdminProject: function() {
        this.currentProject = this.getDefaultProject();
        this._loadProject();
    },

    getDefaultProject: function() {
        if (!this.defaultProject)
            this.defaultProject = new UnitySpace.System.Modules.Project({
                id: 0,
                name: 'Default Project',
                roles: 'Owner'
            });
        return this.defaultProject; 
    },

    _loadDefaultProject: function(project) {
        this._switchProject(project);
    },

    _showSwitchProjectWindow: function(projects) {
        /*var projectSwitchWindow = new WebDesktop.controls.ProjectSwitchWindow({
            projects: projects,
            listeners: {
                close: function(sender) {this._switchProject(sender.selectProject)},
                scope: this
            }
        });
        projectSwitchWindow.show();*/
        this.publish('beforeswitch', this._switchProject.createDelegate(this));
    },

    _switchProject: function(project) {
        this.currentProject = new UnitySpace.System.Modules.Project(project);
        this.publish('switch');

        if (this.currentProject != null) {
            this.projectsController.setCurrent(
                    null,
                    this.currentProject.id,
                    this._loadProject.createDelegate(this),
                    this.onFailure.createDelegate(this));
        }
        else
            this._loadProject();
    },

    _loadProject: function() {
        var project = this.getCurrentProject();
        Engine.Module.GINA.getCurrentUser().ability().project = project;
        if (project.id == 0) {
            this.onGetApplications(null);
            return;
        }

        this.projectsController.getApplications(
                project.id,
                this.onGetApplicationSuccess.createDelegate(this),
                this.onFailure.createDelegate(this));
    },

    onGetApplicationSuccess: function(response, option) {
        this.onGetApplications(response.responseData);
    },

    onFailure: function(response, option) {
        var message = WebDesktop.net.ActionResponse.parse(response);
        Engine.error(new UnitySpace.System.Net.ConnectionException(message));
    },

    onGetApplications: function(applications) {
        var project = this.getCurrentProject();
        project.applications = applications;
        this.publish( 'loaded');
    }
});

Engine.registrate(UnitySpace.System.Modules.ProjectProfileModule);
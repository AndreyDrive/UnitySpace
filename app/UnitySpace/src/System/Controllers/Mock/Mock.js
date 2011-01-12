//Mock Controllers
//using UnitySpace.System.Controllers.Mock.AccountController
//using UnitySpace.System.Controllers.Mock.ProjectsController
//using UnitySpace.System.Controllers.Mock.RolesController
//using UnitySpace.System.Controllers.Mock.UsersController

UnitySpace.System.Controllers.Mock = function() {
	UnitySpace.System.Controllers.AccountController = UnitySpace.System.Controllers.Mock.AccountController;
	UnitySpace.System.Controllers.ProjectsController = UnitySpace.System.Controllers.Mock.ProjectsController;
	UnitySpace.System.Controllers.RolesController = UnitySpace.System.Controllers.Mock.RolesController;
	UnitySpace.System.Controllers.UsersController = UnitySpace.System.Controllers.Mock.UsersController;
};


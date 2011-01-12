// using System.Controllers.Mock.Namespace

UnitySpace.System.Controllers.Mocking = function() {
    Engine.api.registrate("UnitySpace.Account", UnitySpace.System.Controllers.Mock.AccountController, true);
    Engine.api.registrate("UnitySpace.Projects", UnitySpace.System.Controllers.Mock.ProjectsController, true);
    Engine.api.registrate("UnitySpace.Roles", UnitySpace.System.Controllers.Mock.RolesController, true);
    Engine.api.registrate("UnitySpace.Users", UnitySpace.System.Controllers.Mock.UsersController, true);
    Engine.api.registrate("UnitySpace.Repository", UnitySpace.System.Controllers.Mock.RepositoryController, true);
};


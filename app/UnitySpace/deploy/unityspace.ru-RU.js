/*
 * UnitySpace license
 */
Ext.namespace("UnitySpace");UnitySpace.Exception=function(a,c,b){if(arguments.length===0){return}this.message=arguments[0];if(this.message instanceof Error){this.message=this.message.message}if(arguments.length>1){arguments[0]=this.message;this.message=String.format.apply(this,arguments)}};Ext.extend(UnitySpace.Exception,Object,{message:null,name:"Exception",toString:function(){return String.format("{0}: {1}",this.name,this.message)}});UnitySpace.ArgumentNullException=function(a){this.message=String.format(UnitySpace.Resources.ArgumentNullException.Message,a);this.name="ArgumentNullException"};Ext.extend(UnitySpace.ArgumentNullException,UnitySpace.Exception,{});UnitySpace.ConfigurateManager=function(a){UnitySpace.ConfigurateManager.superclass.constructor.apply(this,arguments);this.configuration=a};Ext.extend(UnitySpace.ConfigurateManager,Object,{get:function(c,b){var a=new Function("config","return config."+c);var e;try{e=a(this.configuration);e=Ext.isDefined(e)?e:b}catch(d){}return e},set:function(a,c){var d=new Function("config","value","return config."+a+" = value");try{d(this.configuration,c)}catch(b){}}});UnitySpace.PubSub=new Ext.util.Observable();Ext.override(Ext.util.Observable,{subscribe:function(a,d,c,b){UnitySpace.PubSub.addEvents(a);UnitySpace.PubSub.on(a,d,c,b)},publish:function(d,f){if(UnitySpace.PubSub.eventsSuspended===true){return true}if(!UnitySpace.PubSub.events){return false}var c=UnitySpace.PubSub.events["*"];if(c){if(c.fire.call(c,f,d)===false){return true}}var e=null;var b=d.substr(1).split("/");var a=false;do{e=UnitySpace.PubSub.events["/"+b.join("/").toLowerCase()];if(e){a=true;if(e.fire.call(e,f,d)===false){return true}}b.pop()}while(b.length>0);return a},removeSubcribers:function(b){for(var a in UnitySpace.PubSub.events){if(a==b||!b){var c=UnitySpace.PubSub.events[a];if(c){c.clearListeners()}}}}});UnitySpace.Resources={System:{Modules:{BaseModule:{UnknownModuleName:"Неизвестное имя модуля.",RequiedModule:"Требуется модуль {0}."},CommandShellModule:{EmptyModuleMethod:"Пустой метод модуля {0}."},ExtJSModule:{UnsupportHeaderType:"Не поддерживаемый тип заголовка ответа."},GINAModule:{UnknownCurrentUser:"Незивестный текущий пользователь."},ProjectProfileModule:{NullProjectName:"",ProfileNotLoaded:"Профиль проекта не загружен."},DebugModule:{Log4JavaScriptNotFound:"Отсутсвует библиотека log4javascript."}},Net:{ActionResponse:{UnknownResponse:"Неизвестный ответ сервера."}},Controllers:{ControllerAlreadyRegistrate:"Контроллер {0} уже зарегистрирован.",ControllerNotRegistrate:"Контроллер {0} не зарегистрирован."},Security:{AuthenticateProviderManager:{ProviderAlreadyRegistrate:"Провайдер аутентификации {0} уже зарегистрирован.",ProviderNotRegistrate:"Провайдер аутентификации {0} не зарегистрирован."}}},ArgumentNullException:{Message:"Значение аргумент {0} null."}};UnitySpace.Synchronizer=function(a){this.count=a};Ext.extend(UnitySpace.Synchronizer,Object,{count:0,lock:function(){this.count--;return this.count>0}});Ext.namespace("UnitySpace.System.Net");UnitySpace.System.ApplicationException=function(){UnitySpace.System.ApplicationException.superclass.constructor.apply(this,arguments);this.name="ApplicationException"};Ext.extend(UnitySpace.System.ApplicationException,UnitySpace.Exception,{});Ext.namespace("UnitySpace.System");UnitySpace.System.Console=function(){UnitySpace.System.Console.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Console,Object,{name:"Console",outputElement:null,template:null,initialize:function(){this.outputElement=Ext.getBody().insertHtml("beforeEnd",'<div id="console"></div>',true)},write:function(a){if(!this.template){this.outputElement.insertHtml("beforeEnd",a)}else{this.template.append(this.outputElement,arguments)}},setTemplate:function(a){this.template=new Ext.Template(a);this.template.compile()},clearTemplate:function(){if(this.template){delete this.template;this.template=null}},close:function(){this.outputElement.remove()}});Ext.namespace("UnitySpace.System.Controllers");UnitySpace.TaskQueue=function(a){UnitySpace.TaskQueue.superclass.constructor.apply(this,arguments);Ext.apply(this,a);this.addEvents("run","stop");this.tasks=new Array();this.lastTasks=new Array()};Ext.extend(UnitySpace.TaskQueue,Ext.util.Observable,{tasks:null,lastTasks:null,sync:true,activeTasks:0,isRunning:false,hasError:false,add:function(a){if(a.isLast){this.lastTasks.push(a)}else{this.tasks.push(a)}},remove:function(a){for(var b=0;b<this.tasks.length;b++){if(this.tasks[b]===a){this.tasks.splice(b,1);break}}},clear:function(){this.stop();this.tasks=new Array();this.lastTasks=new Array()},stop:function(){this.isRunning=false;this.fireEvent("stop",this);this.destroy()},run:function(){if(this.isRunning){return}this.hasError=false;this.prepareTasks();this.runEntry()},prepareTasks:function(){if(!this.lastTasks){return}this.tasks=this.tasks.concat(this.lastTasks);this.lastTasks=null},runEntry:function(){if(this.sync){this.runSync()}else{this.runAsync()}},runSync:function(){if(this.isRunning&&this.tasks.length===0){this.stop();return}var a=this.getNextTask();if(a!=null){this.isRunning=true;this.fireEvent("run",this);this.runTask(a)}},runAsync:function(){if(this.isRunning){this.activeTasks--;if(this.tasks.length===0&&this.activeTasks===0){this.stop()}return}var a=this.getNextTask();if(a!=null){this.isRunning=true;this.fireEvent("run",this);do{this.activeTasks++;this.runTask(a)}while((a=this.getNextTask())!=null)}},getNextTask:function(){return this.tasks.shift()},runTask:function(a){var c=[function(d){if(d){this.hasError=true}this.runEntry.defer(1,this)}.createDelegate(this)];if(a.params){c=c.concat(a.params)}if(a.wait>0){a.method.defer(a.wait,a.scope,c)}else{if(!this.sync){a.method.defer(1,a.scope,c)}else{var b=a.method.createDelegate(a.scope,c);b()}}},destroy:function(){if(this.lastTasks){delete this.lastTasks}if(this.tasks){delete this.tasks}}});UnitySpace.System.Engine=function(){this.modules={};this.config=null;this.taskQueue=new UnitySpace.TaskQueue()};Ext.extend(UnitySpace.System.Engine,Ext.util.Observable,{taskQueue:null,modules:null,initialize:function(){var a=new UnitySpace.System.Console();a.initialize();this.addTask({method:function(e){a.close();e()},scope:this});a.write("Initialize modules...\n");a.setTemplate('<div>Module {0}...<span style="float:right; color:{2}">[{1}]</span></div><div style="padding-left:20px; color:yellow;">{3}</div>');var d=true;for(var c=0;c<this.init.length;c++){var b=this.init[c];if(!this.modules.hasOwnProperty(b)){log(String.format("Module {0} not initialize. Not registrate.",b));continue}d=this._initializeModule(a,b)}a.clearTemplate();if(!d){this.taskQueue.clear()}},_initializeModule:function(b,d){var h=this.modules[d];var c=null;var f=null;var a=true;try{f=new h.className();f.validate();f.initialize();h.instance=f}catch(e){a=false;var g=e.message;if(e instanceof UnitySpace.Exception){g=e.message}c="Error: "+g}b.write(f.name,a?"OK":"FAILED",a?"green":"red",c);return a},run:function(){this.taskQueue.run()},addTask:function(a){this.taskQueue.add(a)},registrate:function(b){var a=b.prototype.name;if(!a){throw WebDesktop.Resources.Messages.UnknowModuleName}this.modules[a]={className:b}},isInitializeModule:function(a){if(this.modules[a]==null){return false}return(this.modules[a].instance!=null)},error:function(a){if(a instanceof UnitySpace.Exception){this.publish("error",a)}else{this.publish("error",new UnitySpace.SystemException(a))}},configurate:function(a){this.config=new UnitySpace.ConfigurateManager(a)},dispose:function(){this.taskQueue.clear();Ext.each(this.modules,function(b){try{b.instance.dispose()}catch(a){}},this);delete this.modules;this.modules=null}});var Engine=new UnitySpace.System.Engine();Ext.onReady(function(){Engine.initialize();Engine.run()});UnitySpace.System.Controllers.ControllerManager=function(){UnitySpace.System.Controllers.ControllerManager.superclass.constructor.apply(this,arguments);this.controllers={}};Ext.extend(UnitySpace.System.Controllers.ControllerManager,Object,{get:function(b){var a=this.controllers[b];if(!Ext.isDefined(a)){throw new UnitySpace.System.Controllers.ControllerException(UnitySpace.Resources.System.Controllers.ControllerNotRegistrate,b)}if(!a.instance){var c=Engine.config.get("Connection.restfull",false);a.instance=new a.className({restfull:c})}return a.instance},registrate:function(a,c,b){if(Ext.isEmpty(a)){throw new UnitySpace.ArgumentNullException("name")}if(!b&&Ext.isDefined(this.controllers[a])){throw new UnitySpace.System.Controllers.ControllerException(UnitySpace.Resources.System.Controllers.ControllerAlreadyRegistrate,a)}this.controllers[a]={className:c,instance:null}}});Engine.api=new UnitySpace.System.Controllers.ControllerManager();UnitySpace.System.Controllers.BaseController=function(a){UnitySpace.System.Controllers.BaseController.superclass.constructor.apply(this,arguments);Ext.apply(this,a)};Ext.extend(UnitySpace.System.Controllers.BaseController,Object,{defaultFormat:"json",restfull:false,getName:function(){return null},getUrl:function(a,c){var b=this.getName();if(a){if(b&&b!=""){b+="/"+a}else{b=a}}if(!this.restfull){b+="."+this.getFormat(c)}return b},getFormat:function(a){if(!a){return this.defaultFormat}return a},getHeader:function(a){switch(a){case"json":return{headers:{Accept:"application/json","Content-Type":"application/json; charset=utf-8"}};case"xml":break;case"html":break}},getData:function(c,b,a){switch(a){case"json":if(c=="GET"){return{params:b}}else{return{jsonData:Ext.encode(b)}}case"xml":return{xmlData:b};default:return{params:b}}},invoke:function(g,a,c,i,e,h,f){var d=this.getFormat(f);var b={url:this.getUrl(g,f),method:a,disableCaching:false,success:Ext.isDefined(i)?i.safe():null,failure:Ext.isDefined(e)?e.safe():null,callback:Ext.isDefined(h)?h.safe():null};Ext.apply(b,this.getHeader(d));Ext.apply(b,this.getData(a,c,d));Ext.Ajax.request(b)}});UnitySpace.System.Controllers.AccountController=function(){UnitySpace.System.Controllers.AccountController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.AccountController,UnitySpace.System.Controllers.BaseController,{signin:function(e,c,g,a,b,d,f){this.invoke("/signin","POST",{model:{name:e,password:c,remember:g}},a,b,d,f)},signout:function(a,b,c,d){this.invoke("/signout","DELETE",null,a,b,c,d)},get:function(a,b,c,d){this.invoke("/user","GET",null,a,b,c,d)}});Engine.api.registrate("UnitySpace.Account",UnitySpace.System.Controllers.AccountController);UnitySpace.System.Controllers.ControllerException=function(){UnitySpace.System.Controllers.ControllerException.superclass.constructor.apply(this,arguments);this.name="ControllerException"};Ext.extend(UnitySpace.System.Controllers.ControllerException,UnitySpace.Exception,{});Ext.namespace("UnitySpace.System.Controllers.Mock");UnitySpace.System.Controllers.Mocking=function(){Engine.api.registrate("UnitySpace.Account",UnitySpace.System.Controllers.Mock.AccountController,true);Engine.api.registrate("UnitySpace.Projects",UnitySpace.System.Controllers.Mock.ProjectsController,true);Engine.api.registrate("UnitySpace.Roles",UnitySpace.System.Controllers.Mock.RolesController,true);Engine.api.registrate("UnitySpace.Users",UnitySpace.System.Controllers.Mock.UsersController,true);Engine.api.registrate("UnitySpace.Repository",UnitySpace.System.Controllers.Mock.RepositoryController,true)};UnitySpace.System.Controllers.Mock.BaseMockController=function(){UnitySpace.System.Controllers.Mock.BaseMockController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.Mock.BaseMockController,UnitySpace.System.Controllers.BaseController,{success:function(e,c,a,d){var b=this._response(e,c);this._safeCall(a,[b,null]);this._safeCall(d,[null,true,b])},failure:function(d,c,b,f){var e=null;if(d){e={alert:d}}var a=this._response(e,c);this._safeCall(b,[a,null]);this._safeCall(f,[null,true,a])},_safeCall:function(b,a){if(b!=null){b.defer(1,this,a,false)}},_response:function(c,b){var a={responseData:c,status:200};if(b){a.status=b}return a}});UnitySpace.System.Controllers.Mock.AccountController=function(){UnitySpace.System.Controllers.Mock.AccountController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.Mock.AccountController,UnitySpace.System.Controllers.Mock.BaseMockController,{signin:function(e,c,g,a,b,d,f){return null},signout:function(a,b,c,d){return null},get:function(a,b,c,d){this.failure(null,401,b,c)}});UnitySpace.System.Controllers.Mock.ProjectsController=function(){UnitySpace.System.Controllers.Mock.ProjectsController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.Mock.ProjectsController,UnitySpace.System.Controllers.Mock.BaseMockController,{get:function(b,a,c,d,e){return null},getAll:function(c,a,b,d,e){return null},getCurrent:function(c,a,b,d,e){return null},setCurrent:function(b,d,a,c,e,f){return null},getApplications:function(b,a,c,d,e){return null},create:function(e,a,b,c,d){return null},change:function(b,f,a,c,d,e){return null},remove:function(b,a,c,d,e){return null}});UnitySpace.System.Controllers.Mock.RepositoryController=function(){UnitySpace.System.Controllers.Mock.RepositoryController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.Mock.RepositoryController,UnitySpace.System.Controllers.Mock.BaseMockController,{});UnitySpace.System.Controllers.Mock.Roles=["Owner","Admin","User"];UnitySpace.System.Controllers.Mock.RolesController=function(){UnitySpace.System.Controllers.Mock.RolesController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.Mock.RolesController,UnitySpace.System.Controllers.Mock.BaseMockController,{get:function(a,b,c,d){this.success(UnitySpace.System.Controllers.Mock.Roles,200,a,c)},create:function(b,d,e,a,c,f,g){return null},remove:function(b,d,a,c,e,f){return null}});UnitySpace.System.Controllers.Mock.UsersController=function(){UnitySpace.System.Controllers.Mock.UsersController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.Mock.UsersController,UnitySpace.System.Controllers.Mock.BaseMockController,{get:function(b,d,a,c,e,f){return null},getAll:function(b,a,c,d,e){return null},create:function(c,b,a,d,e,f){return null},change:function(d,b,a,c,e,f){return null},remove:function(c,a,b,d,e){return null}});UnitySpace.System.Controllers.ProjectsController=function(){UnitySpace.System.Controllers.ProjectsController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.ProjectsController,UnitySpace.System.Controllers.BaseController,{get:function(b,a,c,d,e){this.invoke("/project/"+b,"GET",null,a,c,d,e)},getAll:function(c,a,b,d,e){this.invoke("/project/user/"+c,"GET",null,a,b,d,e)},getCurrent:function(c,a,b,d,e){this.invoke("/project/current/user/"+c,url,"GET",null,a,b,d,e)},setCurrent:function(b,d,a,c,e,f){this.invoke("/project/current/user/"+d,"POST",{projectId:b},a,c,e,f)},getApplications:function(b,a,c,d,e){this.invoke("/project/"+b+"/applications","GET",null,a,c,d,e)},create:function(e,a,b,c,d){this.invoke("project","POST",{project:e},a,b,c,d)},change:function(b,f,a,c,d,e){this.invoke("/project/"+b,"PUT",{project:f},a,c,d,e)},remove:function(b,a,c,d,e){this.invoke("/project/"+b,"DELETE",null,a,c,d,e)}});Engine.api.registrate("UnitySpace.Projects",UnitySpace.System.Controllers.ProjectsController);UnitySpace.System.Controllers.RepositoryController=function(){UnitySpace.System.Controllers.RepositoryController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.RepositoryController,UnitySpace.System.Controllers.BaseController,{});Engine.api.registrate("UnitySpace.Repository",UnitySpace.System.Controllers.RepositoryController);UnitySpace.System.Controllers.RolesController=function(){UnitySpace.System.Controllers.RolesController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.RolesController,UnitySpace.System.Controllers.BaseController,{get:function(a,b,c,d){this.invoke("/roles","GET",null,a,b,c,d)},create:function(b,d,e,a,c,f,g){this.invoke("/project/"+b+"/user/"+d,"POST",{roles:e},a,c,f,g)},remove:function(b,d,a,c,e,f){this.invoke("/project/"+b+"/user/"+d,"DELETE",null,a,c,e,f)}});Engine.api.registrate("UnitySpace.Roles",UnitySpace.System.Controllers.RolesController);UnitySpace.System.Controllers.UsersController=function(){UnitySpace.System.Controllers.UsersController.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Controllers.UsersController,UnitySpace.System.Controllers.BaseController,{get:function(b,d,a,c,e,f){this.invoke("/user/"+d+"/project/"+b,"GET",null,a,c,e,f)},getAll:function(b,a,c,d,e){this.invoke("/user/project/"+b,"GET",null,a,c,d,e)},create:function(c,b,a,d,e,f){this.invoke("/user/project/"+c,"POST",{user:b},a,d,e,f)},change:function(d,b,a,c,e,f){this.invoke("/user/"+d,"PUT",{user:b},a,c,e,f)},remove:function(c,a,b,d,e){this.invoke("/user/"+c,"DELETE",null,a,b,d,e)}});Engine.api.registrate("UnitySpace.Users",UnitySpace.System.Controllers.UsersController);UnitySpace.System.EManifestType={WindowApplication:1,ConsoleApplication:2,ControlLibrary:10,ClassLibrary:11};Engine.init=["Debug","ExtJS","Keyboard","GINA","Repository","ProjectProfile"];UnitySpace.System.Manifest=function(a){Ext.apply(this,a)};Ext.extend(UnitySpace.System.Manifest,Object,{namespace:"Applications",name:null,title:null,authors:null,description:null,version:null,system:false,singleInstance:false,type:null});Ext.namespace("UnitySpace.System.Modules");UnitySpace.System.Modules.BaseModule=Ext.extend(Ext.util.Observable,{name:null,requiredModules:null,resources:null,validate:function(){if(!this.name){throw new UnitySpace.System.Modules.ModuleException(this.resources.UnknownModuleName)}if(!this.requiredModules){return}var a=this.requiredModules.split(",");for(var c=0;c<a.length;c++){var b=a[c].trim();if(!Engine.isInitializeModule(b)){throw new UnitySpace.System.Modules.ModuleException(this.resources.RequiedModule,b)}}},publish:function(a,c){var b="/modules/"+this.name.toLowerCase();if(Ext.isDefined(a)){b+="/"+a}UnitySpace.System.Modules.BaseModule.superclass.publish(b,c)},subscribe:function(a,e,d,b){var c="/modules/"+this.name.toLowerCase();if(Ext.isDefined(a)){c+="/"+a}UnitySpace.System.Modules.BaseModule.superclass.subscribe(a,e,d,b)},initialize:function(){log(String.format("Initialize module {0}.",this.name))},dispose:function(){}});UnitySpace.System.Modules.CommandShellModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"CommandShell",requiredModules:"ApplicationsCatalog, TaskManager",initialize:function(){UnitySpace.System.Modules.ErrorModule.superclass.initialize.apply(this,arguments);this.applicationCatalog=Engine.Module.ApplicationsCatalog;this.taskManager=Engine.Module.TaskManager},exec:function(a){this.treadExec.defer(1,this,[a])},treadExec:function(d){if(!d){return}d=d.trim();var b=d;var c=d.indexOf(" ");var a=null;if(c>0){b=d.substr(0,c);a=d.substr(c+1,d.length-c-1);a=a.split(",")}if(this.execModule(b,a)){return}this.execApplication(b,a)},execApplication:function(c,a){var b=null;try{b=this.applicationCatalog.getApplication(c)}catch(d){}if(!b){return false}this.taskManager.createTask(b,this.onCreateTask.createDelegate(this,[a],true));return true},execModule:function(b,a){var c=null;try{c=Engine.Module[b]}catch(d){}if(!c){return false}if(!a||a.length==0){throw String.format(this.resources.EmptyModuleMethod,b)}var f=a[0];a.shift();c[f].apply(c,a);return true},onCreateTask:function(b,a){if(!b){return}b.main(a)}});Engine.registrate(UnitySpace.System.Modules.CommandShellModule);UnitySpace.System.Modules.DebugModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"Debug",initialize:function(){UnitySpace.System.Modules.DebugModule.superclass.initialize.apply(this,arguments);if(!Ext.isDefined(DEBUG)){return}if(!Ext.isDefined(log4javascript)){throw new UnitySpace.System.Modules.ModuleException(UnitySpace.Resources.System.Modules.DebugModule.Log4JavaScriptNotFound)}var a=Engine.config.get("Debug.mock",false);if(a){log("Mock enable");UnitySpace.System.Controllers.Mocking()}this.subscribe("*",this._logChannels)},_logChannels:function(c,b){var a=c;if(Ext.isFunction(c)){a="function"}else{if(Ext.isObject(c)){a="object"}else{if(!Ext.isDefined(c)){a=""}}}log(String.format("channel: [{0}] {1}",b,a))}});Engine.registrate(UnitySpace.System.Modules.DebugModule);UnitySpace.System.Modules.ExtJSModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"ExtJS",initialize:function(){UnitySpace.System.Modules.ExtJSModule.superclass.initialize.apply(this,arguments);Ext.DefaultDateFormat="Y-m-d\\TH:i:s\\Z";Ext.BLANK_IMAGE_URL="javascripts/ext-3.3.0/resources/images/default/s.gif";Ext.QuickTips.init();Ext.PAGE_SIZE=10;Ext.LoadMask.prototype.msgCls="x-mask-loading";Ext.Ajax.defaultHeaders={Accept:"application/json","Content-Type":"application/json; charset=utf-8"};this.hookException();this.hookNetwork();this.hookRest()},hookRest:function(){Ext.urlEncode=function(f,d){var b,a=[],c=encodeURIComponent;Ext.iterate(f,function(e,g){b=Ext.isEmpty(g);if(!b){Ext.each(b?e:g,function(h){a.push("/",c(e),"/",(!Ext.isEmpty(h)&&(h!=e||!b))?(Ext.isDate(h)?Ext.encode(h).replace(/"/g,""):c(h)):"")})}});if(!d){a.shift();d=""}return d+a.join("")};Ext.urlAppend=function(a,b){if(!Ext.isEmpty(b)){return a+"/"+b}return a}},hookException:function(){if(!DEBUG){this._initializeExtErrorHandler()}Ext.apply(Function.prototype,{safe:function(){var a=this;return function(){if(!DEBUG){try{a.apply(this,arguments)}catch(b){Engine.error(new UnitySpace.System.ApplicationError(b))}}else{a.apply(this,arguments)}}}})},_initializeExtErrorHandler:function(){var a=Ext.util.Event.prototype.fire;Ext.util.Event.prototype.fire=function(){var b=false;try{b=a.apply(this,arguments)}catch(c){Engine.error(new UnitySpace.System.ApplicationError(c))}return b}},hookNetwork:function(){Ext.Ajax.on("requestcomplete",function(d,a,b){try{var e=a.getAllResponseHeaders();log("url="+b.url+"\nheader="+e);if(e.indexOf("application/json")!=-1){this.decodeResponse(a)}}catch(c){a.responseData=null;b.success=null;Engine.error(new UnitySpace.System.Net.ConnectionException(c))}},this);Ext.Ajax.on("requestexception",function(d,a,b){if(a.isTimeout){return}if(a.isAbort){return}try{if(a.status==0||!Ext.isDefined(a.responseText)){throw a.statusText}if(!b.headers.Accept){this.decodeResponse(a)}else{if(b.headers.Accept.indexOf("application/json")!=-1){this.decodeResponse(a)}}if(a.responseData&&!UnitySpace.System.Net.ActionResponse.canParse(a)){throw a.responseText}}catch(c){a.responseData=null;b.failure=null;Engine.error(new UnitySpace.System.Net.ConnectionException(c))}},this)},prepareForDecode:Ext.emptyFn,decodeResponse:function(a){this.prepareForDecode(a);if(!a.getResponseHeader){a.responseData=Ext.decode(a.responseText);return}var b=a.getResponseHeader("Content-Type");a.responseData=null;if(!b){return}if(b.indexOf("json")!=-1){if(a.responseText&&a.responseText.trim()!=""){a.responseData=Ext.decode(a.responseText)}}else{throw this.resources.UnsupportHeaderType}}});Engine.registrate(UnitySpace.System.Modules.ExtJSModule);Ext.namespace("UnitySpace.System.Security");UnitySpace.System.Security.Ability=function(){UnitySpace.System.Security.Ability.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Security.Ability,Object,{context:null,initialize:function(a,b){this.user=a;this.project=b},ability:function(a){this.context={user:this.user,project:a?a:this.project};return this},can:function(d){var b=null;var f=null;var e=this.context.project.roles;if(!e){return false}for(var c=0;c<=e.length;c++){if(c==e.length){f=this.rules.All[d]}else{var g=this.rules[e[c]];if(!g){continue}f=g[d]}if(Ext.isFunction(f)){var a=null;if(arguments.length>1){a=[];for(c=1;c<arguments.length;c++){a.push(arguments[c])}}b=f.apply(this,a)}else{b=f}if(b!=null){return b}}return false},rules:{Owner:{leave_project:false,edit_project:true,read_application:true,remove_project:true,remove_user:function(a){return a.indexOf("Owner")==-1},edit_user:true,read_roles:true,add_user:true},Admin:{edit_project:true,read_application:true,remove_user:function(a){return a.indexOf("Owner")==-1},edit_user:function(a){return a.indexOf("Owner")==-1},read_roles:true,add_user:true},All:{switch_project:function(a){return this.project.id!=a},leave_project:true,read_user:true}}});UnitySpace.System.Modules.GINAModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"GINA",initialize:function(){UnitySpace.System.Modules.GINAModule.superclass.initialize.apply(this,arguments);this.ability=new UnitySpace.System.Security.Ability();this.accountController=Engine.api.get("UnitySpace.Account");Engine.addTask({method:this.initializeRoles,scope:this});Engine.addTask({method:this.authenticate,scope:this})},authenticate:function(a){a();this.logon()},initializeRoles:function(b){var a=Engine.api.get("UnitySpace.Roles");a.get(this.onInitializeRolesSuccess.createDelegate(this,[b],true),this.onInitializeRolesFailure.createDelegate(this))},onInitializeRolesSuccess:function(a,c,b){this.roles=a.responseData;b()},onInitializeRolesFailure:function(a){Engine.error(new UnitySpace.System.Net.ConnectionException(a.responseData))},getRoles:function(){return this.roles},logon:function(){this.accountController.get(this.onGetCurrentUserSuccess.createDelegate(this),this.onGetCurrentUserFailure.createDelegate(this))},onGetCurrentUserSuccess:function(a){debug();this.setCurrentUser(a.responseData);this.publish("logon")},onGetCurrentUserFailure:function(a){if(a.status!=401){Engine.error(new UnitySpace.System.Net.ConnectionException(a.responseData));return}var b=Engine.config.get("Authenticate.type","FormAuthenticate");var c=Engine.authenticateProviders.get(b);this.publish("beforelogon",c);this.validateUser(c)},validateUser:function(a){a.authenticate(this.onValidateUserSuccess.createDelegate(this),this.onValidateUserFailure.createDelegate(this))},onValidateUserSuccess:function(a){this.setCurrentUser(a.responseData);this.publish("logon")},onValidateUserFailure:function(a){var b=UnitySpace.System.Net.ActionResponse.parse(a);this.publish("error",b)},logoff:function(){this.publish("logoff")},continueLogoff:function(){this.accountController.signout(this.onLogoffSuccess.createDelegate(this),this.onLogoffFailure.createDelegate(this))},onLogoffSuccess:function(){this.setCurrentUser();this.logon()},onLogoffFailure:function(a){var b=UnitySpace.System.Net.ActionResponse.parse(a);Engine.error(new UnitySpace.System.Net.ConnectionException(b))},setCurrentUser:function(a){if(!a){this.currentUser=null}else{this.currentUser=new UnitySpace.System.Modules.User(a)}},getCurrentUser:function(){if(!this.currentUser){throw this.resources.UnknownCurrentUser}if(!this.currentUser.ability){this.ability.user=this.currentUser;this.currentUser.ability=this.ability.ability.createDelegate(this.ability)}return this.currentUser},isCurrentUser:function(a){return(a==this.getCurrentUser().name)}});Engine.registrate(UnitySpace.System.Modules.GINAModule);UnitySpace.System.Modules.KeyboardModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"Keyboard",keyMap:null,initialize:function(){UnitySpace.System.Modules.KeyboardModule.superclass.initialize.apply(this,arguments);this.keyMap=new Ext.KeyMap(document,[{key:Ext.EventObject.BACKSPACE,stopEvent:false,fn:function(b,c){var a=c.target.tagName;if(!a){return}a=a.toLowerCase();if(a!="input"&&a!="textarea"){log("stopping backspace for tag: "+a);c.stopEvent()}}}])},addHotKey:function(a){this.keyMap.addBinding(a)}});Engine.registrate(UnitySpace.System.Modules.KeyboardModule);UnitySpace.System.Modules.ModuleException=function(){UnitySpace.System.Modules.ModuleException.constructor.apply(this,arguments);this.name="ModuleException"};Ext.extend(UnitySpace.System.Modules.ModuleException,UnitySpace.Exception,{});UnitySpace.System.Modules.Project=function(a){this.initialize(a)};UnitySpace.System.Modules.Project=Ext.extend(Object,{initialize:function(a){this.id=a.id;this.name=a.name;this.roles=a.roles;this.applications=a.applications}});UnitySpace.System.Modules.ProjectProfileModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"ProjectProfile",requiredModules:"GINA",profile:null,defaultProject:null,initialize:function(){UnitySpace.System.Modules.ProjectProfileModule.superclass.initialize.apply(this,arguments);this.projectsController=Engine.api.get("UnitySpace.Projects");Engine.addTask({method:this.switchToDefaultProject,scope:this})},getCurrentProject:function(){return this.currentProject},getCurrentProjectId:function(){if(this.currentProject){return this.currentProject.id}return UnitySpace.Resources.System.Modules.NullProjectName},switchProject:function(a){this.publish("beforeload");if(a){this.projectsController.get(a,this.onGetCurrentProjectSuccess.createDelegate(this),this.onFailure.createDelegate(this))}else{this.projectsController.getAll(null,this.onGetCurrentProjectSuccess.createDelegate(this),this.onFailure.createDelegate(this))}},switchToDefaultProject:function(){this.projectsController.getCurrent(null,this.onGetCurrentProjectSuccess.createDelegate(this),this.onFailure.createDelegate(this))},onGetCurrentProjectSuccess:function(a){var b=a.responseData;if(!Ext.isDefined(b)||b==null){this._loadAdminProject()}else{if(Ext.isObject(b)){this._loadDefaultProject(b)}else{if(Ext.isArray(b)&&b.length==1){this._loadDefaultProject(b[0])}else{this._showSwitchProjectWindow(b)}}}},_loadAdminProject:function(){this.currentProject=this.getDefaultProject();this._loadProject()},getDefaultProject:function(){if(!this.defaultProject){this.defaultProject=new UnitySpace.System.Modules.Project({id:0,name:"Default Project",roles:"Owner"})}return this.defaultProject},_loadDefaultProject:function(a){this._switchProject(a)},_showSwitchProjectWindow:function(a){this.publish("beforeswitch",this._switchProject.createDelegate(this))},_switchProject:function(a){this.currentProject=new UnitySpace.System.Modules.Project(a);this.publish("switch");if(this.currentProject!=null){this.projectsController.setCurrent(null,this.currentProject.id,this._loadProject.createDelegate(this),this.onFailure.createDelegate(this))}else{this._loadProject()}},_loadProject:function(){var a=this.getCurrentProject();Engine.Module.GINA.getCurrentUser().ability().project=a;if(a.id==0){this.onGetApplications(null);return}this.projectsController.getApplications(a.id,this.onGetApplicationSuccess.createDelegate(this),this.onFailure.createDelegate(this))},onGetApplicationSuccess:function(a,b){this.onGetApplications(a.responseData)},onFailure:function(a,b){var c=WebDesktop.net.ActionResponse.parse(a);Engine.error(new UnitySpace.System.Net.ConnectionException(c))},onGetApplications:function(a){var b=this.getCurrentProject();b.applications=a;this.publish("loaded")}});Engine.registrate(UnitySpace.System.Modules.ProjectProfileModule);UnitySpace.System.Modules.RepositoryModule=Ext.extend(UnitySpace.System.Modules.BaseModule,{name:"Repository",requiredModules:"GINA",manifestHash:null,initialize:function(){UnitySpace.System.Modules.RepositoryModule.superclass.initialize.apply(this,arguments);this.manifestHash={};this.reposirotyController=Engine.api.get("UnitySpace.Repository")},get:function(b,e){if(Ext.isEmpty(b)){throw new UnitySpace.ArgumentNullException("name")}var d=b.split(",");var a=[];var c=[];Ext.each(d,function(f){var g=f.trim();if(!Ext.isDefined(this.manifestHash[g])){a.push(g)}c.push(g)},this);if(a.length>0){this.reposirotyController.get(a,this.onGetSuccess.createDelegate(this,[c,e],true),this.onGetFailure.createDelegate(this,[e],true))}else{this._getLocal(c,e)}},onGetSuccess:function(a,b,c,d){Ext.each(a.responseData,function(e){this.manifestHash[e.name]=new UnitySpace.Manifest(e)},this);this._getLocal(c,d)},onGetFailure:function(a,b,d){var c=UnitySpace.System.Net.ActionResponse.parse(a);Engine.error(new UnitySpace.System.Modules.ModuleException(c));d()},_getLocal:function(b,c){var a={};Ext.each(b,function(d){a[d]=this.manifestHash[d]},this);c(a)},required:function(a,d){if(Ext.isEmpty(a)){throw new UnitySpace.ArgumentNullException("name")}var c=a.split(",");var b=[];Ext.each(c,function(e){b.push(e.trim())},this);this.reposirotyController.required(b,this.onRequiredSuccess.createDelegate(this,[d],true),this.onRequiredFailure.createDelegate(this,[d],true))},onRequiredSuccess:function(a,b,c){c(true)},onRequiredFailure:function(a,b,d){var c=UnitySpace.System.Net.ActionResponse.parse(a);Engine.error(new UnitySpace.System.Modules.ModuleException(c));d(false)},list:function(b,a){}});Engine.registrate(UnitySpace.System.Modules.RepositoryModule);UnitySpace.System.Modules.User=function(a){this.initialize(a)};UnitySpace.System.Modules.User=Ext.extend(Object,{initialize:function(a){this.id=a.id;this.name=a.email;this.email=a.email;this.firstName=a.first_name;this.isOnline=a.is_online;this.lastName=a.last_name;this.city=a.city;this.country=a.country;this.address=a.address;this.avatar=a.avatar;this.fullName=String.format("{0} {1}",this.lastName,this.firstName)}});UnitySpace.System.Net.ActionResponse={canParse:function(a){var b=a.responseData;if(!b){return false}return Ext.isDefined(b.alert)},parse:function(a){var c=a.responseData;if(!c){return this.resources.UnknownResponse}var b=c.alert;if(b){return b}return this.resources.UnknownResponse}};UnitySpace.System.Net.ConnectionException=function(){UnitySpace.System.Net.ConnectionException.superclass.constructor.apply(this,arguments);this.name="ConnectionException"};Ext.extend(UnitySpace.System.Net.ConnectionException,UnitySpace.Exception,{});UnitySpace.System.Security.AuthenticateProviderException=function(){UnitySpace.System.Security.AuthenticateProviderException.superclass.constructor.apply(this,arguments);this.name="AuthenticateProviderException"};Ext.extend(UnitySpace.System.Security.AuthenticateProviderException,UnitySpace.Exception,{});UnitySpace.System.Security.AuthenticateProviderManager=function(){UnitySpace.System.Security.AuthenticateProviderManager.superclass.constructor.apply(this,arguments);this.providers={}};Ext.extend(UnitySpace.System.Security.AuthenticateProviderManager,Object,{providers:null,get:function(a){var c=this.providers[a];if(!Ext.isDefined(c)){throw new UnitySpace.System.Security.AuthenticateProviderException(UnitySpace.Resources.System.Security.ProviderNotRegistrate,a)}if(!c.instance){var b=Engine.config.get("Connection.restfull",false);c.instance=new c.className()}return c.instance},registrate:function(a,b){if(Ext.isEmpty(a)){throw new UnitySpace.ArgumentNullException("name")}if(Ext.isDefined(this.providers[a])){throw new UnitySpace.System.Security.AuthenticateProviderException(UnitySpace.Resources.System.Security.AuthenticateProviderManager.ProviderAlreadyRegistrate,a)}this.providers[a]={className:b,instance:null}}});Engine.authenticateProviders=new UnitySpace.System.Security.AuthenticateProviderManager();UnitySpace.System.Security.BaseAuthenticateProvider=function(){UnitySpace.System.Security.BaseAuthenticateProvider.superclass.constructor.apply(this,arguments)};Ext.extend(UnitySpace.System.Security.BaseAuthenticateProvider,Object,{authenticate:function(a,b){}});UnitySpace.System.Security.FormAuthenticateProvider=function(){UnitySpace.System.Security.FormAuthenticateProvider.superclass.constructor.apply(this,arguments);this.name=Engine.config.get("Authenticate.name");this.password=Engine.config.get("Authenticate.password");this.rememberMe=Engine.config.get("Authenticate.rememberMe")};Ext.extend(UnitySpace.System.Security.FormAuthenticateProvider,UnitySpace.System.Security.BaseAuthenticateProvider,{authenticate:function(a,b){var c=Engine.api.get("UnitySpace.Account");c.signin(this.name,this.password,this.rememberMe,a,b)}});Engine.authenticateProviders.registrate("FormAuthenticate",UnitySpace.System.Security.FormAuthenticateProvider);UnitySpace.System.SystemException=function(){UnitySpace.System.SystemException.superclass.constructor.apply(this,arguments);this.name="SystemException"};Ext.extend(UnitySpace.System.SystemException,UnitySpace.Exception,{});UnitySpace.Task=function(a){Ext.apply(this,a)};Ext.extend(UnitySpace.Task,Object,{defaultFn:function(a){a()},name:null,method:this.defaultFn,scope:window,isLast:false,wait:0});
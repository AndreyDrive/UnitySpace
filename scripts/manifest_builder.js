load('scripts/json.js');
load('scripts/files.js');

ManifestBuilder = function() {
    function load() {
        var manifest = readFile('Applications/manifest/manifest.jsb2');
        eval('manifest = ' + manifest);
        return manifest;
    }

    function save(manifest) {
        var json = JSON.stringify(manifest, null, '\t');
        writeFile('Applications/manifest/manifest.jsb2', json);
    }

    function isProjectScript(projectName, info) {
        var re = /\.\.\/([^/]+)\/manifest\/src\/$/;
        var match = re.exec(info.path);
        return (match && match[1] == projectName);
    }

    function isProjectResource(projectName, info) {
        var re = /\.\.\/([^/]+)\/manifest\/src\/resources\/$/;
        var match = re.exec(info.path);
        return (match && match[1] == projectName);
    }

    function updateScripts(packet, projectName, language) {
        var manifestScript = -1;
        var manifestResource = -1;
        //projectName = projectName.toLowerCase();

        var includes = packet.fileIncludes;
        for (var index = 1; index < includes.length; index++) {
            if (isProjectScript(projectName, includes[index]))
                manifestScript = index;
            if (isProjectResource(projectName, includes[index]))
                manifestResource = index;
        }

        if (manifestResource == -1)
            var fileName = 'Resources.'+language+'.js';
            if (!isFileExists('Applications/'+projectName+'/manifest/src/resources/'+fileName)) {
                fileName = 'Resources.en-US.js';
            }

            includes.push({
                text: fileName,
                path: '../'+projectName+'/manifest/src/resources/'
            });

        if (manifestScript == -1)
            includes.push({
                text: 'Manifest.js',
                path: '../'+projectName+'/manifest/src/'
            });

    }

    function isProjectStyle(projectName, info) {
        var re = /\.\.\/([^/]+)\/manifest\/resources\/css\/$/;
        var match = re.exec(info.path);
        return (match && match[1] == projectName);
    }

    function updateStyles(packet, projectName) {
        //projectName = projectName.toLowerCase();

        var includes = packet.fileIncludes;
        var result = false;
        for (var index = 1; index < includes.length; index++) {
            if (isProjectStyle(projectName, includes[index])) {
                result = true;
                break;
            }
        }

        if (!result)
            includes.push({
                text: 'manifest.css',
                path: '../'+projectName+'/manifest/resources/css/'
            });
    }

    function isProjectResources(projectName, info) {
        var re = /\.\.\/([^/]+)\/manifest\/resources\/images\/$/;
        var match = re.exec(info.path);
        return (match && match[1] == projectName);
    }

    function updateResource(rescource, projectName) {
        //projectName = projectName.toLowerCase();

        var result = false;
        for (var index = 1; index < rescource.length; index++) {
            if (isProjectResources(projectName, rescource[index])) {
                result = true;
                break;
            }
        }

        if (!result)
            rescource.push({
                src: '../'+ projectName + '/manifest/resources/images/',
                dest: 'resources/images/',
                filters: '.*-icon.*'
            });
    }

    function getScriptPacket(packets, language) {
        for (var index = 0; index < packets.length; index++) {
            var re = /Application\sManifest\s\(([^)]+)\)$/;
            var match = re.exec(packets[index].name);
            if (match && match[1] == language)
                return packets[index];
        }
    }

    function getStylePacket(packets) {
        for (var index = 0; index < packets.length; index++) {
            if (packets[index].name == "Application Manifest Style")
                return packets[index];
        }
    }

    function updateProjectManifest(manifest, projectName) {
        languages.forEach(function(language) {
            var packet = getScriptPacket(manifest.pkgs, language);
            updateScripts(packet, projectName, language);
        }, this);

        var stylePacket = getStylePacket(manifest.pkgs);

        updateStyles(stylePacket, projectName);

        updateResource(manifest.resources, projectName);
    }

    return {
        update: function(projectName) {
            print('Update manifest info...');
            var manifest = load();
            updateProjectManifest(manifest, projectName);
            save(manifest);
        },

        rebuild: function() {
            print('Rebuild manifest info...');
            var manifest = load();

            var directories = getDirecotories('Applications/');
            directories.forEach(function(directory) {
                var projectName = directory.getName();
                if (projectName == 'manifest' || projectName == 'common' )
                    return;

                print('Update ' + projectName + ' manifest info...');
                updateProjectManifest(manifest, projectName);
            }, this);

            save(manifest);
        },

        create: function() {
            print('Create manifest info...');

            var manifest = {
                projectName: 'Application Manifest',
                deployDir: 'deploy/',
                licenseText: 'Application Manifest License',
                pkgs: [],
                resources: []
            };

            languages.forEach(function(language) {
                manifest.pkgs.push({
                    name: 'Application Manifest (' + language + ')',
			        file: 'manifest.' + language + '.js',
			        fileIncludes:[]
                });
            }, this);

            manifest.pkgs.push({
                name: 'Application Manifest Style',
			    file: 'resources/css/manifest.css',
			    fileIncludes:[]
            });

            save(manifest);
        }
    }
};
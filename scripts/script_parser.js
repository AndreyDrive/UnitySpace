load('scripts/script_validator.js');
load('scripts/script_sorter.js');

ScriptParser = function(/*namespace, */rootDirectory) {
    var directory = rootDirectory + '/src';
    //var languageDirectroy = '/resources'
    var languages = [];
    var classes = [];
    var scriptValidator = new ScriptValidator();
    var scriptSorter = new ScriptSorter();

    function getNamespace(namespace, fileName) {
        var fileNameWithoutExt = fileName;
        var lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 &&  lastDotIndex < fileName.length() - 1)
            fileNameWithoutExt = fileName.substring(0, lastDotIndex);

        namespace  = namespace ? namespace + '.' : '';
        return namespace + fileNameWithoutExt;
    }

    function getClasses(directory, namespace) {
	    var files = getFiles(directory, 'js');
        if (!files) return;

        files.forEach(function (file, index, files) {
            if (file.isDirectory()) {
                getClasses(file.getPath(), getNamespace(namespace, file.getName()))
            }
            else {
                var classInfo = {
                    fileName: ''+file.getName(),
                    filePath: (''+file.getParent().replace('\\', '/')).replace(rootDirectory+'/', ''),
                    fullFileName: ''+file.getPath()
                };

                var language = getFileLanguage(file.getName());
                if (language) {
                    if (languages.length == 0) {
                        classInfo.name = namespace.replace('resources', 'Resources');
                        classInfo.isResource = true;
                        classInfo.language = language;
                        classes.push(classInfo);
                    }
                    languages.push(language);
                }
                else {
                    classInfo.name = getNamespace(namespace, file.getName());
                    classes.push(classInfo);
                }

            }
        }, this);
    }

    function getClassIndex(name) {
        for (var index = 0; index < classes.length; index++) {
            if (classes[index].name == name)
                return index;
        }

        return -1;
    }

    function getDependences() {
        classes.forEach(function(classInfo) {
            classInfo.dependences = [];

            var fileText = readFile(classInfo.fullFileName);
            var re = /\/\/\s*using\s+([A-Za-z0-9_.]+)/g;
            var match = null;
            //print(classInfo.fullFileName + '  ' +re.exec(fileText))
            while ((match = re.exec(fileText)) != null) {
                var index = getClassIndex(match[1]);
                if (index == -1)
                    throw java.lang.String.format('Unknown class name %s', match[1]);

                //print('\t'+match[1]);
                classInfo.dependences.push(index);
            }
        });
    }

    function getFileLanguage(fileName) {
        var re = /Resources\.([^.]*)\.js$/;
        var match = re.exec(fileName);

        if (!match)
            return null;

        return match[1];
    }

    return {
        getDirectory: function() {
            return rootDirectory;
        },

/*
        getNamespace: function() {
            return namespace;
        },
*/

        getLanguages: function() {
            return languages;
        },

        getClasses: function() {
            return classes;
        },

        getSortOrder: function() {
            return scriptSorter.getSortOrder();
        },

        parse: function() {
            print('Parser script...');
            getClasses(directory/*, namespace*/);
            print('\tFound '+classes.length+' classes');
            getDependences();
            print('\tSupport languages: '+languages);
            scriptValidator.validate(classes);
            scriptSorter.sort(classes);
        }
    }
};

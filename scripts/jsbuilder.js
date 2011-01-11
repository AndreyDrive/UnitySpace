load('scripts/json.js');
load('scripts/script_parser.js');
load('scripts/script_generator.js');
load('scripts/style_parser.js');
load('scripts/style_generator.js');
load('scripts/resources_parser.js');

jsBuilderProject = function(projectName, /*namespace,*/ directory) {
    var project = null;
    var scriptParser = new ScriptParser(/*namespace,*/ directory);
    var scriptGenerator = new ScriptGenerator(projectName);
    var styleParser = new StyleParser(directory);
    var styleGenerator = new StyleGenerator(projectName);
    var resourcesGenerator = new ResourcesParser(directory);

    return {
        parse: function() {
            scriptParser.parse();
            styleParser.parse();
        },

        generate: function() {
            var classes = scriptParser.getClasses();
            var sortOrder = scriptParser.getSortOrder();
            var languages = scriptParser.getLanguages();
            var scriptPackets = scriptGenerator.generate(classes, sortOrder, languages);

            var styles = styleParser.getStyles();
            var themes = styleParser.getThemes();
            var stylesPackets = styleGenerator.generate(styles, themes);

            project = {
                projectName: projectName,
                deployDir: 'deploy/',
                licenseText: projectName + ' license',
                pkgs: [],
                resources: []
            };

            resourcesGenerator.parse();
            if (resourcesGenerator.hasResources())
                project.resources.push({
                    src: 'resources/images',
                    dest: 'resources/images',
                    filters: '.*'
                });

            project.pkgs =  scriptPackets.concat(stylesPackets);
        },

        save: function() {
            var json = JSON.stringify(project, null, '\t');
            writeFile(directory + '/'+ projectName + '.jsb2', json)
        }
    }
};

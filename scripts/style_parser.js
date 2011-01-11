StyleParser = function(rootDirectory) {
    var directory = rootDirectory + '/resources/css';
    var themes = [];
    var styles = [];

    function getStyles(directory) {
        var files = getFiles(directory, 'css');
        if (!files) return;

        files.forEach(function (file, index, files) {
            if (file.isDirectory()) {
                getStyles(file.getPath())
            }
            else {
                var re = /resources\/css\/([^/]+)\/$/;
				var match = re.exec(file.getParentFile().toURL().toString());

				var theme = 'base';
				if (match)
					theme = match[1];

                if (!styles[theme]) {
                    themes.push(theme);
                    styles[theme] = [];
                }

                styles[theme].push({
                    fileName: ''+file.getName(),
                    filePath: 'resources/css' + (match ? '/' + match[1] : '')
                })
            }
        }, this);
    }

    return {
        getDirectory: function() {
            return rootDirectory;
        },

        getThemes: function() {
            return themes;
        },

        getStyles: function() {
            return styles;
        },

        parse: function() {
            print('Parser styles...');
            getStyles(directory);
            print('\tSupport themes: ', themes);
        }
    }
};

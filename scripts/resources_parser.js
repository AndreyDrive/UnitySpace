ResourcesParser = function(rootDirectory) {
    var directory = rootDirectory + '/resources/images';
    var hasResources = false;

    function checkDirectory() {
        hasResources = isFileExists(directory);
    }

    return {
        hasResources: function() {
            return hasResources;
        },

        parse: function() {
            print('Parser resources...');
            checkDirectory();
        }
    }
};

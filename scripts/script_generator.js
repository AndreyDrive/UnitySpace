ScriptGenerator = function(projectName) {

    function createPacket(classes, sortOrder, language) {
		var packet = {
            name: projectName,
            file: projectName.toLowerCase() + '.' +language+'.js',
            fileIncludes: []
        };

/*
        packet.fileIncludes.push({
            text: 'Resources.'+language+'.js',
            path: 'src/resources/'
        });
*/

        sortOrder.forEach(function(sortIndex) {
            var classInfo = classes[sortIndex];

            if (classInfo.isResource) {
                packet.fileIncludes.push({
                    text: 'Resources.' + language + '.js',
                    path: classInfo.filePath + '/'
                })
            }
            else
                packet.fileIncludes.push({
                    text: classInfo.fileName,
                    path: classInfo.filePath + '/'
                })
        }, this);

        return packet;
    }

    return {
        generate: function(classes, sortOrder, languages) {
            print('Generate script packet...');
            var packets = [];
            languages.forEach(function (language) {
                var packet = createPacket(classes, sortOrder, language);
                packets.push(packet);
            }, this);

            return packets;
        }
    }
};
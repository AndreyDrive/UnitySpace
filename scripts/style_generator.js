StyleGenerator = function(projectName) {

    function createStylePacket(styles, theme) {
        var themeName = theme == 'base' ? '' : '-'+theme;
        var packet = {
            name: projectName,
            file: 'resources/css/'+projectName.toLowerCase() + themeName + '.css',
            fileIncludes: []
        };

        styles[theme].forEach(function(style) {
            packet.fileIncludes.push({
                text: style.fileName,
                path: style.filePath + '/'
            })
        }, this);

        return packet;
    }
    return {
        generate: function(styles, themes) {
            print('Generate style packet...');
            var packets = [];
            themes.forEach(function(theme) {
                var packet = createStylePacket(styles, theme);
                packets.push(packet);
            }, this);
            return packets;
        }
    }
};
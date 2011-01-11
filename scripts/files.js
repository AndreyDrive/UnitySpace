load('scripts/ejs_production.js');

importPackage(java.io);

function createDirectory(name) {
	var file = new File(name);
	file.mkdirs();
}

function writeFile(file, text) {
	var output = new BufferedWriter(new FileWriter(file));
    try {
		output.write( text );
    }
    finally {
		output.close();
    }
}

function isFileExists(fileName) {
    return new File(fileName).exists();
}

function getDirecotories(directory) {
    var file = new File(directory);

    var files = file.listFiles(new FileFilter({
        accept: function(file) {
            if (file.isDirectory())
                return true;
        }
    }));

    return files;
}

function getFiles(directory, mask) {
    var dir = new File(directory);

    var files = dir.listFiles(new FileFilter({
        accept: function(file) {
            if (file.isDirectory())
                return true;

            var fileName = file.getName();
            var extension = null;
            var lastDotIndex = fileName.lastIndexOf('.');
            if (lastDotIndex > 0 &&  lastDotIndex < fileName.length() - 1)
                extension = fileName.substring(lastDotIndex+1).toLowerCase();

            return mask.indexOf(extension) != -1;
        }
    }));

    return files;
}

function renderTemplate(file, templateFile, data) {
	var template = readFile('scripts/generate/templates/'+templateFile);
	var result = new EJS({text:template}).render(data);
	writeFile(file, result);
}

function _copyFile(sourceFile, destFile) {
	if(!destFile.exists())
		destFile.createNewFile();

	var source = null;
	var destination = null;
	try {
		source = new FileInputStream(sourceFile).getChannel();
		destination = new FileOutputStream(destFile).getChannel();
		destination.transferFrom(source, 0, source.size());
	}
	finally {
		if(source != null)
		    source.close();

    	if(destination != null)
	    	destination.close();
	}
}

function _copyDirectory(sourceLocation, targetLocation) {
	if (sourceLocation.isDirectory()) {
		if (!targetLocation.exists())
			targetLocation.mkdir();
            
		var children = sourceLocation.list();
        for (var i=0; i<children.length; i++) {
			copyDirectory(
				new File(sourceLocation, children[i]),
				new File(targetLocation, children[i]));
		}
	}
	else
		_copyFile(sourceLocation, targetLocation)
}

function copyFile(sourceName, destName) {
	var sourceFile = new File(sourceName);
	var destFile = new File(destName);
	_copyFile(sourceFile, destFile);
}

function copyDirectory(sourceDir, destDir) {
	var sourceLocation = new File(sourceDir);
	var targetLocation = new File(destDir);
	_copyDirectory(sourceLocation, targetLocation);
}

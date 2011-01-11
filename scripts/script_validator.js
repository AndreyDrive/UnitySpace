ScriptValidator = function(classesToValidate) {
    var classes = classesToValidate;

    function validateCrossRefrenceForClass(path, classIndex) {
        path.push(classIndex);
        var classInfo = classes[classIndex];
        classInfo.dependences.forEach(function(dependenceIndex, index, dependences) {
            if (path.indexOf(dependenceIndex) != -1) {
                throw java.lang.String.format(
                        'Cross refrence classes %s and %s',
                        classInfo.name,
                        classes[dependenceIndex].name);
            }
            else
                validateCrossRefrenceForClass(path, dependenceIndex)
        }, this);
        path.pop();
    }

    function validateCrossReference() {
        for (var index = 0; index < classes.length; index++) {
            var path = [];
            validateCrossRefrenceForClass(path, index);
        }
    }


    return {
        validate: function(classesToValidate) {
            print('Validate classes...');
            classes = classesToValidate;
            validateCrossReference();
        }
    }
};
ScriptSorter = function(classesToSort) {
    var classes = classesToSort;
    var sortOrder = [];

    function sortClasses() {
        var result = false;
        classes.forEach(function(classInfo, index) {
            classInfo.dependences.forEach(function(dependenceIndex) {
                var orderClassIndex = sortOrder.indexOf(index);
                var orderDependenceIndex = sortOrder.indexOf(dependenceIndex);
                if (orderDependenceIndex > orderClassIndex ) {
                        var value = sortOrder[orderDependenceIndex];
                        sortOrder.splice(orderDependenceIndex, 1);
                        sortOrder.splice(orderClassIndex, 0, value);
                        result = true;
                    }
            }, this);
        }, this);

        return result;
    }

    return {
        getSortOrder: function() {
            return sortOrder;
        },

        sort: function(classesToSort) {
            classes = classesToSort;

            print('Sort classes...');

            for (var index = 0; index < classes.length; index++)
                sortOrder.push(index);

            while (sortClasses()) {}
        }
    }
};
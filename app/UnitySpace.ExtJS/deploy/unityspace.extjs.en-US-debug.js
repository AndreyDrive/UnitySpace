/*!
 * UnitySpace.ExtJS license
 */
Ext.applyIf(Array.prototype, {

    /**
     * Checks if all of the given values exists in the given array 
     */
    includes: function() {
        for (var index = 0; index  < arguments.length; index ++) {
          if (this.indexOf(arguments[index]) === -1)
            return false;
        }

        return true;
    },

    /**
     * checks if given value exists in the given array
     * @param {Object} name Value
     * @param {Number} from From position
     */
    contains: function(name, from) {
        return (this.indexOf(name, from) !== -1);
    },

    /**
     * Insert value into array on position
     * @param {Object} item Value
     * @param {Number} pos Position
     */
    insert: function(item, pos) {
        if (pos >= this.length)
            throw 'Index out of range';

        var part = this.splice(pos, this.length - pos);
        this.concat(item, part);
    },

    /**
     * Insert value into array before given value
     * @param {Object} item Value
     * @param {Object} value Value before which insert
     */
    insertBefore: function(item, value) {
        var pos = this.indexOf(value);
        if (pos === -1)
            throw 'Value not exist';

        this.insert(item, pos);
    },

    /**
     * Insert value into array after given value
     * @param {Object} item Value
     * @param {Object} value Value after which insert
     */
    insertAfter: function(item, value) {
        var pos = this.indexOf(value);
        if (pos === -1)
            throw 'Value not exist';

        if (pos === this.length - 1) {
            this.push(item);
            return;
        }

        pos++;
        this.insert(item, pos);
    }
});
module.exports = {

    filter: function (myObject, myCriteria) {
        return myObject.filter(({type}) => type === myCriteria);
    },

    paginate: function (myObject, offset, limit) {
        if (!offset) {
            return myObject.slice(0, limit);
        } else {
            return myObject.slice(offset, offset + limit);
        }
    }


};

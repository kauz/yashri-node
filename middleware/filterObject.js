module.exports = function filterObject(myObject, myCriteria) {
    return myObject.filter(({type}) => type === myCriteria);
};
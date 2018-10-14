module.exports = function paginateObject(myObject, offset, limit) {
    return {events: myObject.slice(offset, offset + limit)};
};

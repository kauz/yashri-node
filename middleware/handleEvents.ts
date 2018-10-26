export interface events {
    events: event[];
}

export interface event {
    type: string,
    title: string,
    source: string,
    time: string,
    description: string | null,
    icon: string,
    data: object | null,
    size: string
}

module.exports = {

    filterObj: function (myObject: event[], myCriteria: string) {
        return myObject.filter(({type}) => type === myCriteria);
    },

    paginate: function (myObject: event[], offset: number, limit: number) {
        if (!offset) {
            return myObject.slice(0, limit);
        } else {
            return myObject.slice(offset, offset + limit);
        }
    }

};

module.exports = {


    unique: function(arr) {
        let obj = {};

        for (let i = 0; i < arr.length; i++) {
            let str = arr[i];
            obj[str] = true;
        }

        return Object.keys(obj);
    },


    contains: function(where, what){
        for(let i=0; i<what.length; i++){
            if(where.indexOf(what[i]) === -1) return false;
        }
        return true;
    }


};

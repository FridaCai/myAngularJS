/**
 * Created by caiw on 5/14/15.
 */

var utils = angular.module('utils', []);

utils = {
    getIndex:function(db, key, value){
        for(var i=0; i<db.length; i++){
            if(db[i][key] === value)
                return i;
        }
    },

    find:function(db, index){
        return db[index];
    },

    delete:function(db, index){
        db.splice(index, 1);
    },

    add:function(db, index, it){
        db.splice(index, 0, it);
    },

    edit:function(db, index, it){
        this.delete(db, index);
        this.add(db, index, it);
    },

    getMaxId:function(db){
        var maxId = Number.MIN_VALUE;
        for(var i=0; i<db.length; i++){
            maxId = Math.max(maxId, parseFloat(db[i].bomcategoryId));
        }
        return maxId;
    }
}

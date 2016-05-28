import {
    Meteor
}
from 'meteor/meteor';

import {
    Depts
}
from './departements.js';
//process.env.MONGO_URL = 'mongodb://localhost:27017/test'; //create environment variable
Meteor.startup(() => {
    console.log(process.env.MONGO_URL)
    // code to run on server at startup
    //console.log(Depts.find({nom:"MARTINIQUE"}).fetch())//for test
});

//Only for publish with mongoDB and get what fileds you want
//move on server/departements.js 
//Meteor.publish("depts.list", () => {
//    var data = Depts.find({},{ fields:{"année": 1, "code": 1, "nom": 1, "population": 1 } });
//    console.log(data.fetch().length)
//    return data;
//});
//Meteor.publish("depts.findYear", (year) => {
//    if(year){
//        var data = Depts.find({"année":year},{ fields:{"année": 1, "code": 1, "nom": 1, "population": 1 } });
//        console.log(data.fetch().length)
//        return data;        
//    }else{
//        return [];
//    }
//    
//});

Meteor.methods({
    getServerTime() {
            const _time = (new Date).toTimeString();
            return _time;
        }        
})
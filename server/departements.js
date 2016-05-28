import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const Depts = new Meteor.Collection('departements');
if(Meteor.isServer){
    Meteor.publish("depts.list",function () {
        var self = this;
        var data = Depts.find({}, {
            fields: {
                "année": 1,
                "code": 1,
                "nom": 1,
                "population": 1
            }
        });
        data.forEach(function(depts, index){
            self.added("depts.list", depts._id, depts)
        });
        console.log(data.fetch().length)
        return data;
        self.ready();
    });
    Meteor.publish("depts.findYear", function (year) {
        console.log(year)
        var self = this
        if (year !== undefined) {
            data = Depts.find({
                "année": year
            }, {
                fields: {
                    "année": 1,
                    "nom": 1,
                    "population": 1
                }
            });
            console.log(data.fetch().length)
            data.forEach(function (depts) {
                self.added("depts.list", depts._id, depts)
            });
            return data;
        } else {
            data = Depts.find({}, {
                fields: {
                    "année": 1,
                    "nom": 1,
                    "population": 1
                }
            });
        }
        self.ready();

    });   
}
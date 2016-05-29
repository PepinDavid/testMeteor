import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Depts } from '../api/departements.js';

import './dept.js';
import './table.js';
import './barchart.js';
import './linechart.js';
import './body.html';
Session.setDefault('nb',10)
Template.body.onCreated(function(){
        this.subscribe("depts.list")
});
Template.dateNow.helpers({
    clock() {
        return Session.get('time')
    },
});
Template.body.helpers({
    depts() {
        const depts = Depts.find({},{"limit": Session.get('nb'), "sort": {"nom": 1, "année": 1} }).fetch();
        return depts;
    }
});
Template.body.events({
    'click #more'(e){
        e.preventDefault();
        var count = Session.get('nb'),
        up = 10 + count;
        
        Session.set('nb', up);
        
    }
})
Meteor.startup(function () {
    setInterval(function () {
        Meteor.call("getServerTime", function (error, result) {
            Session.set("time", result);
        });
    }, 1000);
});
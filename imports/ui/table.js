import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Depts } from '../api/departements.js';

import './table.html';
Template.table.onCreated(function(){
    //this.filter = new ReactiveTable.Filter('table',['année'])
    this.subscribe("depts.list")
})
Template.table.helpers({
    myCollection() {
            return Depts.find().fetch();
        },
        tableSettings() {
            return {
                rowsPerPage: 25,
                showFilter: true,
                fileds: [{
                    key: 'nom',
                    label: 'Nom'
                }, {
                    key: 'année',
                    label: 'Année'
                }, {
                    key: 'code',
                    label: 'Code'
                }, {
                    key: 'population',
                    label: 'Population'
                }]
            }
        }
});

//Template.table.events({
//    "click td.année"(e, template){
//        var text = e.target.innerText;
//        console.log(template.filter.set(text))
//    }
//})
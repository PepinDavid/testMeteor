import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const Depts = new Mongo.Collection('departements');

//Meteor.subscribe('depts.list', function() {
//    console.log('data is ready')
//});
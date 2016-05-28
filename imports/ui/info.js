import { Meteor } from 'meteor/meteor';
import './info.html';

Template.info.onRendered(function(){
    console.log(this.data)
})
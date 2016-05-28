import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar} from 'meteor/reactive-var';
import { Depts } from '../api/departements.js';
import './linechart.html';

Session.setDefault('nom', "NORD");
Session.setDefault('gtYear', "2008");
Session.setDefault('ltYear', "2015");
Session.setDefault('fields' , { fields: {"population": 1,"nom": 1,"année": 1} });

Template.Line.onCreated(function () {
    this.database = new ReactiveVar();
    this.subscribe('depts.list');
});
Template.Line.helpers({
     myCollection() {
        var dataset = Depts.find({
            "nom": "NORD"
        }, Session.get('fields')).fetch();
        Template.instance().database.set(dataset)
    },
    depts(){
        return Session.get('nom')
    },
    departements(){
        var depts = Depts.find({"année": 2014},{ fields: {"nom":1}, sort: {'nom': 1} }).fetch();
        return depts;
    },
    years() {
        var annee = [{"année": 2008}, {"année":2009}, {"année":2010}, {"année":2011}, {"année":2012}, {"année":2013}, {"année":2014}]
        return annee
    }
})
Template.Line.onRendered(function () {
    var self = this
    var w = 950;
    var h = 750;
    var Margins = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 80
    }
    var drawLinebar = function () {
        var dataset = self.database.get();

        var pop = function (d) {
            return d.population;
        }
        var years = function (d) {
            return d["année"];
        }
        var xRange = d3.scale.linear().range([Margins.left, w - Margins.right], 0);
        var yRange = d3.scale.linear().range([h - Margins.top, Margins.bottom]);
        var svg = d3.select("#lineChart").attr("width", w).attr("height", h);

        xDomain = xRange.domain([d3.min(dataset, years), d3.max(dataset, years)]);
        yDomain = yRange.domain([d3.min(dataset, pop), d3.max(dataset, pop)]);
        var svg = d3.select("#lineChart").attr("width", w).attr("height", h);

        xAxis = d3.svg.axis()
            .scale(xDomain)
            .tickSize(1)
            .tickSubdivide(true),
        yAxis = d3.svg.axis()
            .scale(yDomain)
            .tickSize(1)
            .orient('left')
            .tickSubdivide(true);

        svg.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (h - Margins.bottom) + ')')
            .call(xAxis);

        svg.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (Margins.left) + ',0)')
            .call(yAxis);
        var lineFunc = d3.svg.line()
            .x(function (d) {
                return xDomain(d["année"]);
            })
            .y(function (d) {
                return yRange(d.population);
            })
            .interpolate('linear');
        svg.append('svg:path')
            .attr('d', lineFunc(dataset))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

    };
    Tracker.autorun(drawLinebar);
});

Template.Line.events({   
    "change #selectDept"(e){
        event.preventDefault();        
        var target = event.target,
        dataset = [],
        selector = {};
        
        Session.set('nom', target.value)
        selector['nom'] = target.value;
        $('.tick').remove();
        $('path').remove();
        
        dataset = Depts.find(selector, Session.get('fields')).fetch();
        Template.instance().database.set(dataset);
        
    }
});
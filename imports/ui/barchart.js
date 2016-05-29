import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar} from 'meteor/reactive-var';
import { Depts } from '../api/departements.js';
import './barchart.html';

Session.setDefault('year', 2014);
Session.setDefault('sort', { nom: 1 });

Template.Chart.onCreated(function () {
    this.db = new ReactiveVar();
    this.subscribe('depts.list');
});
Template.Chart.helpers({
     myCollection() {
        var dataset = Depts.find({
            "année": Session.get('year')}
        , { fields: {"population": 1,"nom": 1,"année": 1, "code": 1}, sort: Session.get('sort') }).fetch();
        dataset.forEach(function (obj, i) {
            obj.rows = i;
        });
        Template.instance().db.set(dataset)
    },
    annee(){
        return Session.get('year')
    },
    years() {
        var annee = _.uniq(Depts.find({},{ sort: {"annee": 1} }).fetch(),function(dept){
            return dept['année'];
        }).sort();
//            [{"année": 2008}, {"année":2009}, {"année":2010}, {"année":2011}, {"année":2012}, {"année":2013}, {"année":2014}]
//        annne = annee.sort(function(a, b){
//            if(a['année'] > b['année']){
//                return a
//            }
//        });
        return annee;
    },
    departements(){
        var depts = Depts.find({"année": 2014},{ fields: {"nom":1} }).fetch();
        return depts
    }
})
Template.Chart.onRendered(function () {
    var self = this
    var w = 1200;
    var h = 1000;
    var Margins = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 80
    }

    var drawBarChart = function () {
        //get dataset
        var dataset = self.db.get();

        // get all populations and all rows of dataset
        var pop = function (d) {
            return d.population;
        }
        var rows = function (d) {
            return d.rows
        }

        var xRange = d3.scale.ordinal().rangeRoundBands([Margins.left, w - Margins.right], 0);
        var yRange = d3.scale.linear().range([h - Margins.top, Margins.bottom]);
        var svg = d3.select("#barChart").attr("width", w).attr("height", h);



        xDomain = xRange.domain(d3.range(dataset.length));
        yDomain = yRange.domain([0, d3.max(dataset, pop)]);

        //setup axis
        xAxis = d3.svg.axis().scale(xDomain).tickSize(0).tickSubdivide(true);
        yAxis = d3.svg.axis().scale(yDomain).orient("left").tickSize(0).tickSubdivide(true);

        svg.append('svg:g').attr('class', 'x axis').attr('transform', 'translate(0,' + (h - Margins.bottom) + ')').call(xAxis);
        svg.append('svg:g').attr('class', 'y axis').attr('transform', 'translate(' + Margins.left + ', 0)').call(yAxis);

        var bars = svg.selectAll('rect').data(dataset);
        if (bars.length != 0) {
            bars.enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", function (d) {
                    return ((h - Margins.bottom) - yDomain(d.population));
                })
                .attr("fill", 'blue')
                .attr("data-pop", function (d) {
                    return d.population;
                })
                .attr('data-nom', function (d) {
                    return d.nom
                })
                .attr('data-code', function (d){
                    return d.code
                });

            bars.transition()
                .duration(500)
                .attr("x", function (d) {
                    return xDomain(d.rows)
                })
                .attr("y", function (d) {
                    return yDomain(d.population);
                })
                .attr("width", 10)
                .attr("height", function (d) {
                    return ((h - Margins.bottom) - yDomain(d.population));
                })
                .attr("fill", 'blue')
            bars.exit()
                .transition()
                .duration(500)
                .attr("x", -200)
                .remove();
        }
    }
    
    Tracker.autorun(drawBarChart);
    
});

Template.Chart.events({
    "change #year" (event, t) {
        var target = event.target,
//        selector = {},
        dataset = [];
        
        event.preventDefault();
        
//        selector['année'] = parseInt(target.value);
        Session.set('year', parseInt(target.value))
        dataset = Depts.find({
            "année": Session.get('year')}
        , { fields: {"population": 1,"nom": 1,"année": 1, "code": 1}, sort: Session.get('sort') }).fetch();        
        dataset.forEach(function (obj, i) {
            obj.rows = i;
        });
        $('.tick').remove();
        $('rect').remove();
        $('#initYear').remove();
        
        Template.instance().db.set(dataset);
        
    },
    "change .option"(e){
        var value = parseInt(e.target.value);
        switch(value){
           case 0:
                Session.set('sort', {population: 1});
                $('.tick').remove();
                $('rect').remove();
                break;
            case 1:
                Session.set('sort', {population: -1});
                $('.tick').remove();
                $('rect').remove();
                break;
            case 2:
                Session.set('sort', {nom: 1});
                $('.tick').remove();
                $('rect').remove();
                break;
            case 3:
                Session.set('sort', {nom: -1})
                $('.tick').remove();
                $('rect').remove();
            default:
                break;
        }
        
    },
    "mouseenter rect" (event, t) {
        var target = event.target,
        info = {},
        divInfo = $('.info'),
        divName = $('#name'),
        divPop = $('#pop'),
        divCode = $('#code');
        
        divName.text("Nom du département : "+$(target).data('nom'));
        divCode.text("Code postal : "+$(target).data('code'));
        divPop.text("Population : "+$(target).data('pop'));
        divInfo.removeClass('hidden');
        divInfo.css('top', event.pageY+10+'px');
        divInfo.css('left', event.pageX+20+'px');        
        $(target).attr("fill", "red");

    },
    "mousemove rect"(event){
        var divInfo = $('.info');
        divInfo.css('top', event.pageY+10+'px');
        divInfo.css('left', event.pageX+20+'px');
    },
    "mouseleave rect" (event, t) {
        var target = event.target,
        divInfo = $('.info');
        $(target).attr("fill", "blue");
        divInfo.addClass('hidden');
    }
});
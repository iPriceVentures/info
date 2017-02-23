/**
 * Created by mac on 23/02/2017.
 */
'use strict';

var CHART = window.CHART || {};

CHART.main = {
    initChart: function () {
        var chart = $('#chart');
        var company = chart.find('.company');
        var performance = chart.find('.performance');

        //draw company chart

        TweenMax.staggerTo(".percent", 0.6, {width: '80%'}, 0.1);
    },
    sortByType: function (type) {
        if(type != '' || type != null){

        }
    },
    animation: function () {
        TweenMax.staggerTo(".percent", 0.6, {width: '80%'}, 0.1);
    },
    getData: function () {
        var data = $.getJSON( "data/data.json", function() {
            //console.log( "success" );
        })
        .done(function() {
            //console.log( "second success" );
            //console.log(data.responseJSON);
        })
        .fail(function() {
            //console.log( "cannot get the data" );
        });
        // Perform other work here ...

        // Set another completion function for the request above
        data.complete(function() {
            CHART.main.renderChart(data);
        });
    },
    renderChart: function (data) {
        if(data.responseJSON !== null || data.responseJSON!=='') {

            var object = data.responseJSON;

            for(var i=0; i< object.length; i ++) {
                //console.log(object[i]);

                var html = '';

                html += '<div class="row mar-bottom">';
                html += '<div class="col-xs-1">';
                html += '<div class="logo">';
                html += '<img class="hide-for-small" src="http://placehold.it/100x50" alt="">';
                html += '<img class="show-for-small" src="http://placehold.it/50x50" alt="">';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-4">';
                html += '<div class="row company">';
                html += '<div class="col-xs-6 employees">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">50</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-6 fundings">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">$160000</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-7 no-pad-left">';
                html += '<div class="row performance">';
                html += '<div class="col-xs-4 traffics">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">50</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 app">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">50</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 twitter">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">50</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 instagram">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">50</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 facebook">';
                html += '<div class="bg-col">';
                html += '<div class="percent"></div>';
                html += '<span class="num">50</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                //console.log(html);

                //$('#chart').append(html);
                //CHART.main.animation();
            }

        }
    }
}

$(window).load(function () {
     CHART.main.initChart();
    //
    // CHART.main.getData();
});
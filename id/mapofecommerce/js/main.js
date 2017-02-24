/**
 * Created by mac on 23/02/2017.
 */
'use strict';

var CHART = window.CHART || {};
var Ranges = {
    "min_traffics" : 0,
    "max_traffics" : 49000000,

    "min_app" : 0,
    "max_app" : 100000000,

    "min_twitter" : 0,
    "max_twitter" : 415000,

    "min_instargram" : 0,
    "max_instargram" : 519000,

    "min_facebook" : 0,
    "max_facebook" : 16500000,

    "min_employees" : 0,
    "max_employees" : 5500
};

CHART.main = {
    initChart: function () {
        var chart = $('#chart');
        var company = chart.find('.company');
        var performance = chart.find('.performance');

        //draw company chart

        //TweenMax.staggerTo(".percent", 0.6, {width: '80%'}, 0.1);
    },
    sortByType: function (type) {
        if(type != '' || type != null){

        }
    },
    animation: function () {

        var obj = $('#chart .percent');
        obj.each(function () {

            var per = $(this).attr('data-per');
            console.log( per);
            TweenMax.to($(this), 1, { width: per }, 1);
        });

    },
    getData: function () {
        var data = $.getJSON( "data/data.json", function() {
            console.log( "success" );
        })
        .complete(function() {
            CHART.main.renderChart(data);
        });
    },
    convertPercent: function (type, number) {
        var per = 0;

        if(type === 'traffics') {
            var rs =  parseFloat( (number / Ranges.max_traffics) * 100 );
            per = Math.round(rs * 1000) /1000;
        } else if (type === 'app') {
            var rs =  parseFloat( (number / Ranges.max_app) * 100 );
            per = Math.round(rs * 1000) /1000;
        } else if (type === 'twitter') {
            var rs =  parseFloat( (number / Ranges.max_twitter) * 100 );
            per = Math.round(rs * 1000) /1000;
        } else if (type === 'instargram') {
            var rs =  parseFloat( (number / Ranges.max_instargram) * 100 );
            per = Math.round(rs * 1000) /1000;
        } else if (type === 'facebook') {
            var rs =  parseFloat( (number / Ranges.max_facebook) * 100 );
            per = Math.round(rs * 1000) /1000;
        } else if (type === 'employee') {
            var rs =  parseFloat( (number / Ranges.max_employees) * 100 );
            per = Math.round(rs * 1000) /1000;
        }

        return per;
    },
    renderChart: function (data) {
        if(data.responseJSON !== null || data.responseJSON!=='') {

            var object = data.responseJSON;
            console.log(object);

            for(var i=0; i< object.length; i ++) {

                var employees_per = CHART.main.convertPercent('employee', object[i].employees) + '%';
                var traffic_per = CHART.main.convertPercent('traffics', object[i].traffic) + '%';
                var app_per = CHART.main.convertPercent('app', object[i].app) + '%';
                var twitter_per = CHART.main.convertPercent('twitter', object[i].twitter) + '%';
                var instargram_per = CHART.main.convertPercent('instargram', object[i].instargram) + '%';
                var facebook_per = CHART.main.convertPercent('facebook', object[i].facebook) + '%';
                var desktop_url = 'imgs/' + object[i].logodesktop;
                var mobile_url = 'imgs/' + object[i].logomobile;
                var url = object[i].url;

                var f_type = object[i].type;
                var f_category = object[i].category;
                var f_location = object[i].location;

                var html = '';

                html += '<div class="row mar-bottom" data-type="' + f_type + '" data-category="' + f_category + '" data-location = "' + f_location + '">';
                html += '<div class="col-xs-1">';
                html += '<div class="logo">';
                html += '<a href="' + url + '" target="_blank">';
                html += '<img class="hidden-xs" src="' + desktop_url + '" alt="">';
                html += '<img class="visible-xs" src="' + mobile_url + '" alt="">';
                html += '</a>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-4">';
                html += '<div class="row company">';
                html += '<div class="col-xs-6 employees">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per="' + employees_per +'"></div>';
                html += '<span class="num">' + object[i].employees + '</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-6 fundings">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per = "50"></div>';
                html += '<span class="num">$160000</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-7 no-pad-left">';
                html += '<div class="row performance">';
                html += '<div class="col-xs-4 traffics">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per="' + traffic_per +'"></div>';
                html += '<span class="num">' + object[i].traffic + '</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 app">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per="' + app_per + '"></div>';
                html += '<span class="num"> ' + object[i].app + '</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 twitter">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per="' + twitter_per + '"></div>';
                html += '<span class="num">' + object[i].twitter +'</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 instagram">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per="' + instargram_per + '"></div>';
                html += '<span class="num">' + object[i].instargram +'</span>';
                html += '</div>';
                html += '</div>';

                html += '<div class="col-xs-2 facebook">';
                html += '<div class="bg-col">';
                html += '<div class="percent" data-per="' + facebook_per + '"></div>';
                html += '<span class="num">' + object[i].facebook +'</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                $('#chart').append(html);
                CHART.main.animation();
            }

        }
    }
}

$(window).load(function () {

     CHART.main.getData();
});
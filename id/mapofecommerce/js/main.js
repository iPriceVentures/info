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
                var link = object[i].url;
                var vendor_name = object[i].name;

                var f_type = object[i].type;
                var f_category = object[i].category;
                var f_location = object[i].location;

                var html = '';

                    html += '<div class="row mar-bottom" data-type="'+ f_type +'" data-category="' + f_category + '" data-location="' + f_location + '">';
                    html += '<div class="col-xs-2 col-sm-2 logo-wrap">';
                    html += '<div class="logo">';
                    html += '<a href="'+ link +'" target="_blank">';
                    html += '<img class="small" src="' + mobile_url + '" alt="'+ vendor_name +'" title="'+ vendor_name +'">';
                    html += '<img class="large" src="' + desktop_url + '" alt="'+ vendor_name +'" title="'+ vendor_name +'">';
                    html += '<span class="vendor-name">' + vendor_name + '</span>';
                    html += '</a>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-7 col-sm-8 no-padding">';
                    html += '<div class="row performance">';
                    html += '<div class="col-xs-4 traffics">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ traffic_per +'"></div>';
                    html += '<span class="num">50</span>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 app">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ app_per +'"></div>';
                    html += '<span class="num">50</span>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 twitter">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ twitter_per +'"></div>';
                    html += '<span class="num">50</span>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 instagram">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ instargram_per +'"></div>';
                    html += '<span class="num">50</span>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 facebook">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ facebook_per +'"></div>';
                    html += '<span class="num">50</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-3 col-sm-2">';
                    html += '<div class="row company">';
                    html += '<div class="col-xs-12 employees">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ employees_per +'"></div>';
                    html += '<span class="num">50</span>';
                    html += '</div>';
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
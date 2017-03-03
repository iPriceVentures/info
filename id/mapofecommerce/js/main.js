
'use strict';

var CHART = window.CHART || {};
var Ranges;
var originList;
var currentList;

Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
    CHART.main = {
    initChart: function () {
        CHART.main.getData();
        CHART.main.filter();
        CHART.main.sortEvent();
        CHART.main.initLangChange();

        setTimeout(function () {
            $('#sub-header .performance .traffics').trigger('click');
        },300);

    },
    initLangChange: function () {

        $('#lang-selection a').on('click', function () {
           $(this).siblings('a').removeClass('active');
           $(this).addClass('active');

           var lang = $(this).attr('data-lang');

           $('.lang').hide();
           $('.'+lang).show();

        });
    },
    sortEvent: function () {

        $('.sortable').off('click').on('click', '.text', function () {
            var _this = $(this);

            if(!_this.hasClass('descending') && !_this.hasClass('ascending')) {
                _this.addClass('ascending');
                _this.siblings().removeClass('descending').removeClass('ascending');

                if(!_this.hasClass('employees')) {
                    $('.sortable .employees').removeClass('descending').removeClass('ascending');
                } else {
                    $('.sortable .performance .text').removeClass('descending').removeClass('ascending');
                }

                CHART.main.sortBy(currentList, -1, _this.attr('data-sort'));

            } else if (_this.hasClass('ascending')) {
                _this.removeClass('ascending');
                _this.addClass('descending');
                _this.siblings().removeClass('descending').removeClass('ascending');
                if(!_this.hasClass('employees')) {
                    $('.sortable .employees').removeClass('descending').removeClass('ascending');
                } else {
                    $('.sortable .performance .text').removeClass('descending').removeClass('ascending');
                }
                CHART.main.sortBy(currentList, 1, _this.attr('data-sort'));

            } else if (_this.hasClass('descending')) {
                _this.removeClass('descending');
                _this.addClass('ascending');
                _this.siblings().removeClass('descending').removeClass('ascending');
                if(!_this.hasClass('employees')) {
                    $('.sortable .employees').removeClass('descending').removeClass('ascending');
                } else {
                    $('.sortable .performance .text').removeClass('descending').removeClass('ascending');
                }
                CHART.main.sortBy(currentList, -1, _this.attr('data-sort'));
            }
        });
    },
    sortBy: function (arr, order, property) {
        var arrSort = arr.slice(0);
        arrSort.sort(function(a,b) {
            if(order  === 1) {//ascending
                return a[property] - b[property];
            } else if (order === -1) { // descending
                return b[property] - a[property];
            }
        });

        CHART.main.renderChart(arrSort);
    },
    filter: function () {

        $(document).on('change', '.selects-opts select',function(){
            var type = $('#filter-type option:selected').val();
            var category = $('#filter-category option:selected').val();
            var location = $('#filter-location option:selected').val();
            $('.sortable .text').removeClass('descending').removeClass('ascending');

            var arrFilter = [];
            if(type !== '-1') {
                arrFilter.push(type);
            }
            if(category !== '-1') {
                arrFilter.push(category);
            }
            if(location !== '-1') {
                arrFilter.push(location);
            }

            CHART.main.makeFilter(arrFilter);
        });
    },
    makeFilter: function (arr) {
        CHART.main.renderChart(originList);
        var keysArr = [];

        if(arr !== null && arr.length > 0) {

            $('#chart .canFilter').css('display', 'none');

            $('#chart .canFilter').each(function () {
                var _this = $(this);

                if(arr.length === 1) {
                    if(_this.hasClass(arr[0])) {
                        _this.css('display','block');
                        keysArr.push(parseInt( _this.attr('data-key')));
                    }
                } else if (arr.length === 2) {
                    if(_this.hasClass(arr[0]) && _this.hasClass(arr[1])) {
                        _this.css('display','block');
                        keysArr.push(parseInt( _this.attr('data-key')));
                    }
                } else if (arr.length === 3) {
                    if(_this.hasClass(arr[0]) && _this.hasClass(arr[1]) && _this.hasClass(arr[2])) {
                        _this.css('display','block');
                        keysArr.push(parseInt( _this.attr('data-key')));
                    }
                }
            });

            CHART.main.updateSortList(keysArr);

        } else {
            CHART.main.updateSortList();
            $('#chart .canFilter').css('display', 'block');
        }
    },
    updateSortList: function (keysArr) {

        if(keysArr != undefined && keysArr != null) {

            var newList = [];

            for(var i =0; i< originList.length; i ++) {
                if(keysArr.indexOf(originList[i].key) !== -1) {
                    var obj = originList[i];
                    newList.push(obj);
                }
            }

            currentList = newList;

        } else {
            currentList = originList;
        }

    },
    animation: function () {

        var obj = $('#chart .percent');
        obj.each(function () {
            var per = $(this).attr('data-per');
            TweenMax.to($(this), 1, { width: per }, 1);
        });

    },
    getData: function () {
        var obj = $.getJSON( "data/data.json", function() {
        })
        .complete(function() {
            originList = obj.responseJSON.data;
            currentList = obj.responseJSON.data;
            Ranges = obj.responseJSON.ranges;

            CHART.main.renderChart(obj.responseJSON.data);
        });
    },
    convertPercent: function (type, number) {
        var per = 0;

        if(type === 'traffics') {
            per = Math.round(parseFloat( (number / Ranges.max_traffics) * 100 ));
        } else if (type === 'app') {
            per = Math.round(parseFloat( (number / Ranges.max_app) * 100 ));
        } else if (type === 'twitter') {
            per = Math.round(parseFloat( (number / Ranges.max_twitter) * 100 ));
        } else if (type === 'instagram') {
            per = Math.round(parseFloat( (number / Ranges.max_instagram) * 100 ));
        } else if (type === 'facebook') {
            per = Math.round(parseFloat( (number / Ranges.max_facebook) * 100 ));
        } else if (type === 'employee') {
            per = Math.round(parseFloat( (number / Ranges.max_employees) * 100 ));
        }

        return per;
    },
    renderChart: function (data) {

        if(data !== null && data.length > 0) {

            $('.preloader').show();

            $('#chart').html('');

            for(var i=0; i< data.length; i ++) {

                var employees_per = CHART.main.convertPercent('employee', data[i].employees) + '%';
                var traffic_per = CHART.main.convertPercent('traffics', data[i].traffics) + '%';
                var app_per = CHART.main.convertPercent('app', data[i].app) + '%';
                var twitter_per = CHART.main.convertPercent('twitter', data[i].twitter) + '%';
                var instagram_per = CHART.main.convertPercent('instagram', data[i].instagram) + '%';
                var facebook_per = CHART.main.convertPercent('facebook', data[i].facebook) + '%';

                var desktop_url = 'imgs/' + data[i].logodesktop;
                var mobile_url = 'imgs/' + data[i].logomobile;

                var link = data[i].url;

                var vendor_name = data[i].name;

                var f_type = data[i].type;
                var f_category = data[i].category;
                var f_location = data[i].location;

                var employees = data[i].employees;
                if(employees === 0) {
                    employees = '-' + '';
                } else {
                    employees = employees.format();
                }

                var html = '';

                    html += '<div data-key ="'+ data[i].key +'" class="row mar-bottom canFilter '   + f_type +' '+ f_category +' '+ f_location +'" data-type="'+ f_type +'" data-category="' + f_category + '" data-location="' + f_location + '">';
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
                    html += '<div class="num">';
                    html += '<span>'+ data[i].traffics.format()+'</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 app">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ app_per +'"></div>';
                    html += '<div class="num">';
                    html += '<span>'+data[i].app.format()+'</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 twitter">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ twitter_per +'"></div>';
                    html += '<div class="num">';
                    html += '<span>'+data[i].twitter.format()+'</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 instagram">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ instagram_per +'"></div>';
                    html += '<div class="num">';
                    html += '<span>'+data[i].instagram.format() +'</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-2 facebook">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ facebook_per +'"></div>';
                    html += '<div class="num">';
                    html += '<span>'+data[i].facebook.format() +'</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="col-xs-3 col-sm-2">';
                    html += '<div class="row company">';
                    html += '<div class="col-xs-12 employees">';
                    html += '<div class="bg-col">';
                    html += '<div class="percent" data-per="'+ employees_per +'"></div>';
                    html += '<div class="num">';
                    html += '<span>'+ employees +'</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '</div>';
                    html += '</div>';

                $('#chart').css('padding-bottom', '0').append(html);
                CHART.main.animation();
                $('.preloader').hide();
            }

        }
    }
}

$(window).load(function () {
    CHART.main.initChart();
});

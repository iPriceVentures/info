
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

function checkZero(num) {
    if(num === 0)
        return '-';
    return num.format();
}
CHART.main = {
  initChart: function () {
    CHART.main.checkEmbedPage();
    CHART.main.getData();
    CHART.main.filter();
    CHART.main.sortEvent();

    setTimeout(function () {
        $('#sub-header .performance .traffics').trigger('click');
    },100);

},
checkEmbedPage: function () {
    var link = window.location.href;
    if(link.indexOf('?embedUrl') > 0) {
        $('#header, #embed-section').hide();
        $('footer').hide();
        $('.addthis-smartlayers').hide();
    }
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

    CHART.main.generateVList(arrSort);
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
    CHART.main.generateVList(originList);
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
    CHART.main.generateVList(currentList);

},
animation: function () {

    var obj = $('#chart .percent');
    obj.each(function () {
        var per = $(this).attr('data-per');
        TweenMax.to($(this), 0.8, { width: per }, 1);
    });

},
getData: function () {
    var link = window.location.href;

    var dataPath = 'data/data.json';

    if(link.indexOf('/en') > 0) {
        dataPath = '../data/data.json';
    }

    var obj = $.getJSON( dataPath, function() {
    })
    .complete(function() {
        originList = obj.responseJSON.data;
        currentList = obj.responseJSON.data;
        Ranges = obj.responseJSON.ranges;

        CHART.main.generateVList(obj.responseJSON.data);
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
generateVList: function (data) {
    $('.preloader').show();

    var bigAssList = [];

    var link = window.location.href;
    var urlImgs = 'imgs/';

    if(link.indexOf('/en') > 0) {
        urlImgs = '../imgs/';
    }

    for (var i = 0; i < data.length; i++) {

      var employees_per = CHART.main.convertPercent('employee', data[i].employees) + '%';
      var traffic_per = CHART.main.convertPercent('traffics', data[i].traffics) + '%';
      var app_per = CHART.main.convertPercent('app', data[i].app) + '%';
      var twitter_per = CHART.main.convertPercent('twitter', data[i].twitter) + '%';
      var instagram_per = CHART.main.convertPercent('instagram', data[i].instagram) + '%';
      var facebook_per = CHART.main.convertPercent('facebook', data[i].facebook) + '%';

      var desktop_url = urlImgs + data[i].logodesktop;
      var mobile_url = urlImgs + data[i].logomobile;

      var link = data[i].url;

      var vendor_name = data[i].name;

      var f_type = data[i].type;
      var f_category = data[i].category;
      var f_location = data[i].location;
      
      var el = document.createElement('div');
      el.style.width = '100%';
      el.style.marginBottom = '15px';
      el.classList.add('item');
      
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
      html += '<span>'+ checkZero(data[i].app) +'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 twitter">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ twitter_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkZero(data[i].twitter)+'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 instagram">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ instagram_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkZero(data[i].instagram) +'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 facebook">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ facebook_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkZero(data[i].facebook) +'</span>';
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
      html += '<span>'+ checkZero(data[i].employees) +'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '</div>';
      html += '</div>';
      el.innerHTML = html;
      bigAssList.push(el);
  }

  var _width = $(window).width();
  var itemH = 35, _h = 50; 

  if(_width > 768) {
    itemH = 50;
    _h = 65;
  }

  var list = new VirtualList({
      w: $('#chart').width(),
      h: _h * data.length,
      items: bigAssList,
      itemHeight: itemH,
      cache: true
  });
  $('#chart').html('');
  $('#chart').append(list.container);
  $('.preloader').hide();
  CHART.main.animation();  
}
}

$(window).load(function () {
    CHART.main.initChart();
});

$(window).resize(function(){
    CHART.main.generateVList(currentList);       
});

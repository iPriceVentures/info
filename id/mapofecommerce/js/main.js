
'use strict';

var CHART = window.CHART || {};
var Ranges;
var originList;
var currentList;
var Translation;

var Ranges = {
  "min_traffics" : 0,
  "max_traffics" : 0,
  "min_app" : 0,
  "max_app" : 0,
  "min_twitter" : 0,
  "max_twitter" : 0,
  "min_instagram" : 0,
  "max_instagram" : 0,
  "min_facebook" : 0,
  "max_facebook" : 0,
  "min_employees" : 0,
  "max_employees" : 0
  };

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
  num = this.toFixed(Math.max(0, ~~n));
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function checkK(num) {
  if(num > 0 && num < 1000)
    return '<1';
  else if (num === 0) 
    return 'n/a';
  else
    return Math.round(num / 1000).format();
}

CHART.main = {
  initChart: function () {
    CHART.main.checkEmbedPage();
    CHART.main.getTranslation();
    CHART.main.getData();
    CHART.main.filter();
    CHART.main.sortEvent();
    CHART.main.stickySubHeader();
    CHART.main.stickyHeader();

    setTimeout(function () {
      $('#sub-header .performance .traffics').trigger('click');
    },100);
  },
  stickyHeader: function () {
  //header sticky
  $(document).on('scroll', function (){
    var fromTop = $(window).scrollTop();

    if ($(window).width() > 768) {
      if(fromTop > $('#header-sticky').offset().top) {
        $('#header').css({
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 999
        });
      } else {
        $('#header').css({
          position: 'static',
          top: 0
        });
      }
    }

  });
},
stickySubHeader: function () {
    //sub header sticky
    $(document).on('scroll', function (){
      var subheader_offset = $('#sticky-point').offset().top;
      var fromTop = $(window).scrollTop();
      var endChart_offset = $('#bottom-info').offset().top;

      if(fromTop > subheader_offset) {
        var m_lefft = 0;
        var _top = 0;
        if ($(window).width() > 768) {
          _top = 46;
        }
        if ($(window).width() > 1200) {
          m_lefft = ($(window).width() - 1200) / 2;
        } 

        $('#sub-header').css({
          position: 'fixed',
          top: _top,
          left: '0',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          zIndex: 999,
          padding: '15px',
          opacity: 1,
          marginLeft: m_lefft
        });

        if (fromTop > subheader_offset && fromTop > endChart_offset) {
          $('#sub-header').css({
            opacity: 0
          });
        }
      } 
      else {
        $('#sub-header').css({
          position: 'static',
          padding: '8px 0',
          margin: '0 auto',
          opacity: 1
        });
      }
    });
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
      } else {
        _this.toggleClass('ascending descending')
      }

      CHART.main.sortBy(currentList, _this.hasClass('ascending') ? -1 : 1, _this.attr('data-sort'));
      _this.siblings().removeClass('descending ascending');

      if(!_this.hasClass('employees')) {
        $('.sortable .employees').removeClass('descending ascending');
      } else {
        $('.sortable .performance .text').removeClass('descending ascending');
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
      originList = obj.responseJSON;
      currentList = obj.responseJSON;
      
      CHART.main.getBiggestValues(obj.responseJSON);
    });
  },
  getTranslation: function () {
    var link = window.location.href;
    var lang = true;

    var dataPath = 'data/translation.json';

    if(link.indexOf('/en') > 0) {
      lang = false;
      dataPath = '../data/translation.json';
    }

    var obj = $.getJSON( dataPath, function() {
    })
    .complete(function() {
      if(obj.responseJSON.length == 1) {
        $('#lang-selection').hide();
      }

      if(lang) {
        Translation = obj.responseJSON[0];//local language
      } else {
        Translation = obj.responseJSON[1];//english
      }
      CHART.main.parseTranslation();
    });
  },
  parseTranslation: function () {
    if(Translation != null) {
      //header-content
      var headerContent = $('#header-content');      
      var subHeader = $('#sub-header');//sub-header
      var bottomInfo = $('#bottom-info');//bottom texts

      //1.titie
      headerContent.find('.e-text').html(Translation.title);
      //2.sub title
      headerContent.find('.lang').html(Translation.subStitle);
      //4.validity
      headerContent.find('.validity').html(Translation.validity);
      //filterResultsBy
      headerContent.find('.title').html(Translation.filterResultsBy);
      //3.viewIn
      $('#lang-selection > a').html(Translation.viewIn);
      //5.verifiedText
      subHeader.find('.verified').html(Translation.verifiedText);
      //6.awardText
      subHeader.find('.iema').find('a').html(Translation.awardText);
      //7.numbersIn1000Text
      subHeader.find('.currency').html(Translation.numbersIn1000Text);
      //8.methodology
      bottomInfo.find('.methodology > strong').html(Translation.methodology);
      //9.monthlyVisits
      subHeader.find('.traffics > p').html(Translation.monthlyVisits);
      bottomInfo.find('.monthlyVisits > strong').html(Translation.monthlyVisits.replace('*', ''));
      //10.monthlyVisitsContent 
      bottomInfo.find('.monthlyVisits > p').html(Translation.monthlyVisitsContent);
      //11.filterResultsBy
      headerContent.find('.filter').find('.title').html(Translation.filterResultsBy);

      //12.typeFilter
      headerContent.find('#filter-type').find('option').eq(0).html(Translation.typeFilter);
      //13.categoryFilter
      headerContent.find('#filter-category').find('option').eq(0).html(Translation.categoryFilter);
      //15.fashionFilter
      headerContent.find('#filter-category').find('option').eq(1).html(Translation.fashionFilter);
      //16.generalFilter
      headerContent.find('#filter-category').find('option').eq(2).html(Translation.generalFilter);
      //17.techAndGadgetFilter
      headerContent.find('#filter-category').find('option').eq(3).html(Translation.techAndGadgetFilter);
      //14.originFilter
      headerContent.find('#filter-location').find('option').eq(1).html(Translation.countryName);
      //18.internationalFilter
      headerContent.find('#filter-location').find('option').eq(2).html(Translation.internationalFilter);

      //19.appInstalls
      subHeader.find('.app > p').html(Translation.appInstalls);
      bottomInfo.find('.appInstalls > strong').html(Translation.appInstalls.replace('*', ''));
      //20.appInstallSources
      bottomInfo.find('.appInstalls > p').html(Translation.appInstallSources);
      //21.socialFollowers
      bottomInfo.find('.socialFollowers > strong').html(Translation.socialFollowers);
      //22.source
      bottomInfo.find('.socialFollowers > p').html(Translation.socialSource);
      //23.numberOfEmployees
      bottomInfo.find('.noEmployees > strong').html(Translation.numberOfEmployees);
      //employees title
      subHeader.find('.employees > p').html(Translation.numberOfEmployees);
      //24.contentEmployees
      bottomInfo.find('.noEmployees > p').html(Translation.contentEmployees);
      //25.merchantList
      bottomInfo.find('.merchantList > strong').html(Translation.merchantList);
      //26.contentMerchants
      bottomInfo.find('.merchantList > p').html(Translation.contentMerchants);
      //27.moreDetailData
      bottomInfo.find('.moreDetailData > strong > span').html(Translation.moreDetailData);
      //28.moreDataLink
      bottomInfo.find('.moreDetailData').find('a').attr('href', Translation.moreDataLink);
      //29.seeUpdateData
      bottomInfo.find('.seeUpdateData > span').html(Translation.seeUpdateData);
      //30.updateDataLink
      bottomInfo.find('.seeUpdateData').find('a').attr('href', Translation.updateDataLink);
      //31.IEMAAwards
      bottomInfo.find('.iema-info > span').html(Translation.IEMAAwards);
      //32.embedPageTitle
      $('#embed-section > h3').html(Translation.embedPageTitle);
    }
  },
  getBiggestValues: function (data) {
    var max_traffics = 0, max_app = 0, max_twitter = 0, max_instagram = 0, max_facebook = 0, max_employees = 0;
    for (var i =0; i < data.length; i ++) {
      if( parseFloat(data[i].traffics) > max_traffics) {
        max_traffics = parseFloat(data[i].traffics);
      }
      if( parseFloat(data[i].app) > max_app) {
        max_app = parseFloat(data[i].app);
      }
      if( parseFloat(data[i].twitter) > max_twitter) {
        max_twitter = parseFloat(data[i].twitter);
      }
      if( parseFloat(data[i].instagram) > max_instagram) {
        max_instagram = parseFloat(data[i].instagram);
      }
      if( parseFloat(data[i].facebook) > max_facebook) {
        max_facebook = parseFloat(data[i].facebook);
      }
      if( parseFloat(data[i].employees) > max_employees) {
        max_employees = parseFloat(data[i].employees);
      }
    }

    Ranges.max_traffics = max_traffics;
    Ranges.max_app = max_app;
    Ranges.max_twitter = max_twitter;
    Ranges.max_instagram = max_instagram;
    Ranges.max_facebook = max_facebook;
    Ranges.max_employees = max_employees;
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

      if(data[i].verified === true && data[i].iema_winner === true) {
        html += '<div class="logo icon">';
      } else {
        html += '<div class="logo">';
      }

      html += '<a href="'+ link +'" target="_blank">';
      html += '<img class="small" src="' + mobile_url + '" alt="'+ vendor_name +'" title="'+ vendor_name +'">';
      html += '<img class="large" src="' + desktop_url + '" alt="'+ vendor_name +'" title="'+ vendor_name +'">';
      html += '<span class="vendor-name">' + vendor_name + '</span>';
      html += '</a>';

      if(data[i].verified && data[i].verified === true) {
        html += '<span class="icon-verified"></span>';
      }

      if(data[i].iema_winner && data[i].iema_winner === true) {
        html += '<span class="icon-iema"></span>';
      }

      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-7 col-sm-8 no-padding">';
      html += '<div class="row performance">';
      html += '<div class="col-xs-4 traffics">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ traffic_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkK(data[i].traffics)+'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 app">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ app_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkK(data[i].app) +'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 twitter">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ twitter_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkK(data[i].twitter)+'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 instagram">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ instagram_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkK(data[i].instagram) +'</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      html += '<div class="col-xs-2 facebook">';
      html += '<div class="bg-col">';
      html += '<div class="percent" data-per="'+ facebook_per +'"></div>';
      html += '<div class="num">';
      html += '<span>'+ checkK(data[i].facebook) +'</span>';
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
      html += '<span>'+ data[i].employees.format() +'</span>';
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
  $('.sortable .text').each(function(){
    if($(this).hasClass('descending') || $(this).hasClass('ascending')) {
      CHART.main.sortBy(currentList, $(this).hasClass('descending') ? 1 : -1, $(this).attr('data-sort'));
      return;
    }
  });
});

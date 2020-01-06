$(document).ready(function(){

	var data_list 	= new Array();
	var filename	= 'q3-2019.json';
	var currentQ    = 'q3-2019';
	var data 		= document.getElementById('data');
	var up 			= true;
	var config 		= '';
	var filter 		= new Array();
	var filterList	= new Array();
	var x	= 0;
	var y	= 0;	
	var curr = new Array();
	var list = '';
	var trans = ''

	
	//Aplication will do this first
	
	checkEmbed();

	// get Language
	var query = window.location.search.substring(1);
	var vars = query.split("&");

	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == 'lang'){
			var lang = (pair[1] != 'undefined') ? pair[1] : 'en';
		}
		if(pair[0] == 'embed'){
			var embed = (pair[1] != 'undefined') ? pair[1] : false ;
		}
		if(pair[0] == 'loc'){
			var loc = (pair[1] != 'undefined') ? pair[1] : '' ;
		}
	}

	$('.iema-awards').attr('href', returnUrl(loc,lang));

	$.getJSON('data/' + loc + '/' + filename, function(result){

		config = result.config;

		if( ( loc == 'vn') || (loc == 'ph') || (loc == 'th')){
			$('.employeeTitle').remove();
			if( loc == 'vn'){
				$('.socialTitle').attr('data-attr', 'youtube');
				$('.socialTitle').html('Youtube');	
			}
			if( loc == 'th'){
				$('.socialTitle').attr('data-attr', 'line');
				$('.socialTitle').html('Line');	
			}
		}
		
        $.each(result.data, function(i, field){
        	
        	data_list.push(field);
    		
        });

        curr = sortBy( data_list, true, 'traffics');

        generateVList(curr);
        animate();
        
    });

	function returnUrl(loc, lang){
		var url = '';
		switch( loc ){
			case 'id' : url = lang == 'id' ? 'https://iprice.co.id/insights/' : 'https://iprice.co.id/insights/en/';
				break;
			case 'my' : url = lang == 'vn' ? 'https://iprice.my/insights/' : 'https://iprice.my/insights/en/';
				break;
			case 'th' : url = lang == 'th' ? 'https://ipricethailand.com/insights/' : 'https://ipricethailand.com/insights/en/';
				break;
			case 'vn' : url = lang == 'vn' ? 'https://iprice.vn/insights/' : 'https://iprice.vn/insights/en/';
				break;
			case 'ph' : url = lang == 'ph' ? 'https://iprice.ph/insights/' : 'https://iprice.ph/insights/en/';
				break;
			case 'sg' : url = 'https://iprice.sg/insights/';
				break;
		}
		url += 'mapofecommerce/#iema-awards';

		return url;
	}

	function search(nameKey){
	    for (var i=0; i < data_list.length; i++) {
	        if (data_list[i].key == nameKey) {
	            return data_list[i];
	        }
	    }
	}
	function checkEmbed(){
		if( embed ){
			var main    = document.getElementById('iprice-content');
			var _el0    = document.getElementById('infographic-content');
			var _el     = document.createElement('div');

			main.setAttribute( 'class', 'embedded-graph');
			_el.setAttribute( 'class', 'copyright');
			_el.innerHTML = '<p><strong class="embed-title">Peta E-commerce Indonesia</strong><a href="https://iprice.my" target="_blank">Powered by iPrice</a></p>';

			_el0.insertBefore(_el, _el0.childNodes[0]);

		}
	}
	

	var content = document.getElementById('infographic-content');
	content.setAttribute('class', loc + '-content ' + lang + '-container');

	if( $(window).width() < 768){
		var container = document.getElementById('container');	
		container.style.width = $(window).width() + 'px';	
		var topLeft = document.createElement('div');
		
		container.appendChild(topLeft);
		topLeft.classList.add('top-left');
		topLeft.style.width = $('.sort-by:first-child').width() +'px';
		topLeft.style.height = $('.sort-by:first-child').height() +'px';

		$(container).scroll(function(){

			x = container.scrollLeft;
			y = container.scrollTop;

			if( (y > 10 ) || (x > 10)){
				$('.swipe-left').animate({
					opacity : 0
				}, 1000, function(){
					$('.swipe-left').remove(); 	
				}); 
			}

			$('.sort-by').each(function(i){
				if (i === 0) {
					this.style.transform = translate(x, y);
				}
				else{
					this.style.transform = translate(0, y);	
				}
			});

			if( x > 0 ){
				$('.category-item:first-child a label').each(function(){
					this.style.width = '0px';
				});
				TweenMax.to($('.sort-by:first-child'), 0.5, { width: '100px' }, 1);
				$('.category-item:first-child').each(function(){
					TweenMax.to($(this), 0.5, { width: '100px' }, 1);
				});
				if( ( loc != 'vn') && (loc != 'ph')){
					TweenMax.to($('.infographic-data-wrapper'), 0.5, { width: '750px' }, 1);
					TweenMax.to($('.row-wrapper'), 0.5, { width: '750px' }, 1);
				}else{
					TweenMax.to($('.infographic-data-wrapper'), 0.5, { width: '660px' }, 1);
					TweenMax.to($('.row-wrapper'), 0.5, { width: '660px' }, 1);
				}

			}else{
				$('.category-item:first-child a label').each(function(){
					this.style.width = 'calc(100% - 60px)';
				});
				TweenMax.to($('.sort-by:first-child'), 0.5, { width: '210px' }, 1);

				$('.category-item:first-child').each(function(){
					TweenMax.to($(this), 0.5, { width: '210px' }, 1);
				});
				TweenMax.to($('.infographic-data-wrapper'), 0.5, { width: '900px' }, 1);
				TweenMax.to($('.row-wrapper'), 0.5, { width: '900px' }, 1);
			}

			$('.category-item:first-child').each(function(){
				this.style.transform = translate(x, 0);
			});
		});

	}
	


	function translate( x, y) {
		return 'translate(' + x + 'px, ' + y + 'px)';
	}

	$('.q-button').click(function(e){
		$('.q-button').removeClass('q-active');

		var q = $(e.currentTarget).attr('data-attr');
		var filename = q + '-' + year + '.json';

		$(e.currentTarget).addClass('q-active');
		data_list = new Array();
		$.getJSON('data/' + loc + '/' + filename, function(result){
			config = result.config;
	        $.each(result.data, function(i, field){
	        	
	        	data_list.push(field);
	    		
	        });

	        curr = sortBy( data_list, true, 'traffics');

	        generateVList(curr);
	        animate();
	        
	    });
	});

	$('.quartal_select').change(function(e){

		var q = $(e.currentTarget).val();
		var filename = (q != '') ? (q + '.json') : currentQ + '.json';
		
		data_list = new Array();
		$.getJSON('data/' + loc +'/' + filename, function(result){
			config = result.config;
			setBusinessModel('business_model', config, trans);
	        $.each(result.data, function(i, field){
	        	
	        	data_list.push(field);
	    		
	        });

	        Filter(filter);
	        
	    });
	});

	function reSortByActive( arrayInput ){
		var sort = $('.active').attr('data-attr');

		arrayInput = sortBy( arrayInput, true, sort);		

		return arrayInput;
	}

	function setBusinessModel(selectClass, config, trans){
		var select = document.querySelector(`.${selectClass}`);
		if( ['id','ph','vn'].indexOf(lang)){
			var business_models = typeof config.business_model == 'undefined' ? trans.business_model.options : config.business_model[lang] ;
		}else{
			var business_models = typeof config.business_model == 'undefined' ? trans.business_model.options : config.business_model ;
		}
		

		select.innerHTML = '';
		select.innerHTML += `<option value="">${trans.business_model.title}</option>`;
		$.each(business_models, function(key, value){
			select.innerHTML += `<option value="${key}">${value}</option>`;
		});
	}

	function reSortByVisits( arrayInput ){
		$('.active').removeClass('active');
		$('.monthlyTitle').addClass('up');
		$('.monthlyTitle').addClass('active');

		arrayInput = sortBy( arrayInput, true, 'traffics');		

		return arrayInput;
	}

	function Filter( filter ){
		
		generateVList(data_list);
		$('.row').css('display', 'none');		
		
		filterList = [];
		$('.row').each(function(){

			var key = $(this).attr('data-key');
			switch( filter.length ){
				case 1 : if( $(this).hasClass(filter[0])){
							var _el = search(key)
							filterList.push(_el);
						}
					break;
				case 2 : if( $(this).hasClass(filter[0]) && 
							 $(this).hasClass(filter[1]) 
							){
							var _el = search(key)
							filterList.push(_el);
						}
					break;
				case 3 : if( $(this).hasClass(filter[0]) && 
							 $(this).hasClass(filter[1]) && 
							 $(this).hasClass(filter[2])
						   ){
							var _el = search(key)
							filterList.push(_el);
						}
					break;
				default : 	var _el = search(key)
							filterList.push(_el);
							
					break;
			}
		});


		filterList = reSortByActive(filterList);
		curr = filterList;
		generateVList(filterList);
		animate();


	}

	$('.sort_by').on('change', function(){

		filter 		= new Array();
		$('.sort_by').each(function(){
			if( $(this).val() != ''){
				filter.push($(this).val());	
			}
		});

		Filter(filter);
	});

    $('.sort-by').on('click', function(e){
		
		var sort = 'up';
		var _el = $(e.target).attr('data-attr');

		if( _el !== undefined){
			if( $(e.target).hasClass('active')){
				if( up ){
					up = false;
					sort = 'down';
				}else{
					up = true;
					sort = 'up';
				}
			}else{
				up = true;
				sort = 'up';
			}

			$('.active').removeClass('active');
			
			$(this).addClass('active');

			$('.active').removeClass('up');
			$('.active').removeClass('down');
			
			$(this).addClass(sort);
			
			var arrSort = sortBy(curr, up, _el);

			generateVList(arrSort);
			animate();			
		}

		// execute only for mobile
		if( $(window).width() < 768){
			$('.category-item:first-child').each(function(){
				this.style.transform = translate(x, 0);
			});
			if( x > 0){
				$('.sort-by:first-child').css( 'width', '100px');
				$('.category-item:first-child').each(function(){
					this.style.width = '100px';
				});

				$('.category-item:first-child label').each(function(){
					this.style.width = '0px';
				});
			}else{
				$('.sort-by:first-child').css( 'width', '210px');
				$('.category-item:first-child').each(function(){
					this.style.width = '210px';
				});
			}
		}
	});

    function sortBy( arr, order, property){
    	var arrSort = arr.slice(0);
    	arrSort.sort(function(a,b) {
    		if(( property != 'ios')&&(property != 'android')){
				if( ! order) {//ascending
					return a[property] - b[property];
				} else { // descending
					return b[property] - a[property];
				}
			}else{
				if( ! order) {//ascending
					return b[property] - a[property];
				} else { // descending
					return a[property] - b[property];
				}
			}
		});

    	return arrSort;
    }
    

	function animate(){

		var obj = $('.percent');
	    obj.each(function () {
	      var w = $(this).attr('data-width');
	      TweenMax.to($(this), 0.5, { width: w+'%' }, 1);
	    });
		
	}

    function generateVList(data) {

	    var dataList = [];

	    if( x > 0){
	    	var _style  = 'width:100px;';
	    		_style += ' transform: '+ translate( x, y); 
	    	var _w = 'style="width:0px"';
	    } else{
	    	var _style = '';
	    	var _w = '';
	    }
	    for (var i = 0; i < data.length; i++) {
	    	var html = '';

	    	// var iema 		= data[i].iema_winner ? 'iema' : '';
	    	var verified 	= data[i].verified ? 'verified' : '';

			var _wTraffics 	= parseFloat(data[i].traffics) / parseFloat(config.max_traffics) * 100; 
			var _wApp = 1 / data[i].app * 100 ; 
			if( loc == 'th'){
				var _wLine 		= parseFloat(data[i].line) / parseFloat(config.max_twitter) * 100; 	
			}else if (loc == 'vn'){
				var _wYoutube 	= parseFloat(data[i].youtube) / parseFloat(config.max_twitter) * 100; 
			}else{
				var _wTwitter 	= parseFloat(data[i].twitter) / parseFloat(config.max_twitter) * 100; 
			}

			var _wInstagram = parseFloat(data[i].instagram) / parseFloat(config.max_instagram) * 100; 
			var _wFacebook 	= parseFloat(data[i].facebook) / parseFloat(config.max_facebook) * 100; 
			if (( loc != 'vn') && (loc != 'ph') && (loc != 'th')){
				var _wEmployees = parseFloat(data[i].employees) / parseFloat(config.max_employees) * 100; 
			}


	    	html += '<div class="category-item col bg__grey" style="'+ _style +'">';
	    	html += '<span><a href="' + data[i].url + '" class="color__black" target="_blank" rel="nofollow">';
	    	html += '<img src="assets/img/'+ data[i].logodesktop.toLowerCase() + '"/>';

	    	html += '<label '+ _w +'>'+data[i].name+'</label></a>';
	    	// if(iema != ''){
	    	// 	html += '<label class="'+ iema+'"></label>';
	    	// }

	    	if(verified != ''){
	    		html += '<label class="'+ verified+'"></label>';
	    	}
	    	html += '</span></div>';

	    	html += '<div class="category-item col bg__grey ">';
	    	html += '<span><p class="percent animate-width" data-width="'+_wTraffics+'">'+ (data[i].traffics == 0 ? 'n/a' : data[i].traffics.toLocaleString()) +'</p></span>';
	    	html += '</div>';

	    	html += '<div class="category-item col bg__grey ">';
	    	html += '<span>'+(data[i].ios >= 99 ? 'n/a' : '#'+data[i].ios.toLocaleString())+'</span>';
	    	html += '</div>';
	    	html += '<div class="category-item col bg__grey ">';
	    	html += '<span>'+(data[i].android >= 99 ? 'n/a' : '#'+data[i].android.toLocaleString())+'</span>';
	    	html += '</div>';
	    	// html += '<span><p class="percent animate-width" data-width="'+_wApp+'">'+  (data[i].app == 99 ? 'n/a' : data[i].app.toLocaleString()) +'</p></span>';
	    	
	    	if( loc == 'th'){
				html += '<div class="category-item col bg__grey ">';
		    	html += '<span><p class="percent animate-width" data-width="'+_wLine+'">'+ (data[i].line == 0 ? 'n/a' : data[i].line.toLocaleString()) +'</p></span>';
		    	html += '</div>';
			}else if (loc == 'vn'){
				html += '<div class="category-item col bg__grey ">';
		    	html += '<span><p class="percent animate-width" data-width="'+_wYoutube+'">'+ (data[i].youtube == 0 ? 'n/a' : data[i].youtube.toLocaleString()) +'</p></span>';
		    	html += '</div>';
			}else{
				html += '<div class="category-item col bg__grey ">';
		    	html += '<span><p class="percent animate-width" data-width="'+_wTwitter+'">'+ (data[i].twitter == 0 ? 'n/a' : data[i].twitter.toLocaleString()) +'</p></span>';
		    	html += '</div>';
			}
	    	

	    	html += '<div class="category-item col bg__grey ">';
	    	html += '<span><p class="percent animate-width" data-width="'+_wInstagram+'">'+ (data[i].instagram == 0 ? 'n/a' : data[i].instagram.toLocaleString()) +'</p></span>';
	    	html += '</div>';

	    	html += '<div class="category-item col bg__grey ">';
	    	html += '<span><p class="percent animate-width" data-width="'+_wFacebook+'">'+ (data[i].facebook == 0 ? 'n/a' : data[i].facebook.toLocaleString()) +'</p></span>';
	    	html += '</div>';

	    	if (( loc != 'vn') && (loc != 'ph') && (loc != 'th')){
		    	html += '<div class="category-item col bg__grey ">';
		    	html += '<span><p class="percent animate-width" data-width="'+_wEmployees+'">'+ (data[i].employees == 0 ? 'n/a' : data[i].employees.toLocaleString()) +'</p></span>';
		    	html += '</div>';
		    }

	    	var _el = document.createElement('div');
			_el.setAttribute('class', 'row  '+ data[i].category + ' ' + data[i].location + ' ' + data[i].type);
			_el.setAttribute('data-order', i+1);
			_el.setAttribute('data-key', data[i].key);


	    	_el.innerHTML = html;
			dataList.push(_el);
	    }

	    var _width = $(window).width();
	    var itemH = 35, _h = 52; 

	    list = new VirtualList({
	      w: $('#data').width(),
	      h: _h * data.length,
	      items: dataList,
	      itemHeight: itemH,
	      cache: true
	    });
	    $('#data').html('');
	    $('#data').append(list.container);
	    
	}

	$('.awardText').click(function(e){
		e.preventDefault();
	});

	function getLang(){

		$.getJSON('data/translation.json', function(result){
			
			switch( lang ){
				case 'id' :  trans = result.id;
					break;
				case 'th' :  trans = result.th;
					break;
				case 'ph' :  trans = result.ph;
					break;
				case 'vn' :  trans = result.vn;
					break;
				case 'my' :  trans = result.my;
					break;
				default   :  trans = result.en;
					break;
			}  

			translateLang(trans);


		});
		
	}

	//getLang
	getLang();

	function getCountry(loc){

		switch( loc ){
			case 'id' : return 'Indonesia';
				break;
			case 'ph' : return 'Philippines';
				break;
			case 'vn' : return 'Vietnam';
				break;
			case 'th' : return 'Thailand';
				break;
			case 'sg' : return 'Singapore';
				break;
			case 'my' : return 'Malaysia';
				break;
			case 'hk' : return 'HongKong';
				break;
		} 
	}

	function translateLang(trans){
		$('.filterYear').html(trans.filterYear);
		$('.verifiedText').html(trans.verifiedText);
		$('.awardText').html(trans.awardText);
		$('.merchantTitle').html(trans.merchantTitle);
		$('.monthlyTitle').html(trans.monthlyTitle);
		$('.iosTitle').html(trans.iosTitle);
		$('.androidTitle').html(trans.androidTitle);
		$('.employeeTitle').html( trans.employeeTitle );
		$('.filterResultsBy').html( trans.filterResultsBy );
		$('.filter').find('select').each(function(){
			$(this).empty();
			if( $(this).hasClass('business_model')){
				setBusinessModel('business_model', config, trans);
			}else if( $(this).hasClass('store_type')){
				$(this).append('<option value="">'+trans.store_type.title+'</option>');
				$.each(trans.store_type.options, function(key, value){
					$('.store_type').append('<option value="'+key+'">'+value+'</option>')
				});
			}else if( $(this).hasClass('store_origin')){
				$(this).append('<option value="">'+trans.store_origin.title+'</option>');
				if( lang != 'en'){
					$.each(trans.store_origin.options, function(key, value){
						$('.store_origin').append('<option value="'+key+'">'+value+'</option>')
					});
				}else{
					
					var countryName = getCountry(loc);
					$('.store_origin').append('<option value="'+countryName.toLowerCase()+'">'+countryName+'</option>');
					$('.store_origin').append('<option value="international">International</option>');
				}
			}
		});
		
		$('.quartal_select').empty();

		var quarter = trans.quarter.options;

		$.each(quarter, function(key, value){
			if( key == currentQ){
				$('.quartal_select').append('<option value="'+key+'" selected>'+value+'</option>');
			}else{
				$('.quartal_select').append('<option value="'+key+'">'+value+'</option>');	
			}
		});
		
	}
	
    
});
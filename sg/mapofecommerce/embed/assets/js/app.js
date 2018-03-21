$(document).ready(function(){

	var data_list 	= new Array();
	var data 		= document.getElementById('data');
	var up 			= true;
	var config 		= '';
	var filter 		= new Array();
	var filterList	= new Array();
	var x	= 0;
	var y	= 0;	

	var container = document.getElementById('container');
	if( $(window).width() < 768){
		container.style.width = $(window).width() + 'px';	
		var topLeft = document.createElement('div');
		console.log($('.sort-by:first-child').width());
		container.appendChild(topLeft);
		topLeft.classList.add('top-left');
		topLeft.style.width = $('.sort-by:first-child').width() +'px';
		topLeft.style.height = $('.sort-by:first-child').height() +'px';
	}
	

	$(container).scroll(function(){

		x = container.scrollLeft;
		y = container.scrollTop;

		;

		$('.sort-by').each(function(i){
			if (i === 0) {
				this.style.transform = translate(x, y);
			}
			else{
				this.style.transform = translate(0, y);	
			}
		});

		$('.category-item:first-child').each(function(){
			this.style.transform = translate(x, 0);
		});
	});

	function translate(x, y) {
		return 'translate(' + x + 'px, ' + y + 'px)';
	}

	$.getJSON('data.json', function(result){
		config = result.config;
        $.each(result.data, function(i, field){
        	
        	data_list.push(field);
    		
        });

        data_list = bubbleSort( data_list, 'traffics', true);

		for(i=0; i<data_list.length; ++i){
			processData(i, data_list[i], config);
		}
		
        animate();
    });

	function Filter( filter ){
		
		filterList = [];
		$('.row').each(function(){
			
			switch( filter.length ){
				case 1 : if( $(this).hasClass(filter[0])){

							filterList.push( $(this).attr('data-key'));

						}
					break;
				case 2 : if( $(this).hasClass(filter[0]) && 
							 $(this).hasClass(filter[1]) 
							){
						
							filterList.push( $(this).attr('data-key'));
						}
					break;
				case 3 : if( $(this).hasClass(filter[0]) && 
							 $(this).hasClass(filter[1]) && 
							 $(this).hasClass(filter[2])
						   ){
							filterList.push( $(this).attr('data-key'));
						}
					break;
				default : filterList.push( $(this).attr('data-key'));
					break;
			}
		});
		var key = '';
		data.innerHTML = '';
		for(i=0; i<data_list.length; ++i){
			key = data_list[i].key.toString();
			processData(i, data_list[i], config);
			if( filterList.indexOf( key ) != '-1'){
					 
				$('.row[data-key="' + key + '"]').css('display', 'block');	
			}else{
				$('.row[data-key="' + key + '"]').css('display', 'none');
			}
		}

		animate();


	}

	$('.sort_by').on('change', function(){

		

		$('.animate-width').css('width', '0');
		filter 		= new Array();
		$('.sort_by').each(function(){
			if( $(this).val() != ''){
				filter.push($(this).val());	
			}
		});

		$('.row').css('display', 'none');

		Filter(filter);
	});

	$('.sort-by').on('click', function(e){
		
		var sort = 'up';
		var _el = $(e.target).attr('data-attr');

		if( $(e.target).hasClass('active')){
			if( up ){
				up = false;
				sort = 'down';
			}else{
				up = true;
				sort = 'up';
			}
		}

		$('.active').removeClass('active');
		
		$(this).addClass('active');

		$('.active').removeClass('up');
		$('.active').removeClass('down');
		
		$(this).addClass(sort);
		data.innerHTML = '';
		if( _el !== undefined){
			
			data_list = bubbleSort( data_list, _el, up);

			for(i=0; i<data_list.length; ++i){
				processData(i, data_list[i], config);
			}

			animate();
		}

		$('.category-item:first-child').each(function(){
			this.style.transform = translate(x, 0);
		});
	});

	function animate(){

		$('[class*="category-item"]').each(function(){

			var w = $(this).find('p').attr('data-width');

			$(this).find('p').animate({
				width : "+="+w+"%"
			}, 500);

		});
	}

    function processData(i, field, config){
    	var iema = field.iema_winner ? 'iema' : '';
    	var verified = field.verified ? 'verified' : '';

    	var _elStore = document.createElement('div');
			_elStore.setAttribute('class', 'category-item col bg__grey ' + iema +' ' + verified);

		var _elTraffic = document.createElement('div');
			_elTraffic.setAttribute('class', 'category-item col bg__grey');

		var _elApps = document.createElement('div');
			_elApps.setAttribute('class', 'category-item col bg__grey');

		var _elTwitter = document.createElement('div');
			_elTwitter.setAttribute('class', 'category-item col bg__grey');

		var _elInstagram = document.createElement('div');
			_elInstagram.setAttribute('class', 'category-item col bg__grey');

		var _elFacebook = document.createElement('div');
			_elFacebook.setAttribute('class', 'category-item col bg__grey');

		var _elEmployee = document.createElement('div');
			_elEmployee.setAttribute('class', 'category-item col bg__grey');

		var _elwrapper = document.createElement('div');
			_elwrapper.setAttribute('class', 'row mb__10 '+ field.category + ' ' + field.location + ' ' + field.type);
			_elwrapper.setAttribute('data-order', i+1);
			_elwrapper.setAttribute('data-key', field.key);

		var _wTraffics = field.traffics / parseInt(config.max_traffics) * 100; 
		var _wApp = 1 / field.app * 100 ; 
		var _wTwitter = field.twitter / config.max_twitter * 100; 
		var _wInstagram = field.instagram / config.max_instagram * 100; 
		var _wFacebook = field.facebook / config.max_facebook * 100; 
		var _wEmployees = field.employees / config.max_employees * 100; 

		_elStore.innerHTML 	= '<span><a href="' + field.url + '" class="color__black" target="_blank" rel="noopener"><img src="assets/img/'+ field.logodesktop + '"/><label>'+field.name+'</label></a></span>';
		_elTraffic.innerHTML 		= '<span><p class="animate-width" data-width="'+_wTraffics+'">'+field.traffics.toLocaleString()+'</p></span>';
		_elApps.innerHTML 		= '<span><p class="animate-width" data-width="'+_wApp+'">'+  (field.app == 0 ? 'n/a' : field.app.toLocaleString()) +'</p></span>';
		_elTwitter.innerHTML 		= '<span><p class="animate-width" data-width="'+_wTwitter+'">'+ (field.twitter == 0 ? 'n/a' : field.twitter.toLocaleString()) +'</p></span>';
		_elInstagram.innerHTML 		= '<span><p class="animate-width" data-width="'+_wInstagram+'">'+ (field.instagram == 0 ? 'n/a' : field.instagram.toLocaleString()) +'</p></span>';
		_elFacebook.innerHTML 		= '<span><p class="animate-width" data-width="'+_wFacebook+'">'+ (field.facebook == 0 ? 'n/a' : field.facebook.toLocaleString()) +'</p></span>';
		_elEmployee.innerHTML 		= '<span><p class="animate-width" data-width="'+_wEmployees+'">'+ (field.employees == 0 ? 'n/a' : field.employees.toLocaleString()) +'</p></span>';

		_elwrapper.appendChild(_elStore);
		_elwrapper.appendChild(_elTraffic);
		_elwrapper.appendChild(_elApps);
		_elwrapper.appendChild(_elTwitter);
		_elwrapper.appendChild(_elInstagram);
		_elwrapper.appendChild(_elFacebook);
		_elwrapper.appendChild(_elEmployee);
		$(data).append(_elwrapper);
    }

    

    function bubbleSort(arr, _el, up){
    	var len = arr.length;
    	if( _el == 'app'){
    		if( !up ){
	    		for (var i = len-1; i>=0; i--){
		    		for(var j = 1; j<=i; j++){

		    			if(arr[j-1][_el]<arr[j][_el]){
		    				var temp = arr[j-1];
		    				arr[j-1] = arr[j];
		    				arr[j] = temp;
		    			}
		    		}
		    	}
	    	}else{
	    		for (var i = len-1; i>=0; i--){
		    		for(var j = 1; j<=i; j++){

		    			if(arr[j-1][_el]>arr[j][_el]){
		    				var temp = arr[j-1];
		    				arr[j-1] = arr[j];
		    				arr[j] = temp;
		    			}
		    		}
		    	}
	    	}
    	}else{
    		if( up ){
	    		for (var i = len-1; i>=0; i--){
		    		for(var j = 1; j<=i; j++){

		    			if(arr[j-1][_el]<arr[j][_el]){
		    				var temp = arr[j-1];
		    				arr[j-1] = arr[j];
		    				arr[j] = temp;
		    			}
		    		}
		    	}
	    	}else{
	    		for (var i = len-1; i>=0; i--){
		    		for(var j = 1; j<=i; j++){

		    			if(arr[j-1][_el]>arr[j][_el]){
		    				var temp = arr[j-1];
		    				arr[j-1] = arr[j];
		    				arr[j] = temp;
		    			}
		    		}
		    	}
	    	}
    	}
    	
    	
    	return arr;
}
});
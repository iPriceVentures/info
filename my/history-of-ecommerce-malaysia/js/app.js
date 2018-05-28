$(document).ready(function(){
	
	var t = new Array();
	var _y = [ 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
	var a = 9;
	var _dy = 0;
	var max = 9;
	var labels = '';
	$('.go-left').hide();

	$('body').addClass('overlay-open');
	$('#mobile-overlay').height($(window).height()+125);

	setTimeout(function(){
		$('.loader').hide();
		$('.overlay-wrapper').show();	
		$('#mobile-overlay').css('background', 'rgba(0,0,0,0.5)');		
	}, 2000);

	$('.explore').click(function(){
		console.log('clicked');
		$('#mobile-overlay').fadeOut(250, function(){
			$('#mobile-overlay').css('z-index', '-1');
		});
		$('body').removeClass('overlay-open');

		if( $(window).width() > 768){
			animateStage();
		}
	});

	function animateStage(){
		$('.wrapper').css({
			"-webkit-transform-style":"linear",             
			"transform-style":"linear",      
			"-moz-transform-style":"linear",
			"-ms-transition-timing-function":"linear",         
			"-webkit-transition-timing-function":"linear",
			"-moz-transition-timing-function":"linear",
			"-o-transform-style":"linear",
			"-webkit-transition-property":"transform",
			"-moz-transition-property":"all",
			"-ms-transition-property":"transform",
			"-o-transition-property":"transform",
			"transition-property":"transform",
			"-webkit-transition-duration":"2000ms",
			"-moz-transition-duration":"2000ms",
			"-ms-transition-duration":"2000ms",             
			"-o-transition-duration":"2000ms",              
			"transition-duration":"2000ms",           
			"-webkit-transform": "perspective(500px) rotateY(10deg) translateX(-702px)",
			"-moz-transform": "perspective(500px) rotateY(0deg) translateX(-702px)",
			"-ms-transform": "translateX(-702px)",
			"-o-transform": "translateX(-702px)",                   
			"transform": "perspective(500px) rotateY(10deg) translateX(-702px)"
		});

		setTimeout(function(){
			
			$('.wrapper').css({
				"-webkit-transform-style":"linear",             
				"transform-style":"linear",      
				"-moz-transform-style":"linear",
				"-ms-transition-timing-function":"linear",         
				"-webkit-transition-timing-function":"linear",
				"-moz-transition-timing-function":"linear",
				"-o-transform-style":"linear",
				"-webkit-transition-property":"transform",
				"-moz-transition-property":"all",
				"-ms-transition-property":"transform",
				"-o-transition-property":"transform",
				"transition-property":"transform",
				"-webkit-transition-duration":"3000ms",
				"-moz-transition-duration":"3000ms",
				"-ms-transition-duration":"3000ms",             
				"-o-transition-duration":"3000ms",              
				"transition-duration":"3000ms",          
				"-webkit-transform": "perspective(0px) rotateY(0deg) translateX(-302px)",
				"-moz-transform": "perspective(0px) rotateY(0deg) translateX(-302px)",
				"-ms-transform": "translateX(-802px)",
				"-o-transform": "translateX(-802px)",                   
				"transform": "perspective(0px) rotateY(0deg) translateX(-802px)"
			});
		}, 2000);

		setTimeout(function(){
			$('.wrapper').attr('style', '');
			var _iw = $('#SvgjsSvg1001').width();
			$('.main-stage').scrollLeft( _iw - 100);
			$('.go-right').hide();
		},5000);
	}

	if( $(window).width() < 768){
		/* --- Execute this for mobile only --- */

		$.getJSON('data/data.json', function(data){
		
			$.each(data.timeline, function(i, field){
				t.push(field);
			});

			labels = data.labels;

			_dy = t.length;
			a = data.timeline.length - 1;
			
			mobileList(a);

		});

		var sc = document.getElementById('main-screen');
		var mc = new Hammer(sc);
		
		mc.on("swipeleft swiperight", function(ev){
			if( ev.type == 'swipeleft'){
				if( a < max){
					a = a+1;
					
					mobileList(a);
				}else{
					// Do Nothing
				}
			}
			else if( ev.type == 'swiperight' ){
				if( a > 0){
					a = a-1;
					mobileList(a);
				}
			}
		});

		$('.next-year').click(function(){
			if( a < max){
				a = a+1;
				
				mobileList(a);
			}else{
				// Do Nothing
			}
		});

		$('.prev-year').click(function(){
			if( a > 0){
				a = a-1;
				mobileList(a);
			}
		});

		function convertNum( num ){
			if( num == 0){
				return 'N/A';
			}
			else if( num == 1){
				return '1st';
			}
			else if(num == 2){
				return '2nd';
			}
			else if(num == 3){
				return '3rd';
			}else{
				return num+'th';
			}
		}
		// call current year of the timeline
		function mobileList(a){
			
			var label = grabLabels( _y[a]);
			$('.highlight label').html(label);
			var items = [];
			$.each( t[a].items, function( i, val){
				var html  = "<figure class='ec-item el p-relative'>";
					html += "<a href='#' class='ec-item-link' data-year='" + a + "' data-id='" + i + "'>";
					html += "<img src='img/"+ val.img + "'/>";

					if( val.isEst ){
						html += "<span class='name'>"+ val.merchantName+"</span>";
						html+= "<span class='est'>est " + val.est + "</span>";
					}else{
						html += "<span class='name no-est'>"+ val.merchantName+"</span>";
					}
					html += "</a></figure>";
				items.push(html);
			});

			$('.current-year').html(t[a].year);
			$('.active').removeClass('active');
			$('.y-' + t[a].year ).addClass('active');
			$('#ecs').html( items.join(''));

			$('.ec-item-link').on('click', ecItemClicked);
		}

		function ecItemClicked(){
			var dy = $(this).attr('data-year');
			var did = $(this).attr('data-id');
			var item = t[dy].items[did];

			
			var check = (parseInt(dy) == 0) ? false : getDatainYear( (parseInt(dy) - 1), item.merchantName);
			var checkNext = (parseInt(dy) == 9) ? false : getDatainYear( (parseInt(dy) + 1), item.merchantName);

			$('.prev-detail').show();
			$('.next-detail').show();

			_dy = parseInt(dy);
			if( (_dy == 0 ) || !check )
			{
				$('.prev-detail').hide();
			}
			else if( _dy == (t.length - 1) || !checkNext )
			{
				$('.next-detail').hide();		
			}

			$('#popup-overlay').addClass('on');
			$('body').addClass('overlay-open');

			openPopUp( item, _y[dy]);
		}

		$('.next-detail').on('click', function(){
			if( _dy < (t.length-1)){
				_dy = _dy + 1;

				var data = getDatainYear( _dy, $('.popup-name').val());
				var check = (_dy == t.length - 1) ? false : getDatainYear( (_dy + 1), $('.popup-name').val());
				
				openPopUp( data, _y[_dy]);
				
				if( ( _dy == (t.length - 1) ) || ( !check)){
					$(this).hide();
				}else{
					$('.prev-detail').show();
				}
				
			}
		});

		$('.prev-detail').on('click', function(){
			if( _dy > 0 ){
				_dy = _dy - 1;

				console.log( _dy );
				var data = getDatainYear( _dy, $('.popup-name').val());
				openPopUp( data, _y[_dy]);
				var check = (_dy == 0) ? false : getDatainYear( (_dy - 1), $('.popup-name').val());

				if( (_dy == (0) ) || !check){
					$(this).hide();
				}else{
					$('.next-detail').show();
				}
				
			}
		});

		function getDatainYear( index, search){
			
			var items = t[index].items;
			var found = false;

			for(i=0; i<items.length; ++i){
				var item = items[i];
				if( item.merchantName == search){
					found = item;
				}
			}

			return found;

		}

		function grabLabels(year){
			var index = 99;
			$.each(labels, function(i, item){
				var check = $.inArray(parseInt(year), labels[i].years);
				
				if( check != -1){
					index = i;
				}
			});

			return (index == 99) ? false : labels[index].title;
		}

		var open_menu = false;

		$('.toggle-menu').click(function(){
			if( !open_menu ){
				$('.nav-right').animate({
					height : '+=105'
				}, 500);

				open_menu = true;
			}else{
				$('.nav-right').animate({
					height : '-=105'
				}, 500);

				open_menu = false;
			}
		});
	}else{

		var maxscroll = $('#SvgjsSvg1001').width() - $('#drawing').width();
		var scrollPos = maxscroll;
		$('.main-stage').scroll(function(){
			scrollPos = $(this).scrollLeft();
			$('.go-right').show();
			$('.go-left').show();
			if( scrollPos == 0){
				$('.go-left').hide();
			}
			else if( scrollPos == maxscroll){
				$('.go-right').hide();
			}
		});
		
		var move = 0;
		var open_feedback = false;
		$('.feedback-button').click(function(){
			if( !open_feedback ){
				$('.feedback').animate({
					left: "+=360"
				},1000);

				open_feedback = true;
			}else{
				$('.feedback').animate({
					left: "-=360"
				},1000);

				open_feedback = false;
			}
			
		});
		$('.go-right').on('click', function(){
			
			if(scrollPos < maxscroll){
				$('.main-stage').animate({
					scrollLeft: "+=250"
				});

				scrollPos = scrollPos+250;
			}else{
				scrollPos = maxscroll;
			}
		});

		$('.go-left').on('click', function(){

			if(scrollPos > 0){
				$('.main-stage').animate({
					scrollLeft: "-=250"
				});

				scrollPos = scrollPos-250;
			}else{
				scrollPos = 0;
			}
		});
	}

	function openPopUp( data, year){
		var html = '';
		$('.popup-name').val( data.merchantName );
		$('.popup-year').html( year );
		$('.popup-img').attr( 'src', 'img/' + data.merchantImg);
		$('.popup-screenshot').attr( 'src', 'img/screenshot/' + data.screenshot);
		$('.popup-app-rank').html( convertNum(data.appRank) );
		$('.popup-web-rank').html( convertNum(data.webRank) );
		$('.screenshot-taken').html('Screenshot Captured in ' + data.lastCaptured);

		$('.popup-founded').html( 'Web launched in ' + data.webLaunched);
		$('.popup-launched').html( 'App launched in ' + data.appLaunched);
		$('.founded-in').remove();
		$('.app-launched').remove();

		if( $('.no-news').length > 0){
			$('.no-news').remove();
		}

		if( data.highlights.length > 0){
			$.each(data.highlights, function(i, item){

				html += '<li><a href="'+item.link+'" target="_blank" rel="nofollow noopener">'+ item.title+' - ' + item.pub_date + '</a></li>';
			});
		}else{

			var n_a = '<p class="no-news">No News Highlights<br /><a href="">See Next Year</a></p>';

			$(n_a).appendTo(".highlights");
		}
		

		$('.popup-highlights').html(html);	
	}

	$('.close').on('click', function(){
		$('#popup-overlay').removeClass('on');
		$('body').removeClass('overlay-open');
	});
	// create element based on the data
	
	// handle swipe action on the screen
	/* --- EoL Here --- */

	
	/* --- Execute this for desktop only --- */
	
	$('.zoom-out').on('click', function(){
		
		zoomLevel( true );
	});

	$('.zoom-in').on('click', function(){
		zoomLevel( false );
	});

	// handle zoom level in here
	function zoomLevel( plus ){
		var stage = $('.main-stage');
		var currZoom = $('.main-stage').attr('data-zoom');
		var svg = document.getElementById('SvgjsSvg1001');
		var g = svg.getElementById('SvgjsG1008');
		var _h = 

		currZoom = (typeof currZoom == 'undefined') ? 0 : currZoom;
		if( plus ){
			if( currZoom < 2){
				// Do Nothing
				currZoom = parseInt(currZoom) + 1;
				var s = 1 + 0.25*(parseInt(currZoom));
				
				g.style.transform = "scale(" + s + ")";
				svg.setAttribute("height", 832*s);
				stage.attr('data-zoom', parseInt(currZoom));

				if( currZoom == '2'){
					$('.zoom-out').attr('disabled', true);
				}else{
					$('.zoom-in').removeAttr('disabled');
				}

				console.log(currZoom);

				switch( parseInt(currZoom) ){
					case 1 : $('.left-rank').find('li').css('margin-top', '48px');
						break;
					case 2 : $('.left-rank').find('li').css('margin-top', '84px');
						break;
					default  : $('.left-rank').find('li').css('margin-top', '0px');
						break;
				}
			}
		}else{
			if( currZoom > -2){

				currZoom = parseInt(currZoom) - 1;
				var s = 1 + 0.25*(parseInt(currZoom));
				
				g.style.transform = "scale(" + s + ")";
				svg.setAttribute("height", 832*s);
				stage.attr('data-zoom', parseInt(currZoom));

				if( currZoom == '-2'){
					$('.zoom-in').attr('disabled', true);
					$('.go-left').hide();
					$('.go-right').hide();
				}else{
					$('.zoom-out').removeAttr('disabled');
					$('.go-left').show();
					$('.go-right').show();
				}

				switch( parseInt(currZoom) ){
					case 1 : $('.left-rank').find('li').css('margin-top', '48px');
						break;
					case 2 : $('.left-rank').find('li').css('margin-top', '84px');
						break;
					default  : $('.left-rank').find('li').css('margin-top', '0px');
						break;
				}
			}
		}



		
	}
	/* --- EoL Here --- */	
});

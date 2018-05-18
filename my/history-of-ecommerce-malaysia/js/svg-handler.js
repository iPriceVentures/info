if( $(window).width() > 768){
	var x  = 140;
	var y  = 16;
	var sx = 55;
	var sy = 58;
	var w  = 9*x + 10*sx + 156;
	var h  = 9*y + 10*sy + 128;
	var _dy = 0;

	var _years = [ 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

	var c = [ '#85BB00', '#FEDF00', '#802534', '#565656', '#F36F21', '#C0262C', '#610833', '#397FFB', '#D2212E', '#E6077E', '#FF5607']
	var t = new Array();

	var draw = SVG('drawing').size(w,h);
	var _mgroup = draw.group();

	for(i=0;i< _years.length; ++i){
		var el = draw.text(''+_years[i]).font({family: 'Circular Std Bold', size : 24});
		var pos = 110+(i*x)+(i*sx);
		el.move(pos,8);

		_mgroup.add( el );

		var l = draw.line();

		l.stroke({ color: '#ddd' , width: 1, linecap: 'round' });
		l.plot(pos+28,40,pos+28,h);
		l.attr('stroke-dasharray', '3, 3');

		_mgroup.add( l );
	} 

	$.getJSON('data/data.json', function(data){
		$.each(data.timeline, function(i, field){
			t.push(field);
		});

		_dy = t.length;
		drawLabel( data.labels);
		drawLine(t);
		drawAllBox(t);

		setTimeout(function(){
			var svg = document.getElementById('drawing');
			svg.setAttribute('class', 'move-animating container');
		},1000);
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
	function drawLabel( labels ){
		var count = 0;
		var po=0, ops=0;
		
		for( var z=0; z<labels.length; ++z){
			var label = draw.text(''+labels[z].title).font({family: 'Circular Std Bold', size : 13, fill: '#999', anchor: 'middle', leading:'1em'});
			count = count+labels[z].years.length;
			if( z == 0){
				var ops = count-2;
			}else if(z == 2){
				var ops = 5.93;
			}
			else{
				var ops = count-0.45;

			}

			switch( z ){
				case 0 : po = 440;
					break;
				case 1 : po = 916;
					break;
				case 2 : 
						 po = 1210;
					break;
				case 3 : 
						 po = 1500;
					break;
				case 4 : 
						 po = 1700;
					break;
				case 5 : 
						 po = 1890;
					break; 
			}
			
			if( z == 0){	
				label.move(po,55);
			}else{
				label.move(po,42);	
			}
			
			_mgroup.add( label );
		};

	}

	function drawAllBox(t){
		for(j=0; j < t.length; ++j){
			var posx = 112+(j*x)+(j*sx);
			var group = draw.group();
			for(k=0; k<t[j].items.length; ++k){

				if( k < 10){
					var item = t[j].items[k];
					var posy = 94 + (k*y) + (k*sy);
					var box = draw.image('img/' + item.img, 52,52);
					box.attr('data-year', j);
					box.attr('data-id', k);

					box.attr('style', 'z-index: 3');
					box.attr('class', 'ec-item '+ item.merchantName.toLowerCase());
					box.move(posx, posy);
					group.add(box);

					if( item.isEst ){
						var el1 = draw.text(item.merchantName).font({family: 'Circular Std Bold', size : 14, fill:'#666', anchor:'end'});
						el1.move(posx-10,posy+8);
						var el2 = draw.text(item.est).font({family: 'Circular Std', size : 14, fill:'#666', anchor:'end'});
						el2.move(posx-10,posy+24);

						_mgroup.add( el1 );
						_mgroup.add( el2 );
					}
					box.click(function(d,i){
						var dy = this.attr('data-year');
						var did = this.attr('data-id');
						var item = t[dy].items[did];

						var check = (dy == 0) ? false : getDatainYear( (dy - 1), item.merchantName);
						var checkNext = (dy == 9) ? false : getDatainYear( (dy + 1), item.merchantName);

						$('.prev-detail').show();
						$('.next-detail').show();

						_dy = dy;
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

						openPopUp( item, _years[dy]);
					});

					box.mouseover(function(){
						this.animate(250,'<').scale(1.2);
					});

					box.mouseout(function(){
						this.animate(250,'>').scale(1);
					});
				}

			}
			_mgroup.add( group );
		}
	}

	$('.next-detail').on('click', function(){
		if( _dy < (t.length-1)){
			_dy = _dy + 1;

			var data = getDatainYear( _dy, $('.popup-name').val());
			var check = (_dy == t.length - 1) ? false : getDatainYear( (_dy + 1), $('.popup-name').val());
			
			openPopUp( data, _years[_dy]);
			
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

			var data = getDatainYear( _dy, $('.popup-name').val());
			openPopUp( data, _years[_dy]);
			var check = (_dy == 0) ? false : getDatainYear( (_dy - 1), $('.popup-name').val());

			if( (_dy == (0) ) || !check){
				$(this).hide();
			}else{
				$('.next-detail').show();
			}
			
		}
	});

	function drawLine(t){
		for(j=0; j < t.length; ++j){
			var posx = 164+(j*x)+(j*sx);
			var group = draw.group();
			for(k=0; k<t[j].items.length; ++k){
				var item = t[j].items[k];
				var posy = 124 + (k*y) + (k*sy);
				var tox = posx + x;
				var toy = posy + ( item.nextRank - (k + 1))*72;
				if( item.nextRank != 0){
					var line = draw.line();
					var _color = getLineColor(item.merchantName);
					line.stroke({ color: _color , width: 2, linecap: 'round' });
					line.plot(posx,posy,tox,toy);
					line.attr('data-merchant', item.merchantName.toLowerCase());
					line.attr('style', 'opacity:0.3');
					line.attr('class', 'line line-'+ item.merchantName.toLowerCase());

					group.add( line );

					line.mouseover(function(){
						$('.line').css('opacity', '0.1');
						var m = this.attr('data-merchant');
						$('.line-'+m).css( 'opacity', '1.0');
					});

					line.mouseout(function(){
						$('.line').css('opacity', '.3');
					});
				}
			}

			_mgroup.add( group );
		}
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

		$('.founded-in').html( 'Web launched in ' + data.webLaunched);
		$('.app-launched').html( 'App launched in ' + (data.appLaunched == "" ? "-" : data.appLaunched));

		if( $('.no-news').length > 0){
			$('.no-news').remove();
		}

		if( data.highlights.length > 0){
			$.each(data.highlights, function(i, item){

				html += '<li><a href="'+item.link+'" target="_blank" rel="nofollow noopener">'+ item.title+' - ' + item.pub_date + '</a></li>';
			});
		}else{

			var n_a = '<p class="no-news">No News Highlights<br /><a href="#" class="next-year">See Next Year</a></p>';

			$(n_a).appendTo(".highlights");

			$('.next-year').click(function(event){
				event.preventDefault();
				if( _dy < (t.length-1)){
					_dy = _dy + 1;

					var data = getDatainYear( _dy, $('.popup-name').val());
					var check = (_dy == t.length - 1) ? false : getDatainYear( (_dy + 1), $('.popup-name').val());
					
					openPopUp( data, _years[_dy]);
					
					if( ( _dy == (t.length - 1) ) || ( !check)){
						$(this).hide();
					}else{
						$('.prev-detail').show();
					}
					
				}
			});
		}
		

		$('.popup-highlights').html(html);	
	}

	function getLineColor( merchant ){
		/* 
			Color Index for merchant
			0 - eBay 
			1 - lelong 
			2 - Fashion valet 
			3 - Zamora 
			4 - Lazada 
			5 - Rakuten 
			6 - Hermo 
			7 - Saigon/ezbuy 
			8 - Shopee 
			9 - Gossip 
			10 - 11street 
		*/
		switch( merchant ){
			case 'eBay' : return c[0];
				break;
			case 'Lelong' : return c[1];
				break;
			case 'FashionValet' : return c[2];
				break;
			case 'Zalora' : return c[3];
				break;
			case 'Lazada' : return c[4];
				break;
			case 'Rakuten' : return c[5];
				break;
			case 'Hermo' : return c[6];
				break;
			case 'Shopee' : return c[8];
				break;
			case 'GoShop' : return c[9];
				break;
			case '11Street' : return c[10];
				break;
			default  : return c[7];
				break;
		}
	}

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
}

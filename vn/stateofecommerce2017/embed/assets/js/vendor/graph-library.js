
function translateCountry(label){

	switch( label ){
		case 'ID' : return 'Indonesia';
			break;
		case 'PH' : return 'Philippines';
			break;
		case 'VN' : return 'Vietnam';
			break;
		case 'TH' : return 'Thailand';
			break;
		case 'SG' : return 'Singapore';
			break;
		case 'MY' : return 'Malaysia';
			break;
		default : return label
			break;
	} 
}

function round(value, decimals) {
  return Number(Math.floor(value+'e'+decimals)+'e-'+decimals);
}

function translateDay(label){

	switch( label ){
		case 'SUN' : return 'Sunday';
			break;
		case 'MON' : return 'Monday';
			break;
		case 'TUE' : return 'Tuesday';
			break;
		case 'WED' : return 'Wednesday';
			break;
		case 'THU' : return 'Thursday';
			break;
		case 'FRI' : return 'Friday';
			break;
		case 'SAT' : return 'Saturday';
			break;
		default : return label
			break;
	} 
}
/**
 * bar chart function
 */
function barChart( _id, _values, format, cat, x_label, y_label, label, ticks){

	var height = ($(window).width() < 768) ? 425 : 500;

	var chart = c3.generate({
		bindto: '#'+_id,
	    data: {
	        columns : _values,
	        type: 'bar'
	    },
	    size:{
	    	height: height
	    },
	    color: {
	        pattern: ['#33CCCC', '#FF6633', '#086A87', '#0DA290', '#3fbf72', '#ff4949']
	    },
	    axis: {
        	x: {
        		type: 'categories',
        		categories : cat,
	            label: {
	                text: x_label,
	                position: 'outer-center'
	            },
	            tick : {
	            	centered : true
	            }
	        },
	        y : {
	        	tick: {
					format: function (d) { 
						if( format == '$'){
							return format + " " + d;
							
						}else{
							return d + " "+format; 	
						}
						
					}
	            },
	            label: {
	                text: y_label,
	                position: 'outer-middle'
	            },
	            max : 100
	        }
	    },
	    grid: {
	        y: {
	            show: true
	        }
	    }
	});
}

function donutChart( _id, _values, format, cat){

	var height = ($(window).width() < 768) ? 350 : 450;

	var chart = c3.generate({
		bindto: '#'+_id,
	    data: {
	        columns : _values,
	        type: 'donut'
	    },
	    size:{
	    	height: height
	    },
	    color: {
	        pattern: ['#33CCCC', '#FF6633', '#91B496', '#86E2D5', '#EC644B', '#FABE58', ]
	    },
	    axis: {
        	x: {
	            type: 'category',
	            categories: cat
	        },
	        y : {
	        	tick: {
					format: function (d) { 
						if( format == '$'){
							return format + " " + d;
							
						}else{
							return d + " "+format; 	
						}
						
					}
	            }
	        }
	    },
	    grid: {
	        x: {
	            show: true
	        },
	        y: {
	            show: true
	        }
	    }
	});
}

/**
 * horizontal chart function
 */

function horizontalChart( _id, _values, format, x_label, y_label, label, legend, _max, _avg){
	
	var height = ($(window).width() < 768) ? 350 : 450;
	if( format == 'x'){
		var lines = [
	            	{ value: 1.0, text: _avg, class: 'avg-hg'}
	            ];
	}else{
		var lines = [];
	}

	var chart = c3.generate({
		bindto: '#'+_id,
	    data: {
	    	x : 'x',
	        columns : _values,
	        type: 'bar',
	        order: 'asc'
	    },
	    size:{
	    	height: height
	    },
	    color: {
	        pattern: ['#33CCCC', '#FF6633', '#086A87', '#0DA290', '#3fbf72', '#ff4949']
	    },
	    tooltip: {
	    	format: {
	    		value: function (value, ratio, id, index) { 
	    			if( format == '$'){
						return format + " " + value;
						
					}else{
						return value + " "+format; 	
					}
	    		},
	    		title : function(x){
	    			return translateCountry(_values[0][x+1]);
	    		}
			}
	    },
	    legend : {
	    	hide: legend
	    },
	    axis : {
	    	rotated: true,
	    	y : {
            	tick: {
					format: function (d) { 
						
						if( format == '$'){
							return format + " " + d.toFixed(0);
							
						}else{

							return round(d,1) + ""+format; 	
						}
					},
					count : 6
	            },
	            label: {
	                text: x_label,
	                position: 'outer-center'
	            },
	            max : _max
	        },
	    	x: {
	            type: 'category', // this needed to load string x value
	        	label: {
	                text: y_label,
	                position: 'outer-middle'
	            }
	        }
	    },
	    grid: {
	        x: {
	            show: true
	        },
	        y: {
	            show: true,
	            lines: lines
	        }
	    }
	});
}

function putImage( _el ){

    _el.selectAll(".tick").each(function(d,i){        
        d3.select(this)
          .append('image')
          .attr('xlink:href', img)
          .attr('x',0 - 128)
          .attr('y',0 - 128)
          .attr('width',128)
          .attr('height',128);
    });
}

/**
 * pie chart function
 */

function splineChart( _id, data, format, x_label, y_label, ticks){

	var height = ($(window).width() < 768) ? 350 : 450;

	var chart = c3.generate({
		bindto: '#'+_id,
	    data: {
        	columns: data,
        	type: 'spline'
	    },
	    tooltip : {
	    	format : {
	    		title : function(x){
	    			return translateDay(ticks[x+1]);
	    		}
	    	}
	    }
	    ,
	    axis : {
	    	x: {
	        	label: {
	                text: x_label,
	                position: 'outer-center'
	            },
	            tick : {
	            	format : function(x){
	            		return ticks[x+1];
	            	}
	            },
	            padding: {
			      left: 0.5,
			      right: 0.5
			    }
	        },
	        y : {
	        	label: {
	                text: y_label,
	                position: 'outer-middle'
	            },
	            tick : {
	            	format: function (d) { 
						if( format == '$'){
							return format + " " + d;

						}else{
							return d + " "+format; 	
						}
						
					}
	            }
	        }
	    },
	    size:{
	    	height: height
	    },
	    color: {
	        pattern: ['#33CCCC', '#FF6633', '#086A87', '#0DA290', '#3fbf72', '#ff4949']
	    },
	    point: {
	    	select: {
	    		r: 4
	    	},
			r: 3
		},
	    grid: {
	        x: {
	            show: true
	        },
	        y: {
	            show: true
	        }
	    }
	});
}

/**
 * pie chart function
 */

function splineChart2( _id, data, format, x_label, y_label, ticks, _avg){

	var height = ($(window).width() < 768) ? 350 : 450;

	var chart = c3.generate({
		bindto: '#'+_id,
	    data: {
        	columns: data,
        	type: 'spline'
	    },
	    axis : {
	    	x: {
	            
	        	label: {
	                text: x_label,
	                position: 'outer-center'
	            },
	            tick : {
	            	format : function(val){
	            		
	            		if( (val == 3) || (val == 9) || (val == 15) || (val == 21)){
	            			var hour = ticks[val+1];
			    			if( hour < 12){
			    				return parseInt(hour) + ' AM';
			    			}else{
			    				if( hour == '12'){
			    					return hour + ' PM';
			    				}else{
			    					return (parseInt(hour) - 12) + ' PM';	
			    				}
			    				
			    			}
	            		}
	            		
	            	}
	            },
	            padding: {
	            	right: 1,
	            	left: 1
	            }
	        },
	        y : {
	        	label: {
	                text: y_label,
	                position: 'outer-middle'
	            },
	            tick : {
	            	format: function (d) { 
						if( format == '$'){
							return format + " " + d;

						}else{
							return d + " "+format; 	
						}
						
					}
	            }
	        }
	    },
	    tooltip: {
	    	format: {
	    		title: function (x) { 
	    			var hour = ticks[x+1];
	    			if( hour < 12){
	    				return parseInt(hour) + ' AM';
	    			}else{
	    				if( hour == '12'){
	    					return hour + ' PM';
	    				}else{
	    					return (parseInt(hour) - 12) + ' PM';	
	    				}
	    			}
	    		}
			}
	    },
	    size:{
	    	height: height
	    },
	    color: {
	        pattern: ['#33CCCC', '#FF6633', '#086A87', '#0DA290', '#3fbf72', '#ff4949']
	    },
	    point: {
	    	focus: {
	    		r: 3
	    	},
			r: 3
		},
		grid: {
	        x: {
	            lines: [
	                {value: 3, class: 'label-5'},
	                {value: 9},
	                {value: 15},
	                {value: 21}
	            ]
	        },
	        y:{
	        	show: true,
	        	lines : [
	        		{value: 100, text: _avg, class: 'avg-line'}
	        	]
	        }
	    }
	});
}

/** 
 * combo chart function
 */

function comboChart( _id, chart1, chart2, data){

}

function stackedChart(_id, _values, _groups, cat, format){
	var chart = c3.generate({
	bindto: '#'+_id,
    data: {
        columns: _values,
        type: 'bar',
        groups: _groups
    },
    color: {
        pattern: ['#33CCCC', '#FF6633', '#086A87', '#0DA290', '#3fbf72', '#ff4949']
    },
    size:{
    	height: 450
    },
    axis : {
	    rotated: true,
	    x: {
            type: 'category',
            categories: cat,

        },
        y : {
        tick: {
				format: function (d) { 
					if( format == '%'){
						return d + " "+format; 	
					}else{
						return format + " " + d;
					}
					
				}
            }
        }

	},
    grid: {
    	x: {
            show: true
        },
        y: {
            lines: [{value:0}],
            show: true
        }
    }
});
}
var map, map_fukushima, map_tokyo;
var latlng = new google.maps.LatLng(36.597889,137.669678);
var circles=[];
var circles_fukushima=[];
var circles_tokyo=[];
var map_label;
var feedcount=0;
var curr_window = undefined;

var alert1css = 'position: absolute; left: -2px; top: -30px; ' +
                      'white-space: nowrap; ' +
                      'padding: 2px; background: url(marker0.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var alert2css = 'position: absolute; left: -2px; top: -30px; ' +
                      'white-space: nowrap; ' +
                      'padding: 2px; background: url(marker2.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var alert3css = 'position: absolute; left: -2px; top: -30px; ' +
                      'white-space: nowrap; ' +
                      'padding: 2px; background: url(marker2a.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var watercss = 'position: absolute; left: -2px; top: -30px; ' +
                      'white-space: nowrap; ' +
                      'padding: 2px; background: url(marker_water.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var alertdiv = 'position: absolute; display: none;';


function initialize() {
    var myOptions = {
      zoom: 7,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
        
    map_fukushima = new google.maps.Map(document.getElementById("map_canvas_fukushima"),
        {zoom:13, center: new google.maps.LatLng(37.423071,141.028061), mapTypeId: google.maps.MapTypeId.TERRAIN});

    map_tokyo = new google.maps.Map(document.getElementById("map_canvas_tokyo"),
        {zoom:10, center: new google.maps.LatLng(35.699686,139.743347), mapTypeId: google.maps.MapTypeId.TERRAIN});
	
    var fukushima = new google.maps.LatLng(37.425525,141.029434);
    
    var marker = new google.maps.Marker({
      position: fukushima,
      animation: google.maps.Animation.DROP,
      map: map, 
      title:"Fukushima Daiichi Nuclear Power Plant"
  	});  	
  	
  	// draw evacation area
  	
  	var evac_area = new google.maps.Circle({						
		map: map,
		center: fukushima,
		radius: 20000,
		fillOpacity: 0,
		strokeColor: '#ffffff',
		strokeOpacity: 0.8,
		strokeWeight: 3 
    });
  	var evac2_area = new google.maps.Circle({						
		map: map,
		center: fukushima,
		radius: 30000,
		fillOpacity: 0,
		strokeColor: '#ffffff',
		strokeOpacity: 0.5,
		strokeWeight: 3 
    });
	
  	var evac_area_f = new google.maps.Circle({						
		map: map_fukushima,
		center: fukushima,
		radius: 20000,
		fillOpacity: 0,
		strokeColor: '#ffffff',
		strokeOpacity: 0.8,
		strokeWeight: 3 
    });
  	var evac2_area_f = new google.maps.Circle({						
		map: map_fukushima,
		center: fukushima,
		radius: 30000,
		fillOpacity: 0,
		strokeColor: '#ffffff',
		strokeOpacity: 0.5,
		strokeWeight: 3 
    });

	var contentString = 'Fukushima Daiichi Nuclear Power Plant';
    var infowindow = new google.maps.InfoWindow({
    	content: contentString
	});

	google.maps.event.addListener(marker, 'click', function() {infowindow.open(map,marker);});
	

	map_label = new Label({
		map: map
	});
	map_label.span_.style.cssText = 'position: relative; left: 0%; ' +
                      'white-space: nowrap; ' +
                      'padding: 10px; color: white; text-shadow: 1px 1px 1px #888; font-size: 18px;';
	map_label.position = new google.maps.LatLng(34.714525,139.866943);
	map_label.text = "Loading geiger counter feeds...";	
  	
	$.ajax({
				url: "http://api.pachube.com/v2/feeds.json?key=dW1_5iByGtVAbVKe5hPTMdrVglDovcnVDgvqvZYsNB5VI-rfEdiZIhRb4voCw41m&tag=sensor:type%3Dradiation&lat=37.5&lon=137.5&distance=1000&per_page=110&page=1&order=created_at",
				//url: "http://api.pachube.com/v2/feeds.json?tag=sensor:type=radiation&lat=35&lon=139&distance=2000&per_page=100&key=dW1_5iByGtVAbVKe5hPTMdrVglDovcnVDgvqvZYsNB5VI-rfEdiZIhRb4voCw41m",
				dataType : 'jsonp',
				jsonp:'callback',
				timeout: 10000,
				data: "timezone=+9",
				success: process_json
	});
	$.ajax({
				url: "http://api.pachube.com/v2/feeds.json?key=dW1_5iByGtVAbVKe5hPTMdrVglDovcnVDgvqvZYsNB5VI-rfEdiZIhRb4voCw41m&tag=sensor:type%3Dradiation&lat=37.5&lon=137.5&distance=1000&per_page=110&page=2&order=created_at",
				//url: "http://api.pachube.com/v2/feeds.json?tag=sensor:type=radiation&lat=35&lon=139&distance=2000&per_page=100&key=dW1_5iByGtVAbVKe5hPTMdrVglDovcnVDgvqvZYsNB5VI-rfEdiZIhRb4voCw41m",
				dataType : 'jsonp',
				jsonp:'callback',
				timeout: 10000,
				data: "timezone=+9",
				success: process_json
	});
	$.ajax({
				url: "http://api.pachube.com/v2/feeds.json?key=dW1_5iByGtVAbVKe5hPTMdrVglDovcnVDgvqvZYsNB5VI-rfEdiZIhRb4voCw41m&tag=sensor:type%3Dradiation&lat=37.5&lon=137.5&distance=1000&per_page=110&page=3&order=created_at",
				//url: "http://api.pachube.com/v2/feeds.json?tag=sensor:type=radiation&lat=35&lon=139&distance=2000&per_page=100&key=dW1_5iByGtVAbVKe5hPTMdrVglDovcnVDgvqvZYsNB5VI-rfEdiZIhRb4voCw41m",
				dataType : 'jsonp',
				jsonp:'callback',
				timeout: 10000,
				data: "timezone=+9",
				success: process_json
	});

	google.maps.event.addListener(map, 'zoom_changed', function() {
		for (var i = 0; i < circles.length; i++) {
    		circles[i].setRadius(Math.max(Math.pow(Math.max((13-map.getZoom()),0),1.8)*300,200));//(Math.max((15000-(map.getZoom()-7)*4000),200));
    	}
	});
	google.maps.event.addListener(map_fukushima, 'zoom_changed', function() {
		for (var i = 0; i < circles_fukushima.length; i++) {
    		circles_fukushima[i].setRadius(Math.max(Math.pow(Math.max((13-map_fukushima.getZoom()),0),1.8)*300,200));
    	}
	});
	google.maps.event.addListener(map_tokyo, 'zoom_changed', function() {
		for (var i = 0; i < circles_tokyo.length; i++) {
    		circles_tokyo[i].setRadius(Math.max(Math.pow(Math.max((13-map_tokyo.getZoom()),0),1.8)*300,200));//(Math.max((15000-(map_tokyo.getZoom()-7)*4000),200));
    	}
	});

 }


function process_json(oJson) {

							//alert("Mapping " + oJson.results.length + " feeds <br/>");
							for (var i=0; i < oJson.results.length; i++) {
								var curr_feed = oJson.results[i];
								//map_label.set('text',"Mapping " + curr_feed.location.name + " <br/>");
								var streams = curr_feed.datastreams;
								if (streams == undefined || streams.length == 0) {
									continue;
								}
								if (streams[0].current_value == undefined) {
									continue;
								}
								var values = [];
								var contentString = "";
								if (streams[0].unit == undefined) {
									continue;
								}
								var stream_id = -1;
								for (var j = 0; j < streams.length; j++) {
									var curr_stream = streams[j];
									if (curr_stream.unit == undefined || curr_stream.current_value == undefined) {
										continue;
									}
									var symbol = "";
									if (curr_stream.unit.symbol == undefined) {
										symbol = new String(curr_stream.unit.label);
									} else {
										symbol = new String(curr_stream.unit.symbol);
									}
									//map_label.set('text',curr_feed.location.name + " " + symbol +"<br/>");
									var microSv = 0;
									var unit = " &#181;Sv per hour";
									if (symbol.indexOf("Sv/h") > -1 || symbol.indexOf("Sv/H") > -1) {
										microSv = new Number(parseFloat(curr_stream.current_value));
									} else if (symbol.indexOf("nGy/h") > -1) {
										microSv = new Number(parseFloat(curr_stream.current_value)/1000.0);
									} else if (symbol.indexOf("cpm") > -1 || symbol.indexOf("CPM") > -1) {
										if (curr_stream.tags != undefined && curr_stream.tags[0] != undefined && curr_stream.tags[0].indexOf("712") > -1) {
											microSv = new Number(parseFloat(curr_stream.current_value)*0.00233);									
										} else {
											microSv = new Number(parseFloat(curr_stream.current_value)/360);									
										}
									} else if (symbol.indexOf("kg") > -1) {
										microSv = new Number(parseFloat(curr_stream.current_value));
										unit = " " + symbol;
									} else {
										continue;
									}				
									//map_label.set('text',curr_feed.location.name + " " + microSv +"<br/>");
									if (curr_stream.tags != undefined) {
										contentString += "<b>Tag:</b> " + curr_stream.tags[0]+"<br/>";
									}
									contentString += "<b>Current reading:</b> " + microSv.toFixed(3) + unit;
									if (curr_stream.at != undefined) {
										var time = new String(curr_stream.at);
										time = time.replace("T", " ");  
										contentString += "&nbsp;<b>Time:</b> "+ time.substring(0,18);
									}
									if (microSv > 0) {
										values.push(microSv);
										contentString += "<br/>";
										stream_id = curr_stream.id;
									} else {
										contentString += "&nbsp;<i>(not counted)</i><br/>";
									}
								}
								if (values.length == 0) {
									continue;
								}
								feedcount++;
								var reading = median(values);
								var loc = new google.maps.LatLng(curr_feed.location.lat, curr_feed.location.lon);
								var title = "";
								if (curr_feed.location.exposure == undefined) {
								title = "<br/><i><small><small>"+curr_feed.title+"<br/>"+curr_feed.description+"</small></small></i>";
								} else {
								title = "<br/><i><small><b>Exposure: "+curr_feed.location.exposure+"</b><br/><small>"+curr_feed.title+". "+curr_feed.description+"</small></small></i>";
								}
								if (streams.length > 1) {
									//stream_id = -1;
								}
								if (curr_feed.location.name != undefined) {
									draw_label(map,reading, loc, contentString, title, curr_feed.location.name, unit, curr_feed.id, stream_id);
									draw_label(map_fukushima, reading, loc, contentString, title, curr_feed.location.name, unit, curr_feed.id, stream_id);
									draw_label(map_tokyo, reading, loc, contentString, title, curr_feed.location.name, unit, curr_feed.id, stream_id);
								}
								else if (curr_feed.location.name == undefined) {
									draw_label(map, reading, loc, contentString, title, "Japan", unit, curr_feed.id, stream_id);
									draw_label(map_fukushima, reading, loc, contentString, title, "Japan", unit, curr_feed.id, stream_id);
									draw_label(map_tokyo, reading, loc, contentString, title, "Japan", unit, curr_feed.id, stream_id);
								}
								//map_label.set('text',"Mapped " + curr_feed.location.name + " <br/>");
							}													
							map_label.set('text',"Live: " + feedcount + " locations<br/>");
}

function draw_label(thismap, reading, loc, content, title, loc_name, unit, id, stream_id) {
	var circle = new google.maps.Circle({						
		map: thismap,
		center: loc,
		radius: Math.max(Math.pow(Math.max((13-thismap.getZoom()),0),1.8)*300,200),//Math.max((15000-(thismap.getZoom()-7)*4000),200),
		fillOpacity: Math.min(reading/2, 0.7),
		fillColor: '#F34A45',
		strokeColor: '#F34A45',
		strokeOpacity: 0.8,
		strokeWeight: 1 
    }); 
    if (thismap == map) {
    	circles.push(circle);
    } else if (thismap == map_fukushima) {
    	circles_fukushima.push(circle);
    } else if (thismap == map_tokyo) {
    	circles_tokyo.push(circle);
    }
    var label = new Label({ map: thismap });
    var yeardose = new Number(reading*8760.0);
    yeardose = yeardose.toFixed(3);
    if (reading > 0.081) { // above avg
    	label.span_.style.cssText = alert1css;
    	//label.div_.style.cssText = alert1div;
    }  if (reading > 0.81) { // x10
    	label.span_.style.cssText = alert2css;
    	//label.div_.style.cssText = alert2div;
    }  if (reading > 8.1) {	// x100
   	 	label.span_.style.cssText = alert3css;
    	//label.div_.style.cssText = alert3div;
    }  if (unit.indexOf("kg") > -1) {
    	label.span_.style.cssText = watercss;
    }
    label.div_.style.cssText = alertdiv + "z-index:"+Math.round(6000-loc.lat()*100)+";";
    label.position = loc;
    if (unit.indexOf("kg") == -1) {
    label.set('text',reading.toFixed(3) + " &#181;Sv/h");
    } else {
    label.set('text',reading.toFixed(3) + unit);
    }
    var contentString = "<b>"+loc_name+"</b><br/>";
    contentString +=  "<br/>Median reading in this area is approximately<br/><b>" + reading.toFixed(3) + unit + "</b>";
    if (unit.indexOf("kg") == -1) {
    	contentString += " ( " + yeardose + " &#181;Sv per year )</b>";
    	var factor = reading/0.081;
    	var xray = reading/100.0;
    	contentString += "<br/><br/><b>"+factor.toFixed(5)+"</b><small><b>x</b> the average public space geiger reading for Japan (0.081 <i>&#181;Sv</i> per hour)<a href=\"http://notice.yahoo.co.jp/emg/en/archives/np_jp.html\">*</a></small>";
    	contentString += "<br/><b>"+reading.toFixed(3)+"</b><small><b>%</b> the radiation dose you would receive from a chest x-ray (100 <i>&#181;Sv</i>)<a href=\"http://www.radiologyinfo.org/en/info.cfm?pg=chestrad\">*</a></small>";
    }
    contentString += "<br/><br/><small>"+content+"</small>";
    if (stream_id != -1) {
    	contentString += "<br/><img src=\"http://www.pachube.com/feeds/"+id+"/datastreams/"+stream_id+"/history.png?r=3&w=400&h=150&s=1&b=true\" width=400 height=150> ";
    	//contentString += "<img src=\"http://www.pachube.com/feeds/"+id+"/datastreams/"+stream_id+"/history.png?r=3&w=200&h=180&s=2&b=true&t=Last%204%20Days\"  width=200 height=180>";
    }
    contentString += title;
    var window = new google.maps.InfoWindow({
    	content: contentString
	});
    circle.window = window;
	google.maps.event.addListener(circle, 'click', function(event) {this.window.setPosition(this.center);this.window.open(thismap)});
}

function median(ary) {
    if (ary.length == 0)
        return null;
    ary.sort(function (a,b){return a - b})
    var mid = Math.floor(ary.length / 2);
    if ((ary.length % 2) == 1)  // length is odd
    {
        return ary[mid];
        }
    else {
        return (Number(ary[mid - 1]) + Number(ary[mid])) / 2;
        }
}
var gm_maps = {};
var gm_map_labels = {};
var gm_circles = {};
var gm_map_options = [];
var gm_init_count = 0;
var gm_js_loaded = false;
var gm_maps_loaded = false;
var gm_registered_feeds = [];
var gm_feedcount = 0;
var gm_threshold = 0.081;

var alert1css = 'position: absolute; left: -2px; top: -30px; ' + 'white-space: nowrap; ' + 'padding: 2px; background: url(http://japan.failedrobot.com/marker0.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var alert2css = 'position: absolute; left: -2px; top: -30px; ' + 'white-space: nowrap; ' + 'padding: 2px; background: url(http://japan.failedrobot.com/marker2.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var alert3css = 'position: absolute; left: -2px; top: -30px; ' + 'white-space: nowrap; ' + 'padding: 2px; background: url(http://japan.failedrobot.com/marker2a.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var watercss = 'position: absolute; left: -2px; top: -30px; ' + 'white-space: nowrap; ' + 'padding: 2px; background: url(http://japan.failedrobot.com/marker_water.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
var alertdiv = 'position: absolute; display: none;';


function gm_init(obj) {
    if (obj != undefined) {
        gm_map_options.push(obj);
    }
}

function gm_loaded() {
    gm_js_loaded = true;
    gm_final_load();
}

function create_maps() {
    gm_maps_loaded = true;
    gm_final_load();
}

function gm_load_feeds(gm_load_feeds_options) {
    gm_registered_feeds = gm_registered_feeds.concat(gm_load_feeds_options.json);
}

function gm_final_load() {
    if (gm_js_loaded && gm_maps_loaded) {
        for (var i = 0; i < gm_map_options.length; i++) {
            var map = create_geigermap(gm_map_options[i]);
            var map_name = gm_map_options[i].map_name;
            google.maps.event.addListener(map, 'zoom_changed', function () {
                var circles = gm_circles[map_name];
                for (var i = 0; i < circles.length; i++) {
                    circles[i].setRadius(Math.max(Math.pow(Math.max((13 - map.getZoom()), 0), 1.8) * 300, 200));
                }
            });
            //alert("loaded map " + map_name);
        }


        for (var i = 0; i < gm_registered_feeds.length; i++) {
        	/**
            $.ajax({
                url: gm_registered_feeds[i],
                dataType: 'jsonp',
                jsonp: 'callback',
                timeout: 10000,
                data: "timezone=+9",
                success: gm_process_json
            });
            **/
            $.getJSON(gm_registered_feeds[i], gm_process_json);
        }
    }
    /**
     
     **/
}

function create_geigermap(options_obj) {
    var latlng = new google.maps.LatLng(36.597889, 137.669678);
    if (options_obj != undefined && options_obj.lat != undefined && options_obj.lng != undefined) {
        latlng = new google.maps.LatLng(options_obj.lat, options_obj.lng);
    }
    var map_div = "map_canvas";
    if (options_obj != undefined && options_obj.div != undefined) {
        map_div = options_obj.div;
    }
    var map_div_obj = document.getElementById(map_div);
    var map = new google.maps.Map(map_div_obj, {
        zoom: ((options_obj != undefined) ? ((options_obj.zoom != undefined) ? options_obj.zoom : 7) : 7),
        center: latlng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });


    gm_maps[options_obj.map_name] = map;

    var fukushima = new google.maps.LatLng(37.425525, 141.029434);

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
    
    if (options_obj.threshold) {
    	gm_threshold = parseFloat(options_obj.threshold);
    }

    if (options_obj.show_label) {
        var marker = new google.maps.Marker({
            position: fukushima,
            animation: google.maps.Animation.DROP,
            map: map,
            title: "Fukushima Daiichi Nuclear Power Plant"
        });

        var contentString = 'Fukushima Daiichi Nuclear Power Plant';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        gm_map_labels[options_obj.map_name] = new Label({
            map: map
        });
        gm_map_labels[options_obj.map_name].span_.style.cssText = 'position: relative; left: 0%; ' + 'white-space: nowrap; ' + 'padding: 10px; color: white; text-shadow: 1px 1px 1px #888; font-size: 18px;';
        gm_map_labels[options_obj.map_name].position = new google.maps.LatLng(34.714525, 139.866943);
        gm_map_labels[options_obj.map_name].text = "Loading geiger counter feeds...";
    }
    var geiger_div_obj = document.createElement("div");
    geiger_div_obj.style.backgroundColor = 'white';
    geiger_div_obj.style.opacity = 0.7;
    geiger_div_obj.style.marginBottom = '13px';
    geiger_div_obj.style.padding = '2px';
    geiger_div_obj.style.color = 'black';
    geiger_div_obj.style.fontSize = '10px';
    geiger_div_obj.style.lineHeight = '10px';
    geiger_div_obj.innerHTML = 'Geigermap powered by:  <a href="http://japan.failedrobot.com/" style="color: #3677f0;">failedrobot.com</a>';
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(geiger_div_obj);
	return map;
}

function gm_process_json(oJson) {
    for (var i = 0; i < oJson.results.length; i++) {
        var curr_feed = oJson.results[i];
        if (curr_feed.status != undefined && curr_feed.status == "frozen" && curr_feed.creator.indexOf("geiger_data") == -1 && curr_feed.creator.indexOf("kaku60") == -1 ) {
        	continue;
        }
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
            var microSv = 0;
            var unit = " &#181;Sv per hour";
            if (symbol.indexOf("Sv/h") > -1 || symbol.indexOf("Sv/H") > -1) {
                microSv = new Number(parseFloat(curr_stream.current_value));
            } else if (symbol.indexOf("nGy/h") > -1) {
                microSv = new Number(parseFloat(curr_stream.current_value) / 1000.0);
            } else if (symbol.indexOf("cpm") > -1 || symbol.indexOf("CPM") > -1) {
                if (curr_stream.tags != undefined && curr_stream.tags[0] != undefined && curr_stream.tags[0].indexOf("712") > -1) {
                    microSv = new Number(parseFloat(curr_stream.current_value) * 0.00233);
                } else {
                    //microSv = new Number(parseFloat(curr_stream.current_value) / 360);
                    continue;
                }
            } else if (symbol.indexOf("kg") > -1) {
                microSv = new Number(parseFloat(curr_stream.current_value));
                unit = " " + symbol;
            } else {
                continue;
            }
            if (curr_stream.tags != undefined) {
                contentString += "<b>Tag:</b> " + curr_stream.tags[0] + "<br/>";
            }
            contentString += "<b>Current reading:</b> " + microSv.toFixed(3) + unit;
            if (curr_stream.at != undefined) {
                var time = new String(curr_stream.at);
                time = time.replace("T", " ");
                contentString += "&nbsp;<b>Time:</b> " + time.substring(0, 18);
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
        gm_feedcount++;
        var reading = median(values);
        var loc = new google.maps.LatLng(curr_feed.location.lat, curr_feed.location.lon);
        var title = "";
        if (curr_feed.location.exposure == undefined) {
            title = "<br/><i><small><small>" + curr_feed.title + "<br/>" + curr_feed.description + " " + "<a href=\"http://www.pachube.com/feeds/"+curr_feed.id+"\" target=_new>"+curr_feed.feed + "</a></small></small></i>";
        } else {
            title = "<br/><i><small><b>Exposure: " + curr_feed.location.exposure + "</b><br/><small>" + curr_feed.title + ". " + curr_feed.description + " " + "<a href=\"http://www.pachube.com/feeds/"+curr_feed.id+"\" target=_new>"+curr_feed.feed + "</a></small></small></i>";
        }
        if (streams.length > 1) {}
        var loc_name = (curr_feed.location.name != undefined) ? curr_feed.location.name : "";
        for (var key in gm_maps) {
            gm_draw_label(gm_maps[key], reading, loc, contentString, title, curr_feed.location.name, unit, curr_feed.id, stream_id);
        }
    }
    for (var key in gm_map_labels) {
        gm_map_labels[key].set('text', "Live: " + gm_feedcount + " locations<br/>");
    }
}

function gm_draw_label(thismap, reading, loc, content, title, loc_name, unit, id, stream_id) {
    var circle = new google.maps.Circle({
        map: thismap,
        center: loc,
        radius: Math.max(Math.pow(Math.max((13 - thismap.getZoom()), 0), 1.8) * 300, 200),
        fillOpacity: Math.min(reading / 2, 0.7),
        fillColor: '#F34A45',
        strokeColor: '#F34A45',
        strokeOpacity: 0.8,
        strokeWeight: 1
    });
    for (var key in gm_maps) {
        if (gm_circles[key] == undefined) {
            gm_circles[key] = new Array();
        }
        gm_circles[key].push(circle);
    }
    var label = new Label({
        map: thismap
    });
    var yeardose = new Number(reading * 8760.0);
    yeardose = yeardose.toFixed(3);
    if (reading > gm_threshold) { // above avg
        label.span_.style.cssText = alert1css;
        //label.div_.style.cssText = alert1div;
    }
    if (reading > (gm_threshold*10.0)) { // x10
        label.span_.style.cssText = alert2css;
        //label.div_.style.cssText = alert2div;
    }
    if (reading > (gm_threshold*100.0)) { // x100
        label.span_.style.cssText = alert3css;
        //label.div_.style.cssText = alert3div;
    }
    if (unit.indexOf("kg") > -1) {
        label.span_.style.cssText = watercss;
    }
    label.div_.style.cssText = alertdiv + "z-index:" + Math.round(6000 - loc.lat() * 100) + ";";
    label.position = loc;
    if (unit.indexOf("kg") == -1) {
        label.set('text', reading.toFixed(3) + " &#181;Sv/h");
    } else {
        label.set('text', reading.toFixed(3) + unit);
    }
    var contentString = "<b>" + loc_name + "</b><br/>";
    contentString += "<br/>Median reading in this area is approximately<br/><b>" + reading.toFixed(3) + unit + "</b>";
    if (unit.indexOf("kg") == -1) {
        contentString += " ( " + yeardose + " &#181;Sv per year )</b>";
        var factor = reading /gm_threshold;
        var xray = reading / 100.0;
        if (gm_threshold == 0.081) {
        	contentString += "<br/><br/><b>" + factor.toFixed(5) + "</b><small><b>x</b> the average public space geiger reading for Japan (0.081 <i>&#181;Sv</i> per hour)<a href=\"http://notice.yahoo.co.jp/emg/en/archives/np_jp.html\">*</a></small>";
        	contentString += "<br/><b>" + reading.toFixed(3) + "</b><small><b>%</b> the radiation dose you would receive from a chest x-ray (100 <i>&#181;Sv</i>)<a href=\"http://www.radiologyinfo.org/en/info.cfm?pg=chestrad\">*</a></small>";
        }
    }
    contentString += "<br/><br/><small>" + content + "</small>";
    if (stream_id != -1) {
        contentString += "<br/><img src=\"http://www.pachube.com/feeds/" + id + "/datastreams/" + stream_id + "/history.png?r=3&w=400&h=150&s=1&b=true\" width=400 height=150> ";
        //contentString += "<img src=\"http://www.pachube.com/feeds/"+id+"/datastreams/"+stream_id+"/history.png?r=3&w=200&h=180&s=2&b=true&t=Last%204%20Days\"  width=200 height=180>";
    }
    contentString += title;
    var window = new google.maps.InfoWindow({
        content: contentString
    });
    circle.window = window;
    google.maps.event.addListener(circle, 'click', function (event) {
        this.window.setPosition(this.center);
        this.window.open(thismap)
    });
}

function median(ary) {
    if (ary.length == 0) return null;
    ary.sort(function (a, b) {
        return a - b
    })
    var mid = Math.floor(ary.length / 2);
    if ((ary.length % 2) == 1) // length is odd
    {
        return ary[mid];
    } else {
        return (Number(ary[mid - 1]) + Number(ary[mid])) / 2;
    }
}

/** GOOGLE ANALYTICS **/
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-8042966-4']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})(); /** GOOGLE ANALYTICS **/


/** LOAD OTHER SCRIPTS **/

function loadScript(sScriptSrc, callbackfunction) {
    //alert(sScriptSrc);
    //gets document head element  
    var oHead = document.getElementsByTagName('head')[0];
    if (oHead) {
        //creates a new script tag        
        var oScript = document.createElement('script');

        //adds src and type attribute to script tag  
        oScript.setAttribute('src', sScriptSrc);
        oScript.setAttribute('type', 'text/javascript');

        //calling a function after the js is loaded (IE)  
        var loadFunction = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    callbackfunction();
                }
            };
        oScript.onreadystatechange = loadFunction;

        //calling a function after the js is loaded (Firefox)  
        oScript.onload = callbackfunction;

        //append the script tag to document head element          
        oHead.appendChild(oScript);
    }
}

function load_label() {
    loadScript('http://japan.failedrobot.com/label.js', gm_loaded);
}
loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js', function () {
    loadScript('http://japan.failedrobot.com/jquery_csv.js', function () {
        loadScript("http://maps.google.com/maps/api/js?sensor=false&callback=load_label");
    });
});


/** LOAD OTHER SCRIPTS **/
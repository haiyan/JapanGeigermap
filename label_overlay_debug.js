
// Define the overlay, derived from google.maps.OverlayView
function Label(opt_options) {
 // Initialization
 this.setValues(opt_options);

 // Label specific
 var span = this.span_ = document.createElement('span');
 /**
 span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
                      'white-space: nowrap; border: 1px solid blue; ' +
                      'padding: 2px; background-color: white';**/
span.style.cssText = 'position: absolute; left: -2px; top: -30px; ' +
                      'white-space: nowrap; ' +
                      'padding: 2px; background: url(http://japan.failedrobot.com/marker.gif) no-repeat top left; font-size:11px;padding-bottom: 20px; padding-right: 15px; padding-top: 6px; padding-left: 5px;';
 var div = this.div_ = document.createElement('div');
 //div.appendChild(span);
 div.style.cssText = 'position: absolute; display: none;z-index: 1000;';
};
Label.prototype = new google.maps.OverlayView;

Label.prototype.onAdd = function() {
  var pane = this.getPanes().overlayImage;
  pane.appendChild(this.div_);


  // Ensures the label is redrawn if the text or position is changed.
  var me = this;
  this.listeners_ = [
    google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'visible_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'clickable_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'text_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'zindex_changed', function() { me.draw(); }),
    google.maps.event.addDomListener(this.div_, 'click', function() { 
      if (me.get('clickable')) {
        google.maps.event.trigger(me, 'click');
      }
    })
  ];
};

// Implement onRemove
Label.prototype.onRemove = function() {
 this.div_.parentNode.removeChild(this.div_);

 // Label is removed from the map, stop updating its position/text.
 for (var i = 0, I = this.listeners_.length; i < I; ++i) {
   google.maps.event.removeListener(this.listeners_[i]);
 }
};

// Implement draw
Label.prototype.draw = function() {
 var projection = this.getProjection();
 var position = projection.fromLatLngToDivPixel(this.get('position'));

 var div = this.div_;
 div.style.left = position.x + 'px';
 div.style.top = position.y + 'px';
 div.style.display = 'block';

  //var visible = this.get('visible');
  //div.style.display = visible ? 'block' : 'none';


  var clickable = this.get('clickable');
  //this.span_.style.cursor = clickable ? 'pointer' : '';
  this.style.cursor = clickable ? 'pointer' : '';


  //var zIndex = this.get('zIndex');
  //div.style.zIndex = zIndex;

 //this.span_.innerHTML = this.get('text').toString();
 this.innerHTML = this.get('text').toString();
};
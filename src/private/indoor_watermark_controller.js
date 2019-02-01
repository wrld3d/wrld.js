var IndoorWatermarkController = function(mapId, showWrldWatermark) {
  var _indoorWatermarkElement = null;
  var _elementId = "wrld-indoor-map-watermark" + mapId;
  var _urlRoot = "https://cdn-webgl.wrld3d.com/wrldjs/resources/indoor-vendors/";
  var _showWrldWatermark = showWrldWatermark;

  var _eegeoVenderKey = "eegeo";

  var _buildUrlForVendor = function(vendorKey) {
    var vendorKeyLower = vendorKey.toLowerCase();
    if (vendorKeyLower === _eegeoVenderKey)
    {
        vendorKeyLower = "wrld";
    }
    return _urlRoot + vendorKeyLower + "_logo.png";
  };

  var _precacheKnownVendors = function() {
    var knownVendors = [_eegeoVenderKey, "micello"];

    knownVendors.forEach(function(vendor) {
      var vendorImageUrl = _buildUrlForVendor(vendor);
      var tempImage = new Image();
      tempImage.src = vendorImageUrl;
    });
  };

  _precacheKnownVendors();

  this.showWatermarkForVendor = function(vendorKey) {

    if((vendorKey === _eegeoVenderKey) && 
        !_showWrldWatermark)
    {
      return;
    }

    var imageUrl = _buildUrlForVendor(vendorKey);

    if (_indoorWatermarkElement === null) {
      _indoorWatermarkElement = document.getElementById(_elementId);
    }

    _indoorWatermarkElement.src = imageUrl;
    _indoorWatermarkElement.style.bottom = 0;
  };

  this.hideWatermark = function() {
    if(_indoorWatermarkElement !== null)
    {
      _indoorWatermarkElement.style.bottom = "-50px";
    }
  };
};

module.exports = IndoorWatermarkController;
var IndoorWatermarkController = function(mapId) {
  var _indoorWatermarkElement = null;
  var _elementId = "wrld-indoor-map-watermark" + mapId;
  var _urlRoot = "https://cdn-webgl.wrld3d.com/wrldjs/resources/indoor-vendors/";

  var _buildUrlForVendor = function(vendorKey) {
    var vendorKeyLower = vendorKey.toLowerCase();
    if (vendorKeyLower === "eegeo")
    {
        vendorKeyLower = "wrld";
    }
    return _urlRoot + vendorKeyLower + "_logo.png";
  };

  var _precacheKnownVendors = function() {
    var knownVendors = ["eegeo", "micello"];

    knownVendors.forEach(function(vendor) {
      var vendorImageUrl = _buildUrlForVendor(vendor);
      var tempImage = new Image();
      tempImage.src = vendorImageUrl;
    });
  };

  _precacheKnownVendors();

  this.showWatermarkForVendor = function(vendorKey) {
    var imageUrl = _buildUrlForVendor(vendorKey);

    if (_indoorWatermarkElement === null) {
      _indoorWatermarkElement = document.getElementById(_elementId);
    }

    _indoorWatermarkElement.src = imageUrl;
    _indoorWatermarkElement.style.bottom = 0;
  };

  this.hideWatermark = function() {
    _indoorWatermarkElement.style.bottom = "-50px";
  };
};

module.exports = IndoorWatermarkController;
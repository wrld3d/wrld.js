var IndoorWatermarkController = function() {
  var _indoorWatermarkElement = null;
  var _elementId = "eegeo-indoor-map-watermark";
  var _urlRoot = "https://cdn-webgl.eegeo.com/eegeojs/resources/indoor-vendors/";

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
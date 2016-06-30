var HTMLMapContainer = function(parentElement, canvasId, canvasWidth, canvasHeight) {

    var _createDOMElement = function(parentElement, tagName, attributes, style) {
        var element = document.createElement(tagName);
        for (var attributeName in attributes) {
            element.setAttribute(attributeName, attributes[attributeName]);
        }
        for (var styleProperty in style) {
            element.style[styleProperty] = style[styleProperty];
        }
        parentElement.appendChild(element);
        return element;
    };

    var _createMapContainer = function(parentElement) {
        var style = {
            "position": "relative",
            "width": "100%",
            "height": "100%"
        };
        return _createDOMElement(parentElement, "div", { "class": "eegeo-map-container"}, style);
    };

    var _createLeafletOverlay = function(parentElement) {
        var attributes = {"class": "eegeo-leaflet-overlay"};
        var style = {
            "position": "absolute",
            "overflow": "hidden",
            "width": "100%",
            "height": "100%",
            "background": "transparent",
            "pointer-events": "none"
        };
        return _createDOMElement(parentElement, "div", attributes, style);
    };

    var _createCanvas = function(parentElement, canvasId, width, height) {
        var attributes = {
            "class": "eegeo-map-canvas",
            "id": canvasId,
            "oncontextmenu": "event.preventDefault();",
            "width": width.toString(),
            "height": height.toString()
        };
        var style = {
            "background-color": "black"
        };
        var canvas = _createDOMElement(parentElement, "canvas", attributes, style);

        // Fix for IE - onwheel is undefined, but is actually functional
        if (typeof canvas.onwheel === "undefined") {
            canvas.onwheel = null;
        }

        return canvas;
    };

    var _createLoadingSpinner = function(parentElement) {
        var style = {
            "position": "absolute",
            "width": "18px",
            "height": "18px",
            "z-index": "20",
            "background-image": "url('https://cdn-webgl.eegeo.com/eegeojs/resources/loading_spinner.png')"
        };
        return _createDOMElement(parentElement, "div", {}, style);
    };

    this.mapContainer = _createMapContainer(parentElement);
    this.loadingSpinnerIcon = _createLoadingSpinner(this.mapContainer);
    this.overlay = _createLeafletOverlay(this.mapContainer);
    this.canvas = _createCanvas(this.mapContainer, canvasId, canvasWidth, canvasHeight);

    this.loadingSpinner = new LoadingSpinner(this.loadingSpinnerIcon);
    this.loadingSpinner.startSpinning();

    this.onInitialised = function() {
        this.loadingSpinner.stopSpinning();
        this.loadingSpinnerIcon.parentNode.removeChild(this.loadingSpinnerIcon);
    };
};

var LoadingSpinner = function(domElement) {
    var _domElement = domElement;
    var _speed = 360;
    var _spinning = false;

    var spin = function(timestamp) {
        if (!_spinning) {
            return;
        }
        var timeInSeconds = (timestamp || 0) / 1000;
        var degrees = (timeInSeconds * _speed) % 360;
        _domElement.style["transform"] = "rotate(" + degrees + "deg)";
        window.requestAnimationFrame(spin);
    };

    this.startSpinning = function() {
        _spinning = true;
        spin();
    };

    this.stopSpinning = function() {
        _spinning = false;
    };
};

module.exports = HTMLMapContainer;
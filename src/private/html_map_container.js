import L from "leaflet";

export function HTMLMapContainer (browserDocument, browserWindow, parentElement, canvasId, canvasWidth, canvasHeight, backgroundColor, containerId, mapId) {

    var _browserWindow = browserWindow;
    var _browserDocument = browserDocument;

    var _createDOMElement = (parentElement, tagName, attributes, style) => {
        var element = _browserDocument.createElement(tagName);
        for (var attributeName in attributes) {
            element.setAttribute(attributeName, attributes[attributeName]);
        }
        for (var styleProperty in style) {
            element.style[styleProperty] = style[styleProperty];
        }
        parentElement.appendChild(element);
        return element;
    };

    var _createMapContainer = (parentElement) => {
        var attributes = {
            "class": "wrld-map-container",
            "id": containerId
        };
        var style = {
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "line-height": "0px",
            "padding": "0px",
            "margin": "0px",
            "overflow": "hidden",
            "cursor": "default"
        };
        var mapContainer = _createDOMElement(parentElement, "div", attributes, style);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".leaflet-dragging .wrld-map-container { cursor: move; cursor: -webkit-grabbing; cursor: -moz-grabbing; }";
        document.head.appendChild(css);

        mapContainer.onmousedown = (e) => {
            // Prevent middle-mouse scrolling on Windows
            if (e.button === 1) {
                return false;
            }
        };

        // Fix for IE - onwheel is undefined, but is actually functional
        if (typeof mapContainer.onwheel === "undefined") {
            mapContainer.onwheel = null;
        }

        return mapContainer;
    };

    var _createLeafletOverlay = (parentElement) => {
        var attributes = { "class": "wrld-leaflet-overlay" };
        var style = {
            "position": "absolute",
            "overflow": "hidden",
            "width": "100%",
            "height": "100%",
            "background": "transparent",
            "touch-action": "none"
        };
        return _createDOMElement(parentElement, "div", attributes, style);
    };

    var _createErrorMessage = (parentElement, messageText) => {
        var attributes = { "class": "wrld-error-message" };
        var style = {
            "position": "absolute",
            "left": "0px",
            "bottom": "0px",
            "line-height": "normal",
            "color": "white",
            "font-family": "sans-serif",
            "font-weight": "bold",
            "margin": "0.5em"
        };
        var errorMessage = _createDOMElement(parentElement, "div", attributes, style);
        errorMessage.textContent = messageText;
        return errorMessage;
    };

    var _createCanvas = (parentElement, canvasId, width, height, backgroundColor) => {
        var attributes = {
            "class": "wrld-map-canvas",
            "id": canvasId,
            "oncontextmenu": "event.preventDefault();",
            "width": width.toString(),
            "height": height.toString()
        };
        var style = {
            "background-color": backgroundColor
        };
        var canvas = _createDOMElement(parentElement, "canvas", attributes, style);

        return canvas;
    };

    var _createLoadingSpinner = (parentElement) => {
        var style = {
            "position": "absolute",
            "width": "18px",
            "height": "18px",
            "z-index": "20",
            "background-image": "url('https://cdn-webgl.wrld3d.com/wrldjs/resources/loading_spinner.png')"
        };
        return _createDOMElement(parentElement, "div", {}, style);
    };

    var _createIndoorMapWatermark = (parentElement) => {
        var attributes = {
            "id": "wrld-indoor-map-watermark" + mapId,
            "class": "wrld-indoor-map-watermark",
            "draggable": "false"
        };

        var style = {
            "position": "absolute",
            "z-index": "20",
            "display": "block",
            "margin": "auto auto 0 auto",
            "left": "0",
            "right": "0",
            "bottom": "-50px",
            "transition": "all 500ms"
        };

        return _createDOMElement(parentElement, "img", attributes, style);
    };

    this.mapContainer = _createMapContainer(parentElement);
    this.loadingSpinnerIcon = _createLoadingSpinner(this.mapContainer);
    this.overlay = _createLeafletOverlay(this.mapContainer);
    this.indoorMapWatermark = _createIndoorMapWatermark(this.mapContainer);
    this.canvas = _createCanvas(this.mapContainer, canvasId, canvasWidth, canvasHeight, backgroundColor);

    const mouseEventsToForward = [
        "mousedown",
        "mouseenter",
        "mouseleave",
        "mousemove",
        "mouseout",
        "mouseover",
        "mouseup"
    ];
    const pointerEventsToForward = [
        "pointercancel",
        "pointerdown",
        "pointerenter",
        "pointerleave",
        "pointermove",
        "pointerout",
        "pointerover",
        "pointerup"
    ];
    const touchEventsToForward = [
        "touchcancel",
        "touchend",
        "touchmove",
        "touchstart"
    ];

    const _eventToOptions = (event) => {
        // We can't use the event directly as we need to disable bubbling and that's read-only.
        // We can't use spread syntax as it omits properties implemented as a getter rather than a variable.
        // There are unreasonably many properties to explicitly list them.
        let options = {};
        for (let property in event) {
            options[property] = event[property];
        }
        return options;
    };

    for (const eventName of mouseEventsToForward) {
        this.overlay.addEventListener(eventName, event => {
            this.canvas.dispatchEvent(new MouseEvent(event.type, {
                ..._eventToOptions(event),
                bubbles: false
            }));
        });
    }
    for (const eventName of pointerEventsToForward) {
        this.overlay.addEventListener(eventName, event => {
            // Leaflet has a global capture-phase listener for pointer events which gets triggered before the element's callbacks even if bubbling is disabled.
            // We can't call the callbacks directly as we can't get at them.
            // We can't temporarily disable the Leaflet callback as it's wrapped in a temporary lambda.
            // Instead, just undo what the callback did.
            var hasOldValue = event.pointerId in L.DomEvent._pointers;
            var oldValue = hasOldValue ? L.DomEvent._pointers[event.pointerId] : undefined;
            var oldCount = L.DomEvent._pointersCount;
            this.canvas.dispatchEvent(new PointerEvent(event.type, {
                ..._eventToOptions(event),
                bubbles: false
            }));
            L.DomEvent._pointersCount = oldCount;
            if (hasOldValue) {
                L.DomEvent._pointers[event.pointerId] = oldValue;
            } else {
                delete L.DomEvent._pointers[event.pointerId];
            }
        });
    }
    for (const eventName of touchEventsToForward) {
        this.overlay.addEventListener(eventName, event => {
            this.canvas.dispatchEvent(new TouchEvent(event.type, {
                ..._eventToOptions(event),
                bubbles: false
            }));
        });
    }

    this.loadingSpinner = new LoadingSpinner(_browserWindow, this.loadingSpinnerIcon);
    this.loadingSpinner.startSpinning();

    this.onInitialized = () => {
        this.loadingSpinner.stopSpinning();
        this.loadingSpinnerIcon.parentNode.removeChild(this.loadingSpinnerIcon);
    };

    this.onError = (message) => {
        this.loadingSpinner.stopSpinning();
        _createErrorMessage(this.mapContainer, message);
    };

    this.width = () => {
        return this.mapContainer.clientWidth;
    };

    this.height = () => {
        return this.mapContainer.clientHeight;
    };

    this.onRemove = () => {
        if (this.mapContainer.parentElement) {
            this.mapContainer.parentElement.removeChild(this.mapContainer);
        }
    };
}

function LoadingSpinner (browserWindow, domElement) {
    var _browserWindow = browserWindow;
    var _domElement = domElement;
    var _speed = 360;
    var _spinning = false;

    var spin = (timestamp) => {
        if (!_spinning) {
            return;
        }
        var timeInSeconds = (timestamp || 0) / 1000;
        var degrees = (timeInSeconds * _speed) % 360;
        _domElement.style["transform"] = "rotate(" + degrees + "deg)";
        _browserWindow.requestAnimationFrame(spin);
    };

    this.startSpinning = () => {
        _spinning = true;
        spin();
    };

    this.stopSpinning = () => {
        _spinning = false;
    };
}

export default HTMLMapContainer;
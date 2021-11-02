
let onceInitializedCallbacks = [];

// The MapController is responsible for adding and removing POIs from the map.
class MapController {

    constructor(map) {
        this._map = map;
        this._cameraTransitioner = null;
        this._currentPopup = null;
        this._markersHaveAnchors = null;

        this.closePopup = this.closePopup.bind(this);

        this._updatePopupAnchor = this._updatePopupAnchor.bind(this);

        const pitchWhenMarkersHaveAnchors = 60;
        this._markersHaveAnchors = this._map.getCameraPitchDegrees() < pitchWhenMarkersHaveAnchors;

        // The map will tilt when you zoom out far enough, these are reposible for correctly repositioning the POI views.
        this._map.on("zoom", this._updatePopupAnchor);
        this._map.on("tilt", this._updatePopupAnchor);
        
        this._map.on("popupclose", () => {
            if (this._currentPopup && this._currentPopup.onCloseCallback) {
                this._currentPopup.onCloseCallback();
            }
        });

        onceInitializedCallbacks.forEach((callback => {
            callback();
        }));
        onceInitializedCallbacks = [];
    }

    onceInitialized(callback) {
        onceInitializedCallbacks.push(callback);
    }

    getMap() {
        return this._map;
    }

    measurePopup(popupContent, className) {
        let pixelBounds = this._map.getPixelBounds();
        let offscreenPopup = L.popup({className: className, offset: pixelBounds.getSize()})
                                .setLatLng(this._map.getCenter())
                                .setContent(popupContent);
        this._map.addLayer(offscreenPopup);
        let dims = { width: offscreenPopup._container.offsetWidth,
                     height: offscreenPopup._container.offsetHeight
                   };
        this._map.removeLayer(offscreenPopup);
        return dims;
    }

    addPopupWithOffsetForPois(location, contentElement) {
        const className = "eegeo-poi-view-popup" + (this._markersHaveAnchors ? " has-anchor" : "");
        let options = {
			elevation: location.elevation,
            maxWidth: 400,
            closeButton: false,
            autoPan: false,
            className: className
        };
        this._currentPopup = L.popup(options)
        .setLatLng(location.latLng)
        .setCloseWhenMovedOffscreen(true)
        .setContent(contentElement);
        let dims = this.measurePopup(contentElement, className);
        this._currentPopup.options.offset = [dims.width/2 + 22, dims.height/2];
        this._map.openPopup(this._currentPopup);
    }

    closePopup() {
        if (this._currentPopup) {
            this._map.closePopup(this._currentPopup);
            this._currentPopup = null;
        }
    }

    onMarkerPopupRemove(popup) {
        if (!popup) { return; }
        const popupContainer = popup._container;
        popupContainer.id = "";
    }

    _updatePopupAnchor(event) {
        const pitchWhenMarkersHaveAnchors = 60;
        const markersHaveAnchors = this._map.getCameraPitchDegrees() < pitchWhenMarkersHaveAnchors;
        if (this._markersHaveAnchors === markersHaveAnchors) { return; }
        this._markersHaveAnchors = markersHaveAnchors;

        let popupContainer = null;
        const popupContent = document.getElementById("eegeo-poi-card-popup");
        if (popupContent) {
            popupContainer = popupContent.parentElement.parentElement.parentElement;
        }
        else {
            popupContainer = document.getElementById("eegeo-marker-popup");
        }
        if (!popupContainer) { return; }
        $(popupContainer).addClass("animate-anchor");

        if (this._markersHaveAnchors) {
            $(popupContainer).addClass("has-anchor");
            $(popupContainer).bind("transitionend", () => {
                $(popupContainer).removeClass("animate-anchor");
            });
        }
        else {
            $(popupContainer).removeClass("has-anchor");
            $(popupContainer).bind("transitionend", () => {
                $(popupContainer).removeClass("animate-anchor");
            });
        }
    }
}


// MarkerController is reponsible for event handling such as moving to and opening the POI when selected.
class MarkerController {

    constructor(searchbar, markerController, mapController) {
        this._onPoiCardClickedCallback = null;

        this._eegeoPoiSourceIdMap = {};
        this._markerController = markerController;
        this._mapController = mapController;

        searchbar.on("searchresultselect", (event) => { this.goToResult(event); });
        searchbar.on("searchresultsupdate", (event)=> { this.updateMarkers(event) });
    }

    goToResult(event) {
        this._markerController.selectMarker(event.result.sourceId);
        this._mapController.getMap().setView(event.result.location.latLng, 15);
        this._openPoiView(event.result.resultId, event.result);
    }

    updateMarkers(event) {
        let markerIDs = this._markerController.getAllMarkerIds();
        for (var i = 0; i < markerIDs.length; ++i)
        {
            const marker = this._markerController.getMarker(markerIDs[i]);
            marker.on("click", () => {
                var id = marker.id;
                if(event.results[id])
                {
                    this._openPoiView(id, event.results[id]);
                }
            });
        }
    }

    _openPoiView(markerId, poi) {
        // Here we create our POI view from the poi data. You may want to add your own POI view here instead.
        const element = PoiViewContainer(poi, () => { this._mapController.closePopup(); });
        let location = poi.location;
        const marker = this._markerController.getMarker(markerId);

        if (marker) {
            marker.closePopup();
        }

         this._mapController.addPopupWithOffsetForPois(location, element);
        
        const options = {
            durationSeconds: 0.0,
            allowInterruption: true    
        }
    }
}

var MapMoveEvents = function(leafletMap) {
    
    var onMoveStart = function() {
        leafletMap.fire("movestart");
    };

    var onMove = function() {
        leafletMap.fire("move");
    };

    var onMoveEnd = function() {
        leafletMap.fire("moveend");
    };

    this.setEventCallbacks = function(cameraApi) {
        cameraApi.setMoveStartCallback(onMoveStart);
        cameraApi.setMoveCallback(onMove);
        cameraApi.setMoveEndCallback(onMoveEnd);
    };
};
module.exports = MapMoveEvents;
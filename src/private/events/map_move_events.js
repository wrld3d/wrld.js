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

    var onDragStart = function() {
        leafletMap.fire("dragstart");
    };

    var onDrag = function() {
        leafletMap.fire("drag");
    };

    var onDragEnd = function() {
        leafletMap.fire("dragend");
    };

    var onZoomStart = function() {
        leafletMap.fire("zoomstart");
    };

    var onZoomEnd = function() {
        leafletMap.fire("zoomend");
    };

    this.setEventCallbacks = function(cameraApi) {
        cameraApi.setMoveStartCallback(onMoveStart);
        cameraApi.setMoveCallback(onMove);
        cameraApi.setMoveEndCallback(onMoveEnd);
        cameraApi.setDragStartCallback(onDragStart);
        cameraApi.setDragCallback(onDrag);
        cameraApi.setDragEndCallback(onDragEnd);
        cameraApi.setZoomStartCallback(onZoomStart);
        cameraApi.setZoomEndCallback(onZoomEnd);
    };
};
module.exports = MapMoveEvents;
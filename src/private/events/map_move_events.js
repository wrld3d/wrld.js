var MapMoveEvents = function(leafletMap) {

    var _eventType = [
        "move",
        "movestart",
        "moveend",
        "drag",
        "dragstart",
        "dragend",
        "pan",
        "panstart",
        "panend",
        "rotate",
        "rotatestart",
        "rotateend",
        "tilt",
        "tiltstart",
        "tiltend",
        "zoomstart",
        "zoomend",
    ];

    var _onEvent = function(eventKey) {
        leafletMap.fire(_eventType[eventKey]);
    }

    this.setEventCallbacks = function(cameraApi) {
        cameraApi.setEventCallback(_onEvent);
    };
};
module.exports = MapMoveEvents;
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
        "zoom",
        "zoomstart",
        "zoomend",
        "transitionstart",
        "transitionend"
    ];

    var _onEvent = function(eventKey) {
        if (typeof _eventType[eventKey] === undefined) {
            return;
        }
        leafletMap.fire(_eventType[eventKey]);
    };

    this.setEventCallbacks = function(cameraApi) {
        cameraApi.setEventCallback(_onEvent);
    };
};
module.exports = MapMoveEvents;
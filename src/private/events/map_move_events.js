export function MapMoveEvents (leafletMap) {

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

    var _onEvent = (eventKey) => {
        if (typeof _eventType[eventKey] === undefined) {
            return;
        }
        leafletMap.fire(_eventType[eventKey]);
    };

    this.setEventCallbacks = (cameraApi) => {
        cameraApi.setEventCallback(_onEvent);
    };
}

export default MapMoveEvents;
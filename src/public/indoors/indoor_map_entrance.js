export function IndoorMapEntrance (indoorMapId, indoorMapName, latLng) {
    var _indoorMapId = indoorMapId;
    var _indoorMapName = indoorMapName;
    var _latLng = latLng;

    this.getIndoorMapId = () => _indoorMapId;

    this.getIndoorMapName = () => _indoorMapName;

    this.getLatLng = () => _latLng;
}

export default IndoorMapEntrance;

export function IndoorMapEntity (indoorMapEntityId, indoorMapFloorId, position, outline) {
    var _indoorMapEntityId = indoorMapEntityId;
    var _indoorMapFloorId = indoorMapFloorId;
    var _position = position;
    var _outline = outline;

    this.getIndoorMapEntityId = () => _indoorMapEntityId;

    this.getIndoorMapFloorId = () => _indoorMapFloorId;

    this.getPosition = () => _position;

    this.getOutline = () => _outline;
}

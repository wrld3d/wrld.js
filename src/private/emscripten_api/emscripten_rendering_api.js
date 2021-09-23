import { Vector3 } from "../../public/space";
import { colorToRgba32 } from "./emscripten_interop_utils.js";

export function EmscriptenRenderingApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _renderingApi_SetMapCollapsed = cwrap("renderingApi_SetMapCollapsed", null, ["number", "number"]);
    var _renderingApi_SetClearColor = cwrap("renderingApi_SetClearColor", null, ["number", "number"]);
    var _renderingApi_GetCameraRelativePosition = cwrap("renderingApi_GetCameraRelativePosition", null, ["number", "number", "number", "number", "number", "number"]);
    var _renderingApi_GetCameraProjectionMatrix = cwrap("renderingApi_GetCameraProjectionMatrix", null, ["number", "number", "number"]);
    var _renderingApi_GetCameraOrientationMatrix = cwrap("renderingApi_GetCameraOrientationMatrix", null, ["number", "number", "number"]);
    var _renderingApi_GetLightingData = cwrap("renderingApi_GetLightingData", null, ["number", "number", "number"]);
    var _renderingApi_GetNorthFacingOrientationMatrix = cwrap("renderingApi_GetNorthFacingOrientationMatrix", null, ["number", "number", "number", "number", "number"]);


    this.setMapCollapsed = (isMapCollapsed) => {
        _renderingApi_SetMapCollapsed(_emscriptenApiPointer, isMapCollapsed ? 1 : 0);
    };

    this.setClearColor = (clearColor) => {
        var clearColorRGBA32 = colorToRgba32(clearColor);
        _renderingApi_SetClearColor(_emscriptenApiPointer, clearColorRGBA32);
    };

    this.getCameraRelativePosition = (latLng) => {
        var renderPosition = new Array(3);
        _emscriptenMemory.passDoubles(renderPosition, (resultArray, arraySize) => {
            _renderingApi_GetCameraRelativePosition(_emscriptenApiPointer, latLng.lat, latLng.lng, latLng.alt || 0.0, arraySize, resultArray);
            renderPosition = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return new Vector3(renderPosition);
    };

    this.getNorthFacingOrientationMatrix = (latLng) => {
        var orientation = new Array(16);
        _emscriptenMemory.passDoubles(orientation, (resultArray, arraySize) => {
            _renderingApi_GetNorthFacingOrientationMatrix(_emscriptenApiPointer, latLng.lat, latLng.lng, arraySize, resultArray);
            orientation = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return orientation;
    };

    this.getCameraProjectionMatrix = () => {
        var projection = new Array(16);
        _emscriptenMemory.passDoubles(projection, (resultArray, arraySize) => {
            _renderingApi_GetCameraProjectionMatrix(_emscriptenApiPointer, arraySize, resultArray);
            projection = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return projection;
    };

    this.getCameraOrientationMatrix = () => {
        var orientation = new Array(16);
        _emscriptenMemory.passDoubles(orientation, (resultArray, arraySize) => {
            _renderingApi_GetCameraOrientationMatrix(_emscriptenApiPointer, arraySize, resultArray);
            orientation = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return orientation;
    };

    this.getLightingData = () => {
        var lightingData = new Array(21);
        _emscriptenMemory.passDoubles(lightingData, (resultArray, arraySize) => {
            _renderingApi_GetLightingData(_emscriptenApiPointer, arraySize, resultArray);
            lightingData = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });

        var lighting = {
            key: {
                direction: new Vector3(lightingData[0], lightingData[1], lightingData[2]),
                color: new Vector3(lightingData[9], lightingData[10], lightingData[11])
            },
            back: {
                direction: new Vector3(lightingData[3], lightingData[4], lightingData[5]),
                color: new Vector3(lightingData[12], lightingData[13], lightingData[14])
            },
            fill: {
                direction: new Vector3(lightingData[6], lightingData[7], lightingData[8]),
                color: new Vector3(lightingData[15], lightingData[16], lightingData[17])
            },
            ambient: {
                color: new Vector3(lightingData[18], lightingData[19], lightingData[20])
            }
        };
        return lighting;
    };
}

export default EmscriptenRenderingApi;

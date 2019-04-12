var space = require("../../public/space");

function vec4ToRgba32(v) {
    var rgba = ((v.x & 0xFF) << 24) + ((v.y & 0xFF) << 16) + ((v.z & 0xFF) << 8) + (v.w & 0xFF);
    return rgba;
}

function hexToRgba32(hex) {
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    hex = hex.replace(/^#/, "");
    var a = 0xff;
    if (hex.length === 8) {
        a = parseInt(hex.slice(6, 8), 16) & 0xff;
    }
    else if (hex.length === 4) {
        a = parseInt(hex.slice(3, 4).repeat(2), 16) & 0xff;
    }

    var rgb = 0xffffff;
    if (hex.length === 6 || hex.length === 8) {
        rgb = parseInt(hex.substring(0, 6), 16) & 0xffffff;
    }
    else if (hex.length === 3 || hex.length === 4) {
        rgb = parseInt((hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2)), 16) & 0xffffff;
    }

    return (rgb << 8) + a;
}

function colorToRgba32(color) {
    if (typeof(color) === "string") {
        return hexToRgba32(color);
    }
    else {
        var v = new space.Vector4(color);
        return vec4ToRgba32(v);
    }
}

module.exports = {
    colorToRgba32: colorToRgba32
};

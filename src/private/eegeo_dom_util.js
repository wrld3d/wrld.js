var tinyRotationString = " rotate(0.0001deg)";

var EegeoDomUtil = {
    setPositionSmooth: function(el, point, disable3D) {
        L.DomUtil.setPosition(el, point, disable3D);

        if (!disable3D && L.Browser.any3d) {
            el.style[L.DomUtil.TRANSFORM] += tinyRotationString;
        }
    }
};
module.exports = EegeoDomUtil;
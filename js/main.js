var map = L.eeGeo.map("map", "9ce4509b3e6dc7ed2c936a6cfb89217e");

document.getElementById("doShader").onclick = function doShader() {
    map.createShaderPair();
}


      window.map = L.eeGeo.map("map", "9ce4509b3e6dc7ed2c936a6cfb89217e");

          function doShader() {
            var shaderStatus = document.getElementById("shader-status");

            shaderStatus.innerHTML = "Shader Compile Status";
            shaderStatus.className = "bg-primary";

            var vertexCode = document.getElementById("vertex-code").value;
            var fragCode = document.getElementById("fragment-code").value;
            var uniforms = document.getElementById("uniforms-list").value;
            var samplers = document.getElementById("samplers-list").value;

            window.map.createShaderPair(vertexCode, fragCode, uniforms, samplers);
          }

          function applyBuildings() {
            window.map.applyShadersToBuildings();
          }

          function applyTerrain() {
            window.map.applyShadersToTerrain();
          }

          function applyTransport() {
            window.map.applyShadersToTransport();
          }

          function shaderChanged() {
            var shaderStatus = document.getElementById("shader-status");

            if (shaderStatus.className == "bg-success") {
              shaderStatus.innerHTML = "Shader Compile Status";
              shaderStatus.className = "bg-primary";
            }
          }
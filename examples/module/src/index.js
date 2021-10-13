import Wrld from "wrld.js";

const apiKey = "YOUR_API_KEY";

const center = Wrld.latLng(53, 24);

const map = Wrld.map("map", apiKey, { center });

Wrld.marker(center, { title: "Hello, WRLD" }).addTo(map);

Wrld.popup({ autoClose: false })
  .setLatLng(center)
  .setContent("Hello, WRLD!")
  .addTo(map);

Wrld.polyline([
  [53, 24],
  [53, 24.001],
  [53.001, 24],
  [53, 24],
]).addTo(map);

Wrld.native
  .polygon(
    [
      [53, 24, 10],
      [53, 24.001, 11],
      [53.001, 24, 12],
    ],
    { elevation: 10 }
  )
  .addTo(map);

import L from "leaflet";
import * as Wrld from "./wrld";

// For compatibility with eeGeoWebGL we need L.Wrld present
window.L["Wrld"] = Wrld;

// The default image path is broken when using Browserify - it searches the script tags on the page
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.0.1/dist/images/";

export default Wrld;

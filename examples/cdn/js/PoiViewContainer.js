const getPoiHtmlView = (poiData) => {
   const htmlView = createDivWithClassName("poi-view-html-container");
   if (poiData.user_data.custom_view_height !== undefined) {
    htmlView.style.height = poiData.user_data.custom_view_height + "px";
   }
   const frameElement = document.createElement("iframe");
   frameElement.src = poiData.user_data.custom_view;
   frameElement.frameBorder = "0";
   frameElement.className = "poi-view-html";
   frameElement.scrolling="no";
   htmlView.appendChild(frameElement);
   return htmlView;
};

const shouldShowPoiViewDetails = (poiData) => {
  return (poiData.user_data.address
  || poiData.user_data.phone
  || poiData.user_data.web
  || poiData.user_data.email
  || poiData.user_data.facebook
  || poiData.user_data.twitter);
};

// This is where we construct the POI view, the style is defined in our style.css.
const PoiViewContainer = (poi, hidePoiCallback) => {
  if (poi.data.user_data === undefined) {
    poi.data.user_data = {};
  }
  const outerElement = createDivWithClassName("poi-view-popup");
  outerElement.id = "eegeo-poi-card-popup";
  const headerElement = addDivWithClassName("poi-view-content", outerElement);
  headerElement.appendChild(getPoiViewHeader(poi, hidePoiCallback));
  var bodyElement = addDivWithClassName("poi-view-content scrollable", outerElement);

  // Here we check if we have a custom view and then add it to our POI.
  if (poi.data.user_data.custom_view) {
    bodyElement.appendChild(getPoiHtmlView(poi.data));
    let mapContainerHeight = document.getElementById("map").clientHeight;
    bodyElement.style.maxHeight = (mapContainerHeight-150) + "px";
    
  } else if (poi.data.user_data.image_url) {
    const columnElement = addDivWithClassName("poi-view-content-column", bodyElement);
    const imageElement = getPoiViewImage(poi.data.user_data.image_url, poi.source === "yelp");
    columnElement.appendChild(imageElement);
    let mapContainerHeight = document.getElementById("map").clientHeight;
    bodyElement.style.maxHeight = (mapContainerHeight-150) + "px"; 
    bodyElement = columnElement;

    const customHeight = poi.data.user_data.custom_view_height;
    
    if (customHeight !== undefined) {
      bodyElement.style.height = customHeight + "px";
    }
  }
  if (shouldShowPoiViewDetails(poi.data)) {
    bodyElement.appendChild(getPoiViewDetails(poi.data));
  }
  const tags = getPoiViewTags(poi.tags);
  if (tags) {
    bodyElement.appendChild(tags);
  }
  const desc = getPoiViewDescription(poi.data); 
  if (desc) {
    bodyElement.appendChild(desc);
  }
  
  return outerElement;
};


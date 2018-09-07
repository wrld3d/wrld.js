const getPoiViewDescription = (poiData) => {
  if (poiData.subtitle || poiData.user_data.description) {
    let descContainer = createDivWithClassName("poi-view-description-container");
    if (poiData.subtitle) {
      addDivWithClassName("subtitle-text", descContainer, poiData.subtitle);
    }
    if (poiData.user_data.description) {
      addDivWithClassName("description-text", descContainer, poiData.user_data.description);
    }
    return descContainer;
  }
};

let addLinkElement = (className, parent, href, target) => {
  let linkElt = createElementWithClassName("a", className);
  linkElt.href = ensureProtocolInUrl(href);
  linkElt.target = target;
  parent.appendChild(linkElt);
  return linkElt;
};

// This method takes the POI Data and populates our POI view.
const getPoiViewDetails = (poiData) => {
  let detailContainer = createDivWithClassName("poi-view-details");
  if (poiData.user_data.address) {
    addDivWithClassName("address-text", detailContainer, poiData.user_data.address);
  }
  if (poiData.user_data.phone) {
    addDivWithClassName("phone-text", detailContainer, poiData.user_data.phone);
  }
  if (poiData.user_data.web){
    let linkElt = addLinkElement("web-text", detailContainer, ensureProtocolInUrl(poiData.user_data.web), "_blank");
    let divText = document.createTextNode(poiData.user_data.web);
    linkElt.appendChild(divText); 
  }
  if (poiData.user_data.email || poiData.user_data.facebook || poiData.user_data.twitter) {
    let linkDiv = addDivWithClassName("link-icons", detailContainer);
    if (poiData.user_data.email) {
      addLinkElement("email-icon", linkDiv, "mailto:" + poiData.user_data.email);
    }
    if (poiData.user_data.facebook) {
      addLinkElement("facebook-icon", linkDiv, formatUrl(poiData.user_data.facebook, "facebook.com", "www.facebook.com/", true), "_blank");
    }
    if (poiData.user_data.twitter) {
      addLinkElement("twitter-icon", linkDiv, formatUrl(poiData.user_data.twitter, "twitter.com", "twitter.com/", true), "_blank");
    }
    detailContainer.appendChild(linkDiv);
  }
  return  detailContainer;
};

const getPoiViewHeader = (poiData, hidePoiCallback) => {
  let baseUrl = "https://cdn-webgl.wrld3d.com/wrld-search/latest/";
  const iconKey = poiData.iconKey;
  const iconUrl = baseUrl + "assets/js/icon1_" + iconKey + ".png";
  const headerElement = createDivWithClassName("poi-view-header");
  const iconElement = addDivWithClassName("tag-icon", headerElement);
  iconElement.style.backgroundImage = "url(" + iconUrl + ")";
  const buttonElement = createButtonWithClassName("close-button");
  buttonElement.onclick = hidePoiCallback;
  headerElement.appendChild(buttonElement);
  addDivWithClassName("title-text", headerElement, poiData.title);
  return headerElement;
};

const getPoiViewTags = (tags) => {
  if (tags && tags.length > 0) {
    let tagsDiv = createDivWithClassName("poi-view-tags");
    let divText = document.createTextNode(tags.join(", "));
    tagsDiv.appendChild(divText);
    return tagsDiv;
  }
  return null;
};

const getPoiViewImage = (url, isYelp) => {
  const imageUrl = (url && isYelp) ? url.replace(/\/ms.jpg$/, "/348s.jpg") : url;
  let imageContainer = createDivWithClassName("poi-view-image-container");
  let imageDiv = addDivWithClassName("poi-view-image", imageContainer);
  if (imageUrl) {
    imageDiv.style.backgroundImage = "url(" + imageUrl + ")";
  }
  return imageContainer;
};
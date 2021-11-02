const createElementWithClassName = (elt, className) => {
  const divElement = document.createElement(elt);
  divElement.className = className;
  return divElement;
};

const createButtonWithClassName = (className) => {
  const buttonElement = createElementWithClassName("button", className);
  return buttonElement;
};

const createDivWithClassName = (className) => {
  return createElementWithClassName("div", className);
};

const createInputWithClassName = (className) => {
  return createElementWithClassName("input", className);
};

const addButtonWithClassName = (className, parent, onClickCallback, text) => {
  const buttonElement = createButtonWithClassName(className);
  buttonElement.onclick = onClickCallback;
  if (text) {
    buttonElement.innerHTML = text;
  }
  parent.appendChild(buttonElement);
  return buttonElement;
};

const addDivWithClassName = (className, parent, text) => {
  const divElement = createDivWithClassName(className);
  if (text) {
    const divText = document.createTextNode(text);
    divElement.appendChild(divText);
  }
  parent.appendChild(divElement);
  return divElement;
};

const addTextInputWithClassName = (className, parent) => {
  const textInputElement = createInputWithClassName(className);
  textInputElement.type = "text";
  parent.appendChild(textInputElement);
  return textInputElement;
};

const ensureProtocolInUrl = (url, https = false) => {
  if (url.search("https://") === 0 || url.search("http://") === 0 || url.search("mailto:") === 0) {
    return url;
  }
  return https ? "https://" + url : "http://" + url;
};

const formatUrl = (url, strToFind, toPrefix, https = false) => {
  if (url.search(strToFind) === -1) {
    url = toPrefix + url;
  }
  return ensureProtocolInUrl(url, https);
};
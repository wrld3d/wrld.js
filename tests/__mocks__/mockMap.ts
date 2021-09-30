import Map from "../../src/types/map";

import Wrld from "../../src/wrld";

export const createMockMap = (): Map => {
  const element = document.createElement("div");
  const apiKey = "testApiKey";
  document.body.appendChild(element);
  return Wrld.map(element, apiKey);
};

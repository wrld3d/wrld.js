import Wrld from "../../src/";

export const createMockMap = (): Wrld.Map => {
  const element = document.createElement("div");
  const apiKey = "testApiKey";
  document.body.appendChild(element);
  return Wrld.map(element, apiKey);
};

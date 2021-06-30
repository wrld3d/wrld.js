import { Map } from "../../../types";

import Wrld from "../../wrld";

export const createMockMap = (): Map => {
  const element = document.createElement("div");
  const apiKey = "testApiKey";
  document.body.appendChild(element);
  return Wrld.map(element, apiKey);
};

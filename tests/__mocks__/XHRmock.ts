export const createXHRmock = (xhrMock: Partial<XMLHttpRequest>) => {
  jest.spyOn(window, "XMLHttpRequest").mockImplementation(() => xhrMock as XMLHttpRequest);
  return xhrMock;
};

import "../../../src";
import RoutingModule from "../../../src/private/modules/routing_module";

import { createXHRmock } from "../../__mocks__/XHRmock";

it("correctly executes a getRoute() request", (done) => {
  const xhrMock = createXHRmock({
    responseText,
    open: jest.fn(),
    send: jest.fn(),
  });

  const mockIndoorsModule = { on: () => {} };
  const routingModule = new RoutingModule("api-key", mockIndoorsModule);

  const startPoint = [-2.978629, 56.46024, 0];
  const endPoint = [-2.9783117, 56.4600344, 2];

  routingModule.getRoute(
    [startPoint, endPoint],
    (_routes: any[]) => {
      expect(_routes).toEqual(JSON.parse(routes));
      done();
    },
    () => {
      throw new Error("Whoops");
    }
  );

  expect(xhrMock.open).toBeCalledWith(
    "GET",
    "https://routing.wrld3d.com/v1/route?loc=-2.978629,56.46024,0%3B-2.9783117,56.4600344,2&apikey=api-key&limit=400&travelmode=walking",
    true
  );

  expect(xhrMock.send).toBeCalledWith();

  (xhrMock as XMLHttpRequest).onload(new ProgressEvent(""));
});

it("cancels a request when exiting the building", () => {
  const xhrMock = createXHRmock({
    open: jest.fn(),
    send: jest.fn(),
    abort: jest.fn(),
  });

  let onAbort;
  const mockIndoorsModule = {
    on: (_, _onAbort) => {
      onAbort = _onAbort;
    },
  };
  const routingModule = new RoutingModule("api-key", mockIndoorsModule);

  routingModule.getRoute([]);

  onAbort(); // simulates a "indoormapexit" event

  expect(onAbort).toBeInstanceOf(Function);
  expect(xhrMock.abort).toBeCalled();
});

const responseText = `{"code":"Ok","type":"multipart","routes":[{"code":"Ok","routes":[{"geometry":{"coordinates":[[-2.978629,56.46024],[-2.978621,56.460216],[-2.978658,56.460213],[-2.978577,56.460224],[-2.97852,56.46006],[-2.978324,56.460079],[-2.978311,56.460034]],"type":"LineString"},"legs":[{"annotation":{"datasources":[0,0,0,0,0,0,0,0,0,0,0,0],"nodes":[238358,238359,238361,238356,238357,238369,238370,238371,238372,238373,238374,238375,238376],"duration":[0,2,1.7,22,2.1,1.6,6.2,7.2,3.2,2.9,2.7,3.6],"distance":[0,2.714326,2.298162,0,2.922416,2.229793,8.59168,9.983514,4.45954,3.989306,3.793117,5.068542]},"summary":"{level:multiple}{type:elevator}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}, {level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","duration":55.2,"steps":[{"intersections":[{"out":0,"entry":[true],"bearings":[0],"location":[-2.978629,56.46024]}],"geometry":{"coordinates":[[-2.978629,56.46024],[-2.978629,56.46024]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":0,"bearing_before":0,"location":[-2.978629,56.46024],"type":"depart"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":0,"name":"{level:0}{type:entrance}{entrance}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0},{"intersections":[{"out":0,"in":0,"entry":[true,true,false],"bearings":[210,315,345],"location":[-2.978629,56.46024]}],"geometry":{"coordinates":[[-2.978629,56.46024],[-2.978621,56.460216],[-2.978658,56.460213]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":170,"bearing_before":0,"location":[-2.978629,56.46024],"modifier":"right","type":"new name"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":3.7,"name":"{level:0}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":5},{"intersections":[{"out":0,"in":1,"entry":[true,false],"bearings":[0,30],"location":[-2.978658,56.460213]}],"geometry":{"coordinates":[[-2.978658,56.460213],[-2.978658,56.460213]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":0,"bearing_before":262,"location":[-2.978658,56.460213],"modifier":"straight","type":"new name"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":22,"name":"{level:multiple}{type:elevator}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0},{"intersections":[{"out":1,"in":1,"entry":[false,true],"bearings":[0,75],"location":[-2.978658,56.460213]},{"out":0,"in":1,"entry":[true,false,true],"bearings":[150,255,315],"location":[-2.978611,56.460217]}],"geometry":{"coordinates":[[-2.978658,56.460213],[-2.978611,56.460217],[-2.978577,56.460224],[-2.978552,56.460148],[-2.97852,56.46006],[-2.978448,56.460065],[-2.978384,56.460071],[-2.978324,56.460079],[-2.978311,56.460034]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":81,"bearing_before":0,"location":[-2.978658,56.460213],"modifier":"straight","type":"new name"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":29.5,"name":"{level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":41},{"intersections":[{"in":0,"entry":[true],"bearings":[351],"location":[-2.978311,56.460034]}],"geometry":{"coordinates":[[-2.978311,56.460034]],"type":"Point"},"mode":"walking","maneuver":{"bearing_after":0,"bearing_before":171,"location":[-2.978611,56.460217],"type":"arrive"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":0,"name":"{level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0}],"distance":46.1}],"duration":55.2,"distance":46.1},{"geometry":{"coordinates":[[-2.978629,56.46024],[-2.978666,56.460237],[-2.978678,56.460272],[-2.978685,56.460239],[-2.978694,56.460268],[-2.978684,56.460234],[-2.978616,56.460244],[-2.978611,56.460217],[-2.978577,56.460224],[-2.97852,56.46006],[-2.978324,56.460079],[-2.978311,56.460034]],"type":"LineString"},"legs":[{"annotation":{"datasources":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"nodes":[238358,238359,238360,238352,238353,238362,238363,238364,238354,238355,238365,238366,238367,238368,238369,238370,238371,238372,238373,238374,238375,238376],"duration":[0,1.7,2.8,14,0.7,2.4,0.7,4.8,14,0.8,2.8,1,2.1,2.2,1.6,6.2,7.2,3.2,2.9,2.7,3.6],"distance":[0,2.298161,3.852927,0.111226,0.980347,3.372813,0.921814,3.916616,0.230785,1.079238,3.831302,1.392562,2.932155,3.018789,2.229793,8.59168,9.983514,4.45954,3.989306,3.793117,5.068542]},"summary":"{level:multiple}{type:stairs}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}, {level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","duration":77.4,"steps":[{"intersections":[{"out":0,"entry":[true],"bearings":[0],"location":[-2.978629,56.46024]}],"geometry":{"coordinates":[[-2.978629,56.46024],[-2.978629,56.46024]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":0,"bearing_before":0,"location":[-2.978629,56.46024],"type":"depart"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":0,"name":"{level:0}{type:entrance}{entrance}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0},{"intersections":[{"out":0,"in":0,"entry":[true,true,false],"bearings":[210,315,345],"location":[-2.978629,56.46024]}],"geometry":{"coordinates":[[-2.978629,56.46024],[-2.978666,56.460237],[-2.978678,56.460271]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":262,"bearing_before":0,"location":[-2.978629,56.46024],"modifier":"sharp right","type":"turn"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":4.5,"name":"{level:0}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":6.2},{"intersections":[{"out":0,"in":1,"entry":[true,false],"bearings":[0,135],"location":[-2.978678,56.460271]}],"geometry":{"coordinates":[[-2.978678,56.460271],[-2.978678,56.460272]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":0,"bearing_before":349,"location":[-2.978678,56.460271],"modifier":"right","type":"new name"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":14,"name":"{level:multiple}{type:stairs}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0.1},{"intersections":[{"out":1,"in":1,"entry":[true,false],"bearings":[15,180],"location":[-2.978678,56.460272]}],"geometry":{"coordinates":[[-2.978678,56.460272],[-2.978693,56.460269],[-2.978685,56.460239],[-2.97867,56.460239],[-2.978677,56.460274]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":250,"bearing_before":0,"location":[-2.978678,56.460272],"modifier":"slight right","type":"new name"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":8.6,"name":"{level:1}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":9.2},{"intersections":[{"out":0,"in":0,"entry":[true,false],"bearings":[195,195],"location":[-2.978677,56.460274]}],"geometry":{"coordinates":[[-2.978677,56.460274],[-2.978678,56.460272]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":195,"bearing_before":354,"location":[-2.978677,56.460274],"modifier":"uturn","type":"turn"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":14,"name":"{level:multiple}{type:stairs}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0.2},{"intersections":[{"out":1,"in":0,"entry":[false,true],"bearings":[15,135],"location":[-2.978678,56.460272]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[150,255,315],"location":[-2.978611,56.460217]}],"geometry":{"coordinates":[[-2.978678,56.460272],[-2.978694,56.460268],[-2.978684,56.460234],[-2.978662,56.460237],[-2.978616,56.460244],[-2.978611,56.460217],[-2.978577,56.460224],[-2.978552,56.460148],[-2.97852,56.46006],[-2.978448,56.460065],[-2.978384,56.460071],[-2.978324,56.460079],[-2.978311,56.460034]],"type":"LineString"},"mode":"walking","maneuver":{"bearing_after":246,"bearing_before":195,"location":[-2.978678,56.460272],"modifier":"left","type":"new name"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":36.3,"name":"{level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":50.4},{"intersections":[{"in":0,"entry":[true],"bearings":[351],"location":[-2.978311,56.460034]}],"geometry":{"coordinates":[[-2.978311,56.460034]],"type":"Point"},"mode":"walking","maneuver":{"bearing_after":0,"bearing_before":171,"location":[-2.978611,56.460217],"type":"arrive"},"building_id":"e2657c93-2d13-412a-89fe-0949a14e7eea","duration":0,"name":"{level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","distance":0}],"distance":66.1}],"duration":77.4,"distance":66.1}],"waypoints":[{"hint":"35cDgOCXA4A8LQAAFwAAAAAAAAAAAAAAAAAAAPaXAwD1lwMAaQIAgLuM0v_Qg10Du4zS_9CDXQMAAAMDqAOtDg==","name":"{level:0}{type:entrance}{entrance}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","location":[-2.978629,56.46024]},{"hint":"5ZcDgOaXA4BaLQAAJAAAAAAAAADuAAAAAAAAAMaRAADFkQAAaQIAgPmN0v8Cg10D-Y3S_wKDXQMGAAMDqAOtDg==","name":"{level:2}{type:pathway}{bid:e2657c93-2d13-412a-89fe-0949a14e7eea}","location":[-2.978311,56.460034]}]}]}`;
const routes = `[[{ "indoorMapFloorId": 0, "indoorMapId": "westport_house", "points": [[56.46024, -2.978629], [56.46024, -2.978629]] }, { "indoorMapFloorId": 0, "indoorMapId": "westport_house", "points": [[56.46024, -2.978629], [56.460216, -2.978621], [56.460213, -2.978658]] }, { "indoorMapFloorId": 2, "indoorMapId": "westport_house", "points": [[56.460213, -2.978658], [56.460217, -2.978611], [56.460224, -2.978577], [56.460148, -2.978552], [56.46006, -2.97852], [56.460065, -2.978448], [56.460071, -2.978384], [56.460079, -2.978324], [56.460034, -2.978311]] }, { "indoorMapFloorId": 2, "indoorMapId": "westport_house", "points": [[56.460034, -2.978311]] }], [{ "indoorMapFloorId": 0, "indoorMapId": "westport_house", "points": [[56.46024, -2.978629], [56.46024, -2.978629]] }, { "indoorMapFloorId": 0, "indoorMapId": "westport_house", "points": [[56.46024, -2.978629], [56.460237, -2.978666], [56.460271, -2.978678]] }, { "indoorMapFloorId": 1, "indoorMapId": "westport_house", "points": [[56.460272, -2.978678], [56.460269, -2.978693], [56.460239, -2.978685], [56.460239, -2.97867], [56.460274, -2.978677]] }, { "indoorMapFloorId": 2, "indoorMapId": "westport_house", "points": [[56.460272, -2.978678], [56.460268, -2.978694], [56.460234, -2.978684], [56.460237, -2.978662], [56.460244, -2.978616], [56.460217, -2.978611], [56.460224, -2.978577], [56.460148, -2.978552], [56.46006, -2.97852], [56.460065, -2.978448], [56.460071, -2.978384], [56.460079, -2.978324], [56.460034, -2.978311]] }, { "indoorMapFloorId": 2, "indoorMapId": "westport_house", "points": [[56.460034, -2.978311]] }]]`;

import { describe, it, expect, test } from "@jest/globals";
// import Loaf from "../src/loaf";
import { sortArrayByDependencyInfo, testForRequired } from "../src/kitchen";
import { DependencyInfo } from "../src/types/loaf";

describe("Kitchen - testForRequired", () => {
  it("test for required fields - failure - string", () => {
    try {
      testForRequired(["test1", "test2", "test3"], ["test4"])
      expect(false).toBe(true);
    } catch(err: any) {
      expect(err.message).toBe('Missing required dependency - test4')
    }
  })
  it("test for required fields - failure - oneOf", () => {
    try {
      testForRequired(["test1", "test2", "test3"], [{oneOf: ["test4", "test5"]}])
      throw new Error("should not get here");
    } catch(err: any) {
      expect(err.message).toBe('Missing at least one of the required dependencies - test4, test5')
    }
  })
  it("test for required fields - success - string", () => {
    const result = testForRequired(["test1", "test2", "test3"], ["test2"]);
    expect(result).toBe(true);
  })

  it("test for required fields - success - oneOf", () => {
    const result = testForRequired(["test1", "test2", "test3"], [{oneOf: ["test2", "test5"]}]);
    expect(result).toBe(true);
  })
});


describe("Kitchen - sortArrayByDependencyInfo", () => {

  it("test sort - before - no change", () => {
    const moduleNames = ["test1", "test2", "test3"];
    const deps: DependencyInfo[] = [{
      moduleName: "test2",
      required: {
        before: ["test1"]
      }
    }, {
      moduleName: "test3",
      required: {
        before: ["test2"]
      }
    },
  ];
    const sorted = sortArrayByDependencyInfo(moduleNames, deps);
    expect(sorted.indexOf("test2")).toBeGreaterThan(sorted.indexOf("test1"));
    expect(sorted.indexOf("test3")).toBeGreaterThan(sorted.indexOf("test2"));
    expect(sorted).toEqual(["test1", "test2", "test3"]);
  })
  it("test sort - reverse array", () => {
    const moduleNames = ["test1", "test2", "test3"];
    const deps: DependencyInfo[] = [{
      moduleName: "test2",
      required: {
        before: ["test3"]
      }
    }, {
      moduleName: "test1",
      required: {
        before: ["test2"]
      }
    }, 
    // {
    //   moduleName: "test3",
    //   required: {
    //     before: ["test1"]
    //   }
    // }
  ];
    const sorted = sortArrayByDependencyInfo(moduleNames, deps);
    expect(sorted.indexOf("test3")).toBeLessThan(sorted.indexOf("test2"));
    expect(sorted.indexOf("test2")).toBeLessThan(sorted.indexOf("test1"));
    expect(sorted).toEqual(["test3", "test2", "test1"]);
  });

  it("test sort - complex", () => {
    // randomise the order of the array
    const moduleNames = ["test2", "test5", "test1", "test4", "test3"];


    // ["test5", "test2", "test3", "test1", "test4"]
    // moduleNames.sort(() => Math.random() - 0.5);
    const deps: DependencyInfo[] = [{
      moduleName: "test3",
      required: {
        before: ["test2", "test5"],
        after: ["test1"]
        // after: [{oneOf: ["test1", "test2"]}]
      }
    }, {
      moduleName: "test4",
      required: {
        before: ["test1", "test5"],
        // after: ["test3"]
      }
    }, 
    // {
    //   moduleName: "test1",
    //   required: {
    //     before: ["test3", "test4"]
    //   }
    // }
  ];
    const sorted = sortArrayByDependencyInfo(moduleNames, deps);
    // expect(sorted).toEqual([ "test3", "test2", "test5", "test1", "test4"]);
    expect(sorted.indexOf("test3")).toBeGreaterThan(sorted.indexOf("test2"));
    expect(sorted.indexOf("test3")).toBeGreaterThan(sorted.indexOf("test5"));
    expect(sorted.indexOf("test3")).toBeLessThan(sorted.indexOf("test1"));
    expect(sorted.indexOf("test4")).toBeGreaterThan(sorted.indexOf("test1"));
    expect(sorted.indexOf("test4")).toBeGreaterThan(sorted.indexOf("test5"));

  });

  it("test sort - string array - reverse array", () => {
    const moduleNames = ["test1", "test2", "test3"];
    const deps: DependencyInfo[] = [{
      moduleName: "test2",
      required: ["test3"],
    }, {
      moduleName: "test1",
      required: ["test2"]
    }];
    const sorted = sortArrayByDependencyInfo(moduleNames, deps);
    expect(sorted.indexOf("test3")).toBeLessThan(sorted.indexOf("test2"));
    expect(sorted.indexOf("test2")).toBeLessThan(sorted.indexOf("test1"));
    expect(sorted).toEqual(["test3", "test2", "test1"]);
  })
});

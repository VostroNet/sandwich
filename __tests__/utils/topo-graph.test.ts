import { describe, it, expect } from   "@jest/globals";
import { TopologicalGraph } from "../../src/utils/topo-graph";
import {  } from "@jest/globals";

describe("TopoGraph", () => {
  it("should be defined", () => {
    expect(TopologicalGraph).toBeDefined();
  });
  it("should be a class", () => {
    const graph = new TopologicalGraph();
    expect(graph).toBeInstanceOf(TopologicalGraph);
  });
  it("test basic sort", () => {
    const graph = new TopologicalGraph();

    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addVertex(4);

    graph.addEdge(1, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 4);
    graph.addEdge(3, 4);
    const result = graph.topologicalSort();
    expect(result).toEqual([1, 2, 3, 4]);
  });
  it("test sort - complex", () => {
    const graph = new TopologicalGraph();

    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addVertex(4);
    graph.addVertex(5);

    graph.addEdge(4, 3);
    graph.addEdge(3, 2);
    graph.addEdge(4, 2);
    graph.addEdge(3, 5);
    const result = graph.topologicalSort();
    expect(result).toEqual([1, 4, 3, 2, 5]);
  });
  it("test sort - complex v2", () => {

    const graph = new TopologicalGraph();

    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addVertex(4);
    graph.addVertex(5);

    graph.addEdge(3, 2); // before
    graph.addEdge(3, 5); // before
    graph.addEdge(1, 3); // after

    // graph.addEdge(4, 1); // before
    graph.addEdge(5, 4); // after

    const result = graph.topologicalSort();
    expect(result).toEqual([1, 3, 2, 5, 4]);
    // [ 13542]

    // [5 2 3 1 4]

  });
});
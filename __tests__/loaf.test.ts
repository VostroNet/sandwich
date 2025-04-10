import {describe, it, expect} from "@jest/globals";
import Loaf from "../src/loaf";
import { createLogger } from "../src/utils/logger";
import { ISlice, LoafEvent } from "../src/types/loaf";
const logger = createLogger("loaf");
describe('Loaf', () => {
  it('should be defined', () => {
    expect(Loaf).toBeDefined();
  });
  it('should be a class', () => {
    const loaf = new Loaf({name: 'test', slices: []});
    expect(loaf).toBeInstanceOf(Loaf);
  });
  it('basic slice - testing load event', async () => {
    let l = 0;
    const loaf = new Loaf({
      name: 'test', 
      slices: [{
        name: "slice1",
        [Loaf.Load]: async (loaf: Loaf, slice: ISlice) => {
          l++;
        }
      }]
    });
    await loaf.start();
    expect(l).toBe(1);
  });
  it('basic slice - testing order of eventa', async () => {
    const l: string[] = [];
    const loaf = new Loaf({name: 'test', slices: [{
      name: "slice1",
      [Loaf.Load]: async (loaf: Loaf) => {
        l.push('load');
      },
      [Loaf.Initialize]: async (loaf: Loaf) => {
        l.push('initialize');
        return loaf;
      },
      [Loaf.Ready]: async (loaf: Loaf) => {
        l.push('ready');
        return loaf;
      },
      [Loaf.Shutdown]: async (loaf: Loaf) => {
        l.push('shutdown');
        return loaf;
      }
    }]});
    await loaf.start();
    await loaf.shutdown();
    logger.debug("execution path", l);
    expect(l).toEqual(['load', 'initialize', 'ready', 'shutdown']);
  });
  
  it('basic slice - testing order of events', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      slices: [{
        name: "test1",
        [Loaf.Load]: async (loaf: Loaf) => {
          l.push('load1');
        },
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready1');
          return loaf;
        },
        [Loaf.Shutdown]: async (loaf: Loaf) => {
          l.push('shutdown1');
          return loaf;
        }
      }, {
        name: "test2",
        dependencies: ["test1"],
        [Loaf.Load]: async (loaf: Loaf) => {
          l.push('load2');
        },
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize2');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready2');
          return loaf;
        },
        [Loaf.Shutdown]: async (loaf: Loaf) => {
          l.push('shutdown2');
          return loaf;
        }
      }]
    });
    await loaf.start();
    await loaf.shutdown();
    expect(l).toEqual(['load1', 'load2', 'initialize1', 'initialize2', 'ready1', 'ready2', 'shutdown1', 'shutdown2']);
  });
  it('basic slice - testing order of events - with dependencies', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      slices: [{
        name: "test1",
        dependencies: ["test2"],
        // [Loaf.Load]: async (loaf: Loaf, slice: ISlice) => {
        //   l.push('load1');
        // },
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready1');
          return loaf;
        },
        [Loaf.Shutdown]: async (loaf: Loaf) => {
          l.push('shutdown1');
          return loaf;
        }
      }, {
        name: "test2",
        // [Loaf.Load]: async (loaf: Loaf) => {
        //   l.push('load2');
        // },
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize2');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready2');
          return loaf;
        },
        [Loaf.Shutdown]: async (loaf: Loaf) => {
          l.push('shutdown2');
          return loaf;
        }
      }]
    });
    await loaf.start();
    await loaf.shutdown();
    expect(l).toEqual(['initialize2', 'initialize1', 'ready2', 'ready1', 'shutdown2', 'shutdown1']);
  });
  it('complex slice reqs - independent function reordering', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      slices: [{
        name: "test2",
        dependencies: ["test1"],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize2');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready2');
          return loaf;
        }
      }, {
        name: "test3",
        dependencies: [{
          event: Loaf.Initialize,
          required: {
            before: ["test1"],
            after: ["test4"]
          }
        }],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize3');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready3');
          return loaf;
        }
      }, {
        name: "test4",
        dependencies: [{
          event: Loaf.Ready,
          required: {
            before: ["test2", "test1"],
            after: ["test3"],
          },
        }],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize4');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready4');
          return loaf;
        }
      }, {
        name: "test1",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
          return loaf;
        },
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready1');
          return loaf;
        }
      }]
    });
    
    logger.debug("execution path", l);
    await loaf.load();
    await loaf.initialize();
    await loaf.ready();
    expect(l.indexOf('initialize1')).toBeLessThan(l.indexOf('initialize2'));
    expect(l.indexOf('initialize2')).toBeLessThan(l.indexOf('initialize3'));
    expect(l.indexOf('initialize3')).toBeLessThan(l.indexOf('initialize4'));

    expect(l.indexOf('ready1')).toBeLessThan(l.indexOf('ready2'));
    expect(l.indexOf('ready2')).toBeLessThan(l.indexOf('ready4'));
    expect(l.indexOf('ready4')).toBeLessThan(l.indexOf('ready3'));


    // 0:
    // 'initialize4'
    // 1:
    // 'initialize3'
    // 2:
    // 'initialize2'
    // 3:
    // 'initialize1'
    // 4:
    // 'ready3'
    // 5:
    // 'ready4'
    // 6:
    // 'ready2'
    // 7:
    // 'ready1'
  });



  it('ensuring crumbs only hold the modules that have the functions', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      slices: [{
        name: "test1",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
        }
      }, {
        name: "test2",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize2');
        }, 
        [Loaf.Ready]: async (loaf: Loaf) => {
          l.push('ready2');
        }
      }, {
        name: "test3",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize3');
        },
      }]
    });
    
    logger.debug("execution path", l);
    await loaf.load();

    expect(loaf.crumbs[LoafEvent.Initialize].length).toBe(3);
    expect(loaf.crumbs[LoafEvent.Ready].length).toBe(1);
    expect(loaf.crumbs[LoafEvent.Ready][0]).toBe("test2");
  });

  it('restrict extra crumbs from being generated', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      crumbNames: [],
      slices: [{
        name: "test1",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
        },
        ["warrgh"]: async (loaf: Loaf) => {
          l.push('warrgh');
        }

      }]
    });
    
    logger.debug("execution path", l);
    await loaf.load();
    expect(loaf.crumbs["warrgh"]).toBeUndefined();
  });

  it('restrict then allow crumbs getting generated', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      crumbNames: [],
      slices: [{
        name: "test1",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
        },
        ["warrgh"]: async (loaf: Loaf) => {
          l.push('warrgh');
        },
        ["warrgh2"]: async (loaf: Loaf) => {
          l.push('warrgh2');
        }

      }]
    });
    loaf.allowCrumb("warrgh");
    
    logger.debug("execution path", l);
    await loaf.load();
    expect(loaf.crumbs["warrgh"]).not.toBeUndefined();
    expect(loaf.crumbs["warrgh2"]).toBeUndefined();
  });
  it('restrict then allow then restrict crumbs from being generated', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      crumbNames: [],
      slices: [{
        name: "test1",
        dependencies: [],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
        },
        ["warrgh"]: async (loaf: Loaf) => {
          l.push('warrgh');
        },
        ["warrgh2"]: async (loaf: Loaf) => {
          l.push('warrgh2');
        }

      }]
    });
    loaf.allowCrumb("warrgh");
    loaf.disallowCrumb("warrgh");
    
    logger.debug("execution path", l);
    await loaf.load();
    expect(loaf.crumbs["warrgh"]).toBeUndefined();
    expect(loaf.crumbs["warrgh2"]).toBeUndefined();
  });
  it('using ISlice.allow to allow crumb while restriction is enabled', async () => {
    let l: string[] = [];
    const loaf = new Loaf({
      name: 'test', 
      crumbNames: [],
      slices: [{
        name: "test1",
        dependencies: [],
        allow: ["warrgh"],
        [Loaf.Initialize]: async (loaf: Loaf) => {
          l.push('initialize1');
        },
        ["warrgh"]: async (loaf: Loaf) => {
          l.push('warrgh');
        },
        ["warrgh2"]: async (loaf: Loaf) => {
          l.push('warrgh2');
        }

      }]
    });
    
    logger.debug("execution path", l);
    await loaf.load();
    expect(loaf.crumbs["warrgh"]).not.toBeUndefined();
    expect(loaf.crumbs["warrgh2"]).toBeUndefined();
  });
});
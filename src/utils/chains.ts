import waterfall from './waterfall';

export default class Chains {
  readonly options: { [key: string]: {
    ignoreReturn: boolean;
  } };
  readonly funcs: { [key: string]: any[] };
  readonly locks: { [key: string]: boolean };
  constructor() {
    this.funcs = {};
    this.locks = {};
    this.options = {};
  }
  readonly setOptions = (eventName: string, options: {
    ignoreReturn: boolean;
  }) => {
    this.options[eventName] = options;
  };
  readonly push = (eventName: string, func: any | any[]) => {
    // const trackingObj = new Error();
    // console.log('stack', trackingObj.stack);
    if (!this.locks[eventName]) {
      if (!this.funcs[eventName]) {
        this.funcs[eventName] = [];
      }
      if (!this.locks[eventName]) {
        if (Array.isArray(func)) {
          this.funcs[eventName].push(...func);
        } else {
          this.funcs[eventName].push(func);
        }
      }
    }
  };
  readonly unshift = (eventName: string, func: any) => {
    if (!this.locks[eventName]) {
      if (!this.funcs[eventName]) {
        this.funcs[eventName] = [];
      }
      if (!this.locks[eventName]) {
        this.funcs[eventName].unshift(func);
      }
    }
  };
  readonly sync = (eventName: string, start: any, ...args: readonly unknown[]) => {
    if (!this.funcs[eventName]) {
      return start;
    }
    const options = this.options[eventName];
    return this.funcs[eventName].reduce((o, f) => {
      if (f instanceof Promise) {
        throw new Error('Cannot use sync with async functions');
      }
      if (options?.ignoreReturn) {
        f(start, ...args);
        return start;
      }
      return f(o, ...args);
    }, start);
  };
  readonly all = async<T>(eventName: string, start: any, ...args: readonly unknown[]): Promise<T[]> =>  {
    if (!this.funcs[eventName]) {
      return [];
    }
    return Promise.all(this.funcs[eventName].map((f) => {
      return f(start, ...args);
    }));
  };
  readonly execute = async<T>(
    eventName: string,
    start: any,
    ...args: readonly unknown[]
  ) => {
    if (!this.funcs[eventName]) {
      return start;
    }
    const options = this.options[eventName];
    return waterfall<T>(
      this.funcs[eventName] || [],
      async(f, o) => {
        if (options?.ignoreReturn) {
          await f(start, ...args);
          return start;
        }
        return f(o, ...args);
      },
      start
    );
  };
  readonly condition = async<T1, T2>(
    eventName: string,
    conditionFunc: (o: T2) => Promise<boolean>,
    start: T1 ,
    ...args: readonly unknown[]
  ) => {
    if (!this.funcs[eventName]) {
      return start;
    }
    const options = this.options[eventName];
    const endResult = await waterfall<T1>(this.funcs[eventName] || [], async(f, o, i, brk) => {
      // if (brk) {
      //   return o;
      // }
      let result: T2;
      // this is a flag to ensure that the first argument is provided 
      // instead of the returnval of the previous function
      if (options?.ignoreReturn) {
        result = await f(start, ...args);
      } else {
        result = await f(o, ...args);
      }
      if (await conditionFunc(result)) {
        brk()
      }
      return result;
    }, start);

    return endResult;
  }

  readonly clear = (eventName: string) => {
    if (!this.locks[eventName]) {
      delete this.funcs[eventName];
    }
  };
  readonly lock = (eventName: string) => {
    this.locks[eventName] = true;
  };
  readonly unlock = (eventName: string) => {
    this.locks[eventName] = false;
  };
}

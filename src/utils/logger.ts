import debug from "debug";
import { Jam, Logger } from "../types/loaf";

// export function createLoafLogger(jam: Jam, prefix?: string): Logger {
//   let p = "";
//   if(prefix) {
//     p = `:${prefix}`;
//   }
//   const name = jam.name || 'parton';
//   return {
//     debug: debug(`${name}${p}:debug`),
//     error: debug(`${name}${p}:error`),
//     err: debug(`${name}${p}:err`),
//     info: debug(`${name}${p}:info`),
//     log: debug(`${name}${p}:log`),
//     warn: debug(`${name}${p}:warn`)
//   };
// }
export function createDebugLogger(jam: Jam, prefix?: string): Logger {
  let p = "";
  if(prefix) {
    p = `:${prefix}`;
  }
  const name = jam.name || 'parton';
  return createLogger(`${name}${p}`);
}
export function createLogger(prefix = ""): Logger {
  
  return {
    debug: debug(`${prefix}:debug`),
    // debug: (...rest: any[]) => {
    //   console.log(...rest);
    // },
    error: debug(`${prefix}:error`),
    err: debug(`${prefix}:err`),
    info: debug(`${prefix}:info`),
    log: debug(`${prefix}:log`),
    warn: debug(`${prefix}:warn`)
  };
}




// const loggerFuncs: {[
//   key: string]: {
//     debug: (...rest: any[]) => void;
//     error: (...rest: any[]) => void;
//     err: (...rest: any[]) => void;
//     info: (...rest: any[]) => void;
//     log: (...rest: any[]) => void;
//     warn: (...rest: any[]) => void;
//   } 
// } = {};
// function getLoggerFunc(jam: Jam, module: string) {
//   if(!loggerFuncs[module]) {
//     loggerFuncs[module] = createDebugLogger(jam, module);
//   }
//   return loggerFuncs[module]
// }

// export function createLoafLogger(jam: Jam): Logger {
//   return {
//     debug(module: string, ...rest: any[]) {
//       return getLoggerFunc(jam, module).debug(...rest);
//     },
//     error(module: string, ...rest: any[]) {
//       return getLoggerFunc(jam, module).error(...rest);
//     },
//     err(module: string, ...rest: any[]) {
//       return getLoggerFunc(jam, module).err(...rest);
//     },
//     info(module: string, ...rest: any[]) {
//       return getLoggerFunc(jam, module).info(...rest);
//     },
//     log(module: string, ...rest: any[]) {
//       return getLoggerFunc(jam, module).log(...rest);
//     },
//     warn(module: string, ...rest: any[]) {
//       return getLoggerFunc(jam, module).warn(...rest);
//     }
//   };
// }

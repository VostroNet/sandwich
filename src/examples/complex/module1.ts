import Loaf from "../../loaf";
import { ISlice } from "../../types/loaf";

export enum NewEvents { 
  Initialize = "module1:initialize", // the text needs to be unique
  RandomFunction = "module1:random-func",
}
export type Module1Events = {
  readonly [NewEvents.Initialize]?: (loaf: Loaf) => Promise<void>;
  readonly [NewEvents.RandomFunction]?: (arg1: string, loaf: Loaf) => Promise<string>;
}
export interface IModule1 extends ISlice, Module1Events {

}

const module1: IModule1 = {
  name: "module1",
  [Loaf.Initialize]: async(loaf: Loaf, slice: ISlice) => {
    loaf.setOptions(NewEvents.Initialize, {
      ignoreReturn: true, // setting this means the that the first argument is ignored on return
    });
    await loaf.execute(NewEvents.Initialize, loaf);
    return loaf;
  },
  [NewEvents.Initialize]: async (loaf: Loaf) => {
    console.log("[module1](NewEvents.Initialize) - start");
    const result = await loaf.execute(NewEvents.RandomFunction, "start", loaf);
    console.log("[module1](NewEvents.Initialize) - execute(NewEvents.RandomFunction) - result", result);
  },
  [NewEvents.RandomFunction]: async (arg1: any, loaf: Loaf) => {
    console.log("  [module1](NewEvents.RandomFunction) - prevResult", arg1);
    return "module1";
  }
}
export default module1;

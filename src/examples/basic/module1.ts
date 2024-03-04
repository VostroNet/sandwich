import Loaf from "../../loaf";
import { ISlice } from "../../types/loaf";

const module1: ISlice = {
  name: "module1",
  [Loaf.Initialize]: async <T extends Loaf>(loaf: T) => {
    console.log("Initialize");
    return loaf;
  },
  [Loaf.Ready]: async <T extends Loaf>(loaf: T) => {
    console.log("Ready");
    return loaf;
  },
  [Loaf.Shutdown]: async <T extends Loaf>(loaf: T) => {
    console.log("Shutdown");
    return loaf;
  }
}
export default module1;
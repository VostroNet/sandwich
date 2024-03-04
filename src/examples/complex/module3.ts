import Loaf from "../../loaf";
import { NewEvents } from "./module1";

export default {
  name: "module3",
  [NewEvents.Initialize]: async (loaf: Loaf) => {
    console.log("[module3](NewEvents.Initialize)");
  },
  [NewEvents.RandomFunction]: async (arg1: any, loaf: Loaf) => {
    console.log("  [module3](NewEvents.RandomFunction) - prevResult", arg1);
    return "module3";
  }
}
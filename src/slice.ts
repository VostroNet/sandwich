import Loaf from "./loaf";
import { ISlice, LoafEvent, oneOf } from "./types/loaf";


export default class Slice implements ISlice {
  loaf: Loaf;
  name: string;
  dependencies?: (string | oneOf)[];
  incompatible?: (string | oneOf)[];
  ignoreFunctions?: string[];
  [LoafEvent.Load]?: (core: Loaf) => Promise<void>;
  [LoafEvent.Initialize]?: <T extends Loaf>(loaf: T, slice: ISlice) => Promise<T>;
  [LoafEvent.Ready]?: <T extends Loaf>(core: T) => Promise<T>;
  [LoafEvent.Shutdown]?: <T extends Loaf>(core: T) => Promise<T>;
  [LoafEvent.UncaughtError]?: <T extends Loaf>(core: T, error: Error) => Promise<T>;
  [LoafEvent.UnhandledRejection]?: <T extends Loaf>(core: T, error: Error) => Promise<T>;
  constructor(loaf: Loaf) {
    this.loaf = loaf;
    this.name = 'rye';
  }
}
  
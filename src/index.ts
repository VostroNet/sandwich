
export { default as Loaf } from './loaf';

export { default as Slice} from "./slice";

export {ISlice, Jam, Logger, LoafEvent, Slices, Toast, oneOf, DependencyInfo} from "./types/loaf";

import * as kitchenProxy from "./kitchen";

export const kitchen = kitchenProxy;
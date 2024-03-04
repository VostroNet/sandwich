export default async function waterfall<T>(
  arr: any[] = [],
  func: (val: any, prevVal: any, currentIdx?: number, brk?: () => void) => any,
  start?: any,
) : Promise<T> {
  let brk = false;
  if (!Array.isArray(arr)) {
    arr = [arr];
  }
  let val = start;
  for (let i = 0; i < arr.length; i++) {
    if (brk) {
      break;
    }
    val = await func(arr[i], val, i, () => brk = true);
  }
  return val;
  // return arr.reduce(function (promise: Promise<any>, innerVal: any, currentIdx: number) {
  //   return promise.then(function (prevVal) {
  //     return func(innerVal, prevVal, currentIdx);
  //   });
  // }, Promise.resolve(start));
}

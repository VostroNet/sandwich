import Loaf from "../../loaf";
// import { URL } from 'url'; // in Browser, the URL in native accessible on window

const __dirname = new URL('.', import.meta.url).pathname;
// console.log(__dirname);
const instance = new Loaf({
  name: "projectName",
  slices: ["./module1.ts", "./module2.ts", "./module3.ts"],
  cwd: __dirname,
});
(async() => {
  await instance.start();
  await instance.shutdown();
})()

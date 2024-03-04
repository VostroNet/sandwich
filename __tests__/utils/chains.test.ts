import { describe, expect, test } from '@jest/globals';
import Chains from '../../src/utils/chains';


function createBindFunc(i: number) {
  return (arg: string) => {
    return `${arg}${i}`;
  }
}
describe("utils:chains", () => {
  test('basic test - execute', async () => {
    const chain = new Chains();
    chain.push("test", (arg: string) => {
      return `${arg}1`;
    });
    const result = await chain.execute<string>("test", "answer");
    expect(result).toBe("answer1");
  });

  test('condition', async () => {
    const chain = new Chains();
    for(let i = 0; i < 10; i++) {
      chain.push("test", createBindFunc(i));
    }
    const result = await chain.condition("test", async(args: string) => {
      return args === "answer012345";
    }, "answer");
    expect(result).toBe("answer012345");
  });
  test('condition - no return passing', async () => {
    const chain = new Chains();
    chain.setOptions("test", {ignoreReturn: true});
    for(let i = 0; i < 10; i++) {
      chain.push("test", createBindFunc(i));
    }
    const result = await chain.condition("test", async(args: string) => {
      return args === "answer5";
    }, "answer");
    expect(result).toBe("answer5");
  });
});

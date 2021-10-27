import { factoryFor } from "../../src/private/factoryFor";

class TestClass {
  public value: string;
  public optional?: string;

  constructor(value: string, optional?: string) {
    this.value = value;
    this.optional = optional;
  }
}

it("creates a new instance of TestClass", () => {
  const testClass = factoryFor(TestClass);
  const instance = testClass("hello");
  expect(instance).toBeInstanceOf(TestClass);
});

it("it passes the right arguments", () => {
  const testClass = factoryFor(TestClass);
  const instance1 = testClass("hello");
  expect(instance1.value).toEqual("hello");

  const instance2 = testClass("hello", "wrld");
  expect(instance2.value).toEqual("hello");
  expect(instance2.optional).toEqual("wrld");
});

it("has zero arguments because it is a var args function", () => {
  const testClass = factoryFor(TestClass);
  expect(testClass.length).toBe(0);
});

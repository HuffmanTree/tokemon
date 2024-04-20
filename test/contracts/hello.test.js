const Hello = artifacts.require("Hello");

contract("Hello", () => {
  it("responds 'Hello World'", async () => {
    const instance = await Hello.deployed();

    expect(await instance.sayHello.call("World")).to.equal("Hello World");
  });
});

const Tokemon = artifacts.require("Tokemon");

contract("Tokemon", () => {
  describe("supportsInterface", () => {
    it("implements the ERC-165 interface", async () => {
      const instance = await Tokemon.deployed();

      expect(await instance.supportsInterface.call("0x01ffc9a7")).to.be.true;
    });

    it("implements the ERC-721 interface", async () => {
      const instance = await Tokemon.deployed();

      expect(await instance.supportsInterface.call("0x80ac58cd")).to.be.true;
    })

    it("returns false when the identifier is '0xffffffff'", async () => {
      const instance = await Tokemon.deployed();

      expect(await instance.supportsInterface.call("0xffffffff")).to.be.false;
    });
  });
});

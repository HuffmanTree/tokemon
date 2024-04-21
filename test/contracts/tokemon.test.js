const Tokemon = artifacts.require("TestTokemon");

contract("Tokemon", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await Tokemon.deployed();
  });

  describe("supportsInterface", () => {
    it("implements the ERC-165 interface", async () => {
      expect(await instance.supportsInterface.call("0x01ffc9a7")).to.be.true;
    });

    it("implements the ERC-721 interface", async () => {
      expect(await instance.supportsInterface.call("0x80ac58cd")).to.be.true;
    })

    it("returns false when the identifier is '0xffffffff'", async () => {
      expect(await instance.supportsInterface.call("0xffffffff")).to.be.false;
    });
  });

  describe("balanceOf", () => {
    it("throws an error when called with the zero address", async () => {
      await expectRevert(
        instance.balanceOf.call("0x0000000000000000000000000000000000000000"),
        "Must not be called with the zero address",
      );
    });

    it("returns 0 as initial balance", async () => {
      expect(await instance.balanceOf.call(accounts[0])).to.deep.equal(web3.utils.toBN(0));
    });

    it("returns the current balance", async () => {
      await instance.setBalance(accounts[0], 2);

      expect(await instance.balanceOf.call(accounts[0])).to.deep.equal(web3.utils.toBN(2));
    });
  });

  describe("ownerOf", () => {
    it("throws an error when the owner is the zero address", async () => {
      await expectRevert(
        instance.ownerOf.call(5),
        "Owner must not be the zero address",
      );
    });

    it("returns the token owner", async () => {
      await instance.setOwner(5, accounts[0]);

      expect(await instance.ownerOf.call(5)).to.equal(accounts[0]);
    });
  });
});

async function expectRevert(call, reason) {
  try {
    await call;
  } catch (err) {
    if (err.message.includes(`revert ${reason}`)) return;

    throw new Error(`Expected to throw with '${reason}' but got '${err.message}'`);
  }
}

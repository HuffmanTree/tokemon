const Tokemon = artifacts.require("TestTokemon");

contract("Tokemon", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await Tokemon.new();
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
        "Token is invalid",
      );
    });

    it("returns the token owner", async () => {
      await instance.setOwner(5, accounts[0]);

      expect(await instance.ownerOf.call(5)).to.equal(accounts[0]);
    });
  });

  describe("transferFrom", async () => {
    beforeEach(async () => {
      await instance.setOwner(5, accounts[0]);
      await instance.setBalance(accounts[0], 1);
    });

    it("throws with an invalid token owner", async () => {
      await expectRevert(
        instance.transferFrom(accounts[2], accounts[1], 5, { from: accounts[0] }),
        "Invalid token owner",
      );
    });

    it("throws when the receiver is the zero address", async () => {
      await expectRevert(
        instance.transferFrom(accounts[0], "0x0000000000000000000000000000000000000000", 5, { from: accounts[0] }),
        "Receiver must not be the zero address",
      );
    });

    it("throws when the token is invalid", async () => {
      // emulate an approval on a non-existing token
      await instance.setTokenApproval(6, accounts[0]);

      await expectRevert(
        instance.transferFrom("0x0000000000000000000000000000000000000000", accounts[1], 6, { from: accounts[0] }),
        "Token is invalid",
      );
    });

    it("forbids the transfer when sender is not the owner, and no approval or delegation", async () => {
      await expectRevert(
        instance.transferFrom(accounts[0], accounts[1], 5, { from: accounts[1] }),
        "Transfer forbidden",
      );
    });

    [
      ["the sender is the owner", () => {}, accounts[0]],
      ["the sender is a delegator of the owner", async () => {
        await instance.addOperatorApproval(accounts[0], accounts[2]);
      }, accounts[2]],
      ["the sender is the approved address for the token", async () => {
        await instance.setTokenApproval(5, accounts[2])
      }, accounts[2]],
    ].forEach(([s, setup, sender]) =>
      it(`transfers a token when ${s}`, async () => {
        await setup();

        await instance.transferFrom(accounts[0], accounts[1], 5, { from: sender })

        expect(await instance.getOwner(5)).to.equal(accounts[1]);
        expect(await instance.getBalance(accounts[0])).to.deep.equal(web3.utils.toBN(0))
        expect(await instance.getBalance(accounts[1])).to.deep.equal(web3.utils.toBN(1))
      }));
  });

  describe("approve", () => {
    beforeEach(async () => {
      await instance.setOwner(5, accounts[0]);
      await instance.setBalance(accounts[0], 1);
    });

    it("forbids the approval when sender is not the owner, and no delegation", async () => {
      await expectRevert(
        instance.approve(accounts[1], 5, { from: accounts[1] }),
        "Approval forbidden",
      );
    });

    [
      ["the sender is the owner", () => {}, accounts[0]],
      ["the sender is a delegator of the owner", async () => {
        await instance.addOperatorApproval(accounts[0], accounts[2]);
      }, accounts[2]],
    ].forEach(([s, setup, sender]) =>
      it(`sets the approved address for a token when ${s}`, async () => {
        await setup();

        await instance.approve(accounts[1], 5, { from: sender })

        expect(await instance.getTokenApproval(5)).to.equal(accounts[1]);
      }));
  });

  describe("setApprovalForAll", async () => {
    [
      ["approves", () => {}, true],
      ["revokes", async () => {
        await instance.addOperatorApproval(accounts[0], accounts[1]);
      }, false],
    ].forEach(([s, setup, approved]) =>
      it(`${s} an operator`, async () => {
        await setup();
        expect(await instance.getOperatorApproval(accounts[0], accounts[1])).to.be[!approved];

        await instance.setApprovalForAll(accounts[1], approved, { from: accounts[0] });

        expect(await instance.getOperatorApproval(accounts[0], accounts[1])).to.be[approved];
      }));
  });

  describe("getApproved", () => {
    beforeEach(async () => {
      await instance.setOwner(5, accounts[0]);
      await instance.setBalance(accounts[0], 1);
    });

    it("throws when the token is invalid", async () => {
      await expectRevert(
        instance.getApproved(6),
        "Token is invalid",
      );
    });

    [
      ["the zero address if no approved address", () => {}, "0x0000000000000000000000000000000000000000"],
      ["the approved address", async () => {
        await instance.setTokenApproval(5, accounts[1]);
      }, accounts[1]],
    ].forEach(([s, setup, approved]) =>
      it(`gets ${s}`, async () => {
        await setup();

        expect(await instance.getApproved(5)).to.equal(approved);
      }));
  });

  describe("isApprovedForAll", () => {
    [
      ["is", async () => {
        await instance.addOperatorApproval(accounts[0], accounts[1]);
      }, true],
      ["is not", () => {}, false],
    ].forEach(([s, setup, approved]) =>
      it(`${s} a delegator of the specified account`, async () => {
        await setup();

        expect(await instance.isApprovedForAll(accounts[0], accounts[1])).to.be[approved];
      }));
  });
});

async function expectRevert(call, reason) {
  try {
    await call;
  } catch (err) {
    if (err.message.includes(`revert ${reason}`)) return;

    throw new Error(`Expected to throw with '${reason}' but got '${err.message}'`);
  }
  throw new Error("Expected to throw");
}

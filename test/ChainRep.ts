import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ChainRep", function () {

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployChainRepFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await ethers.getSigners();

    const ChainRep = await ethers.getContractFactory("ChainRep");
    const chainRep = await ChainRep.deploy();

    return { chainRep, owner, otherAccounts };
  }

  describe("Deployment", function () {
    it("Should deploy with zero reports and certificates.", async function () {
      const { chainRep } = await loadFixture(deployChainRepFixture);

      expect(await chainRep.numReports()).to.equal(0);
      expect(await chainRep.numCertificates()).to.equal(0);
    });
  });

});

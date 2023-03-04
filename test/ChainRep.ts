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
    const [owner, ...accounts] = await ethers.getSigners();

    const ChainRep = await ethers.getContractFactory("ChainRep");
    const chainRep = await ChainRep.deploy();

    return { chainRep, owner, accounts };
  }

  describe("Deployment", function () {
    it("Should deploy with zero reports and certificates.", async function () {
      const { chainRep } = await loadFixture(deployChainRepFixture);

      expect(await chainRep.numReports()).to.equal(0);
      expect(await chainRep.numCertificates()).to.equal(0);
    });

    it("Should let me see how much gas is used by some concerning functions...", async function () {
        const { chainRep, accounts } = await loadFixture(deployChainRepFixture);
        
        // Set up accounts:
        const reporterCertified = accounts[0];
        const reporterNotCertified = accounts[1];

        // Add certificate:
        const certIdTx = await chainRep.createCertificate("Test Cert");
        const certId = ((await certIdTx.wait()).events?.find((event) => event.event === "CreateCertificate")?.args ?? [])[0];
        if(!certId) throw new Error("Could not find certId from tx events...");
        const issueTx = await chainRep.issueCertificate(certId, reporterCertified.address);
        const issueTxReceipt = await issueTx.wait();
        console.log(issueTxReceipt.gasUsed);

        // Make a report:
        const publishTx = await chainRep.connect(reporterCertified).publishReport([chainRep.address, accounts[0].address, accounts[1].address], ["chainrep.io", "www.chainrep.io"], ["test", "not really a scam"], "ipfs://bafkreieb5xpcpwatmqmm2eb6y2f72fx2yokapmrq75axqt3jdoc542dpd4");
        const publishTxReceipt = await publishTx.wait();
        console.log(publishTxReceipt.gasUsed);
        // console.group(publishTxReceipt.events);

        // Query for the certified report:
        const reports = await chainRep.getCertifiedContractReports(chainRep.address, [certId]);
        console.log(reports);
        expect(reports).to.have.lengthOf(1);
        expect(reports[0].reportId).to.equal(0);

    });
  });


});

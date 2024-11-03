const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("TokenVault", function () {
    const asset = "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272";
    const swapRouter = "0x2E6cd2d30aa43f40aa81619ff4b6E0a41479B13F";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const sushi = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2";
    const factory = "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F";
    const name = "xSushi Vault";
    const symbol = "xSVT";

    async function deployTokenVault() {
        const [owner, otherAccount] = await ethers.getSigners();
        const TokenVault = await ethers.getContractFactory("TokenVault");
        const tokenVault = await TokenVault.deploy(asset, swapRouter, WETH, sushi, factory, name, symbol);

        return { tokenVault, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right variables", async function () {
        const { tokenVault } = await loadFixture(deployTokenVault);
  
        expect(await tokenVault.xSushi()).to.equal(asset);
        expect(await tokenVault.swapRouter()).to.equal(swapRouter);
        expect(await tokenVault.WETH()).to.equal(WETH);
        expect(await tokenVault.sushi()).to.equal(sushi);
        expect(await tokenVault.factory()).to.equal(factory);
      });
  
      it("Should set the right owner", async function () {
        const { tokenVault, owner } = await loadFixture(deployTokenVault);
        expect(await tokenVault.owner()).to.equal(owner.address);
      });
  
    //   it("Should receive and store the funds to lock", async function () {
    //     const { lock, lockedAmount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
  
    //     expect(await ethers.provider.getBalance(lock.target)).to.equal(
    //       lockedAmount
    //     );
    //   });
  
    //   it("Should fail if the unlockTime is not in the future", async function () {
    //     // We don't use the fixture here because we want a different deployment
    //     const latestTime = await time.latest();
    //     const Lock = await ethers.getContractFactory("Lock");
    //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //       "Unlock time should be in the future"
    //     );
    //   });
    });
  
    // describe("Withdrawals", function () {
    //   describe("Validations", function () {
    //     it("Should revert with the right error if called too soon", async function () {
    //       const { lock } = await loadFixture(deployOneYearLockFixture);
  
    //       await expect(lock.withdraw()).to.be.revertedWith(
    //         "You can't withdraw yet"
    //       );
    //     });
  
    //     it("Should revert with the right error if called from another account", async function () {
    //       const { lock, unlockTime, otherAccount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       // We can increase the time in Hardhat Network
    //       await time.increaseTo(unlockTime);
  
    //       // We use lock.connect() to send a transaction from another account
    //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //         "You aren't the owner"
    //       );
    //     });
  
    //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //       const { lock, unlockTime } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       // Transactions are sent using the first signer by default
    //       await time.increaseTo(unlockTime);
  
    //       await expect(lock.withdraw()).not.to.be.reverted;
    //     });
    //   });
  
    //   describe("Events", function () {
    //     it("Should emit an event on withdrawals", async function () {
    //       const { lock, unlockTime, lockedAmount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       await time.increaseTo(unlockTime);
  
    //       await expect(lock.withdraw())
    //         .to.emit(lock, "Withdrawal")
    //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //     });
    //   });
  
    //   describe("Transfers", function () {
    //     it("Should transfer the funds to the owner", async function () {
    //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       await time.increaseTo(unlockTime);
  
    //       await expect(lock.withdraw()).to.changeEtherBalances(
    //         [owner, lock],
    //         [lockedAmount, -lockedAmount]
    //       );
    //     });
    //   });
    // });
  });
  
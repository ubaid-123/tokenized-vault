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
  
   
    });
  
    
  });
  
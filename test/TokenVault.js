const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const xSushiABI = [
  {
    inputs: [
      { internalType: "contract IERC20", name: "_sushi", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "enter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_share", type: "uint256" }],
    name: "leave",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sushi",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
describe("TokenVault", function () {
  const SUSHI_BAR_ADDRESS = "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272";
  const SWAP_ROUTER_ADDRESS = "0x2E6cd2d30aa43f40aa81619ff4b6E0a41479B13F";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const SUSHI_ADDRESS = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2";
  const FACTORY = "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F";

  async function depositEth(sender, recipient, amount) {
    const weiAmount = ethers.parseEther(String(amount));
  
    const tx = await sender.sendTransaction({
      to: recipient,
      value: weiAmount
    });
    await tx.wait();
  }

  async function deployTokenVault() {
    const name = "xSushi Vault";
    const symbol = "xSVT";

    const [owner, user] = await ethers.getSigners();
    const TokenVault = await ethers.getContractFactory("TokenVault");
    const tokenVault = await TokenVault.deploy(
      SUSHI_BAR_ADDRESS,
      SWAP_ROUTER_ADDRESS,
      WETH,
      SUSHI_ADDRESS,
      FACTORY,
      name,
      symbol
    );
    const sushiTokenContract = await ethers.getContractAt(
      "IERC20",
      SUSHI_ADDRESS
    );
    const sushiBarContract = await ethers.getContractAt(
      xSushiABI,
      SUSHI_BAR_ADDRESS
    );
    return { tokenVault, sushiTokenContract, sushiBarContract, owner, user };
  }

  describe("Deployment", function () {
    it("Should set the right variables", async function () {
      const { tokenVault } = await loadFixture(deployTokenVault);

      expect(await tokenVault.xSushi()).to.equal(SUSHI_BAR_ADDRESS);
      expect(await tokenVault.swapRouter()).to.equal(SWAP_ROUTER_ADDRESS);
      expect(await tokenVault.WETH()).to.equal(WETH);
      expect(await tokenVault.sushi()).to.equal(SUSHI_ADDRESS);
      expect(await tokenVault.factory()).to.equal(FACTORY);
    });
  });
  
  describe("Deposit", function(){
    it("should allow deposits and issue shares", async function () {
      const { tokenVault, sushiBarContract, user } = await loadFixture(deployTokenVault);
      const impersonateAccount = "0x1949c2e8680F30220d863ab429c925aAA517A023";
      const depositAmount = ethers.parseEther("1");

      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [impersonateAccount],
      });
      const xSushiHolder = await ethers.getSigner(
        impersonateAccount
      );
      
      await depositEth(user, impersonateAccount, "3");

      await sushiBarContract
        .connect(xSushiHolder)
        .transfer(user.address, depositAmount);
      
      await sushiBarContract
        .connect(user)
        .approve(tokenVault, depositAmount);
      
      const shares = await tokenVault.previewDeposit(depositAmount); 
      
      await expect(
        tokenVault.connect(user).deposit(depositAmount, user.address)
      )
        .to.emit(tokenVault, "Deposit")
        .withArgs(
          user.address,
          user.address,
          depositAmount,
          shares
        );
      const sharesBalance = await tokenVault.balanceOf(user.address);
      expect(sharesBalance).to.equal(shares);

    });
  })
});

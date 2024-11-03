require("@nomicfoundation/hardhat-toolbox");
import * as tenderly from "@tenderly/hardhat-tenderly";

tenderly.setup({ automaticVerifications: true });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    virtual_mainnet: {
      url: "https://virtual.mainnet.rpc.tenderly.co/7d5d408b-ea9f-4d16-ac0b-e6e31dbfef44",
      chainId: 111111,
      currency: "VETH"
    },
  },
  tenderly: {
    // https://docs.tenderly.co/account/projects/account-project-slug
    project: "project",
    username: "ubaidrathor",
  },  
  
};

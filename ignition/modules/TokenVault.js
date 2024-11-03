const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("TokenVault", (m) => {
    const asset = m.getParameter("xSushi", "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272");
    const swapRouter = m.getParameter("swapRouter", "0x13C8B8bd86d53F1C54CC57C2c13Eb47d6D7eCaF9");
    const WETH = m.getParameter("WETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
    const sushi = m.getParameter("sushi", "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2");
    const factory = m.getParameter("factory", "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F");
    const name = m.getParameter("name", "xSushi Vault");
    const symbol = m.getParameter("symbol", "xSVT");
    
  const tokenVault = m.contract("TokenVault", [asset, swapRouter, WETH, sushi, factory, name, symbol]);

  return { tokenVault };
});

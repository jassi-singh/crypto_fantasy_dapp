const { ethers } = require("hardhat");

module.exports = async function (hre) {
  const { getNamedAccounts, deployments } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const cryptoFantasy = await deploy("CryptoFantasy", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("     Crypto Fantasy is Deployed at : ", cryptoFantasy.address);
};

module.exports.tags = ["all", "cryptoFantasy"];

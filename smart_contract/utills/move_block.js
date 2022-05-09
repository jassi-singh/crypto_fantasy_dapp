const { network } = require("hardhat");

async function moveBlocks(amount) {
  console.log("\tMoving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`\tMoved ${amount} blocks`);
}

module.exports = {
  moveBlocks,
};

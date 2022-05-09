const { network } = require("hardhat");

async function moveTime(amount) {
  console.log("\tMoving Time...");
  await network.provider.send("evm_increaseTime", [amount]);

  console.log(`\tMoved forward in time ${amount} seconds`);
}

module.exports = {
  moveTime,
};

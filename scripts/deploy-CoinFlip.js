const hre = require("hardhat");

async function main() {
  console.info(`Running deploy`);
  // Returns contract factory which deploys contracts
  // Second parameter, Wallet, is optional, you can either provide a wallet or leave it empty, as you've configured the account object inside hardhat.config.ts
  const simpleStorageFactory = await hre.ethers.getContractFactory(
    "CoinFlip"
  );
  // Deploy contract
  const simpleStorage = await simpleStorageFactory.deploy();
  // Wait for contract to be deployed
  await simpleStorage.waitForDeployment();
  // Call contract function
  // const tx = await simpleStorage.setNumber(5);
  // // Wait for transaction
  // await tx.wait();

  console.info(
    `Simple storage deployed to: ${await simpleStorage.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

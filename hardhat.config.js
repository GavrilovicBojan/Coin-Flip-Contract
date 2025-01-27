require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-etherscan")
require("@cronos-labs/hardhat-cronoscan");
require('@openzeppelin/hardhat-upgrades');

// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");
// require("hardhat-contract-sizer")
// require('@typechain/hardhat')

// this is for default contract
const DEFAULT_COMPILER_SETTINGS = {
  version: '0.8.20',
}

const {
  BSC_URL,
  BSC_DEPLOY_KEY,
  BSCSCAN_API_KEY,
  
  BSC_TESTNET_URL,
  BSC_TESTNET_DEPLOY_KEY,
} = require("./env.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.info(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // sourcify: {
  //   enabled: true
  // },
  networks: {
    localhost: {
      timeout: 120000
    },
    hardhat: {
      allowUnlimitedContractSize: true
    },
    bsc: {
      url: BSC_URL,
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [BSC_DEPLOY_KEY]
    },
    bsctestnet: {
      url: BSC_TESTNET_URL,
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [BSC_TESTNET_DEPLOY_KEY]
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: BSCSCAN_API_KEY
    },
  },
  sourcify: {
    enabled: true
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200
          }
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      }
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
}

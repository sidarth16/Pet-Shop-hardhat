require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { DEPLOYER_PRIVATE_KEY, TEST_USER_PRIVATE_KEY,  ALCHEMY_API_KEY} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [DEPLOYER_PRIVATE_KEY,TEST_USER_PRIVATE_KEY]
    }
  },
};
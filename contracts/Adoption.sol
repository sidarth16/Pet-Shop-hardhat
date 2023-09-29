// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// pragma solidity ^0.5.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


contract Adoption {

    address[16] public adopters;

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;

        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16] memory) {
    return adopters;
    }


}
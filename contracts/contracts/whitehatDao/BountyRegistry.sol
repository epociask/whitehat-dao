// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

contract BountyRegistry {
    address private owner;
    address[] private arr;


    function getBounties() external view returns ( address[] memory) {
        return arr;
    }

    function registerBounty(address bountyAddress) external payable returns(bool){
            arr.push(bountyAddress);
        return true;
    }

}

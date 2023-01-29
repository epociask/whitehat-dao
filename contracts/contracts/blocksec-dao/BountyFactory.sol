// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./bounty.sol";

contract BountyFactory is Ownable {

    Bounty[] bountiesCreated;

    function addNewBounty(address bountyHost_, address tokenAddress_, uint256 endTimeStamp_,
        bytes32 metaDataID_, uint256 maxSubmissions_, string memory title_, string memory description_) public {
        Bounty newBounty = new Bounty(bountyHost_, tokenAddress_, endTimeStamp_, metaDataID_, maxSubmissions_, title_, description_);
        bountiesCreated.push(newBounty);
    }

}
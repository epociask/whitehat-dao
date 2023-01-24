// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IBounty.sol";

library Lib {

    struct StakeEntry {
        uint256 amount;
        uint256 unlockTime;
        uint256 submissionTime;
    }
}

contract BlockSecToken is ERC20, Ownable {
    mapping(address => mapping(address => mapping(bytes32 => Lib.StakeEntry))) stakeRegistry;

    uint8 constant maxAccountLocks = 10;
    uint256 minimumStake;

    constructor(uint256 initialSupply, uint256 _minimumStake, address owner) ERC20("BlockSec", "BLKSEC") {
        _mint(msg.sender, initialSupply);
        _transferOwnership(owner);
        
        minimumStake = _minimumStake;
    }

    function changeMinimumStake(uint256 newAmount) public onlyOwner {
        minimumStake = newAmount;
    }

    function stakeBountySubmission(address account, uint256 amount, address bountyAddress, bytes32 vulnID) public onlyOwner {
        require(amount >= minimumStake, "Minimum stake is not above minimumStake value");

        _transfer(account, bountyAddress, amount);

        Lib.StakeEntry memory entry = Lib.StakeEntry(amount, IBounty(bountyAddress).getEndTime(), block.timestamp);
        stakeRegistry[bountyAddress][account][vulnID] = entry; 

        emit Transfer(account, address(0), amount);
    }

    function slashStake(address account, address bountyAddress, bytes32 vulnID) public onlyOwner { 
        require(stakeRegistry[bountyAddress][account][vulnID].amount > 0, "No stake entry for provided parameters");

        delete stakeRegistry[bountyAddress][account][vulnID];
    }

    // TODO - batch claim stake 
    // function batchClaimStake(address account, address bountyAddress, bytes32[] vulnIDs) external {
        
        
    // }

    function claimStake(address account, address bountyAddress, bytes32 vulnID) external {
        require(stakeRegistry[bountyAddress][account][vulnID].amount > 0, "No stake entry for provided parameters");
        require(stakeRegistry[bountyAddress][account][vulnID].unlockTime >= block.timestamp, "Stake is not unlocked yet");

        _transfer(address(0), account, stakeRegistry[bountyAddress][account][vulnID].amount);
    }
}
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


library Helpers {

    struct StakeEntry {
        uint256 amount;
        uint256 unlockTime;
        address bounty;
    }
}

contract BlockSecToken is ERC20, Ownable {
    uint8 constant maxAccountLocks = 10;
    uint256 stakeMinimum;

    constructor(uint256 initialSupply, uint256 _stakeMinimum, address owner) ERC20("BlockSec", "BLKSEC") {
        _mint(msg.sender, initialSupply);
        _changeOwner(owner);
        
        stakeMinimum = _stakeMinimum;
    }

    function stakeForBounty(address account, uint256 amount, address bounty) onlyOwner {
        // TODO - Call bounty contract to ensure amount is above set stake threshold

        require(balances[account] >= amount, "Caller must have enough");
        
        balances[account] -= amount;

        LockEntry entry = LockEntry(amount, unlockTimestamp, bounty);

        emit Transfer(account, address(0), amount);
    }
}
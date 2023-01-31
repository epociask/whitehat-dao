// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BlackList

contract BlockSecToken is ERC20 {
    
    constructor(uint256 initialSupply) ERC20("BlockSec", "BLKSEC") {
        _mint(msg.sender, initialSupply);
    }
}
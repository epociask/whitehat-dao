pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Bounty.sol";

interface IBounty {
    function getEndTime() external returns (uint256);
}

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./companyDao.sol";
import "./HackerSolBound.sol";

contract CompanyDaoFactory is Ownable {

    CompanyDao[] companyDaos;

    function createCompanyDao(string memory title, string memory description, address companyWalletAddress, address hackerSBT) public onlyOwner{

        require(IHackerSBT(hackerSBT).balanceOf(companyWalletAddress) == 0, "User must have 0 SBT's to register");

        CompanyDao newDao = new CompanyDao(title, description, companyWalletAddress);

        IHackerSBT(hackerSBT).safeMint(companyWalletAddress, Lib.Role.Company);
        companyDaos.push(newDao);
    }

    function getCompanyDaos() public view returns (CompanyDao[] memory){
        return companyDaos;
    }

}
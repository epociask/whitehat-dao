// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./companyDao.sol";

contract CompanyDaoFactory is Ownable {

    CompanyDao[] companyDaos;

    function createCompanyDao(string memory title, string memory description, address companyWalletAddress) public onlyOwner{
        CompanyDao newDao = new CompanyDao(title, description, companyWalletAddress);
        companyDaos.push(newDao);
    }

    function getCompanyDaos() public view returns (CompanyDao[] memory){
        return companyDaos;
    }

}
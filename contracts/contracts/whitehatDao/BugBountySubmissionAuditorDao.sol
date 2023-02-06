// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./HackerSoulBound.sol";

contract BugBountySubmissionAuditorDao is Ownable {

    string public title;

    // Can be in IPFS and handled via UI to make it more versatile. if we have time to change later.
    string public description;

    mapping (address => bool) bountiesReviewed;
    mapping (address => bool) membersOfDao;
    uint256 public numberOfMembers;
    address public hackerSBT;

    constructor(string memory _title, string memory _description){

        require(bytes(_title).length > 0, "title cannot be empty");
        require(bytes(_description).length > 0, "description cannot be empty");

        title = _title;
        description = _description;
    }

    event UserRegistered(address, Lib.Role);

    function setSbtFactory(address _hackerSBT) public {
        hackerSBT = _hackerSBT;
    }

    function registerAsHacker() public {

        require(IHackerSBT(hackerSBT).balanceOf(msg.sender) == 0, "User must have 0 SBTS to register");

        IHackerSBT(hackerSBT).safeMint(msg.sender, Lib.Role.Hacker);
        
        emit UserRegistered(msg.sender, Lib.Role.Hacker);
    }

    function registerBountyToBeReviewed(address bountyAddress) public onlyOwner {

        require(bountiesReviewed[bountyAddress] == false, "Bounty already registered");
        bountiesReviewed[bountyAddress] = true;
    }

    function addMemberOfDao(address auditorAddress) public onlyOwner {

        require(membersOfDao[auditorAddress] == false, "Auditor already registered");
        membersOfDao[auditorAddress] = true;
        numberOfMembers +=1;
    }

    function removeMemberOfDao(address auditorAddress) public onlyOwner {

        require(membersOfDao[auditorAddress] == true, "Auditor is not registered");
        delete membersOfDao[auditorAddress];
        numberOfMembers -=1;
    }

    function updateTitle(string memory newTitle) public onlyOwner {
        title = newTitle;
    }

    function updateDescription(string memory newDescription) public onlyOwner {
        description = newDescription;
    }

}
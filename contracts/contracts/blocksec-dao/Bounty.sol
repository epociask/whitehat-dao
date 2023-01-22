// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";


library Core {
    // TODO - Investigate additional status states
    enum SubmissionStatus{Review, Accepted, Contested, Rejected}

    struct Submission {
        address whiteHat;
        uint256 vulnStorageID;
        uint256 timeStamp;
        SubmissionStatus status;
    }
}

contract Bounty is Ownable {
    // TODO - Investigate ways in which to embed governance priveleges
    uint256 public constant minSubmissions = 10;
    uint256 public maxSubmissions;
    uint256 public submissionCount;

    // TODO - Investigate additional status states
    // NOTE - Status is conditionally derived from other state variables
    enum BountyStatus{Active, Closed}

    address public host;
    // TODO - Enable maxPool to be token DAO ERC-20 token
    uint256 public maxPool;
    uint256 public startTime;
    uint256 public endTime;
    // TODO - Consider changing single metadata IPFS ID
    string public description;
    // TODO - Consider changing single metadata IPFS ID
    string public title;
    

    mapping(bytes32 => Core.Submission) public submissions;
    mapping(address => uint) nonces;

    // Initialize contract relevant bounty data fields
    constructor(address host_, uint256 maxPool_, uint256 endTimeStamp_, string memory title_, string memory description_, uint256 maxSubmissions_) {
        // TODO - Consider specifying minimual bounty active lifetime
        require(endTimeStamp_ > block.timestamp, "End timestamp must be greater than the start timestamp");
        require(maxSubmissions_ >= minSubmissions, "Max submissions should always be greater than minSubmissions");

        description = description_;
        host = host_;
        maxPool = maxPool_;

        startTime = block.timestamp;
        endTime = endTimeStamp_;

        maxSubmissions = maxSubmissions_;
    }

    // getStatus returns the current contract status
    function getStatus() public view returns (BountyStatus) {
        if (block.timestamp >= endTime) {
            return BountyStatus.Closed;
        }

        return BountyStatus.Active; 
    }

    // updateDescription allows bounty host to update the description
    function updateDescription(string memory updatedDescription) public onlyOwner {
        description = updatedDescription;
    }

    // TODO - Make amount an ERC-20 
    // increasePool increase the current rewards pool
    function increasePool(uint256 amount) public onlyOwner {
        maxPool += amount;
    }

    function increaseDeadline(uint256 newDeadline) public onlyOwner {
        require(newDeadline > endTime, "New deadline cannot be less than the one already set");

        endTime = newDeadline;
    }

    // TODO - Make collatoral an ERC-20 token
    // ** Submission logic functionality **/   
    function submitVulnerability(address beneficiary, uint256 storageID, uint256 collatoral) public returns (bytes32) {
        require(submissionCount <= maxSubmissions-1, "Submission limit has currently been exceeded");
        require(beneficiary != host, "You cannot submit vulnerabilites as bounty host");
        
        Core.Submission memory sub = Core.Submission(msg.sender, storageID, block.timestamp, Core.SubmissionStatus.Review);
        
        // Compute UID for vulnerability.. use block.number to ensure that signatures can't be replayed 
        bytes32 id = sha256(abi.encodePacked(beneficiary, storageID, nonces[beneficiary]));

        submissions[id] = sub;
        submissionCount += 1;
        nonces[beneficiary] += 1;

        return id;
    }

    function processSubmission(bytes32 id, Core.SubmissionStatus response) public onlyOwner {
        // TODO - Add challenge deadline logic
        submissions[id].status = response;
    }
}


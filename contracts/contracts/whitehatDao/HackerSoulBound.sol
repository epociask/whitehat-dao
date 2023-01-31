pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

library Lib {
    enum Reputation{Noob, Pro, Elite, Wizzard, Buterin}
    enum Role {Hacker, Company, DAOParticipant}
}

interface IHackerSBT {
    function balanceOf(address owner) external view returns (uint256);
    function safeMint(address to, Lib.Role role) external;
}

contract HackerSoulBound is ERC721, Ownable {

    using Counters for Counters.Counter;

    mapping(uint256 => Lib.Role) private roles;
    Counters.Counter private _tokenIdCounter;
    address private submissionAuditor;



    constructor(address _submissionAuditorDao) ERC721("WhiteHatSBT", "WHSBT") {
        submissionAuditor = _submissionAuditorDao;
        transferOwnership(submissionAuditor);
    }

    function safeMint(address to, Lib.Role role) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        roles[tokenId] = role;
    }



    function getReputation(uint256 tokenId) public view returns (Lib.Reputation) {
        // TODO - Build derivation logic
        return Lib.Reputation.Noob;
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can burn it.");
        _burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256) pure internal {
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
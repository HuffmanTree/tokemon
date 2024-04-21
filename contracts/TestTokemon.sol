// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./Tokemon.sol";

// Only used in tests
contract TestTokemon is Tokemon {
    function setBalance(address owner, uint256 amount) public {
        _balances[owner] = amount;
    }

    function getBalance(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    function setOwner(uint256 tokenId, address owner) public {
        _owners[tokenId] = owner;
    }

    function getOwner(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }

    function setTokenApproval(uint256 tokenId, address approval) public {
        _tokenApprovals[tokenId] = approval;
    }

    function addOperatorApproval(address owner, address approval) public {
        _operatorApprovals[owner][approval] = true;
    }
}

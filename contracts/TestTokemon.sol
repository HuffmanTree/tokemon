// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./Tokemon.sol";

// Only used in tests
contract TestTokemon is Tokemon {
    function setName(string memory name) public {
        _name = name;
    }

    function setSymbol(string memory symbol) public {
        _symbol = symbol;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public {
        _tokenURIs[tokenId] = tokenURI;
    }

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

    function getTokenApproval(uint256 tokenId) public view returns (address) {
        return _tokenApprovals[tokenId];
    }

    function addOperatorApproval(address owner, address approval) public {
        _operatorApprovals[owner][approval] = true;
    }

    function getOperatorApproval(address owner, address approval) public view returns (bool) {
        return _operatorApprovals[owner][approval];
    }
}

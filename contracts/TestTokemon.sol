// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./Tokemon.sol";

// Only used in tests
contract TestTokemon is Tokemon {
    function setBalance(address owner, uint256 amount) public {
        _balances[owner] = amount;
    }

    function setOwner(uint256 tokenId, address owner) public {
        _owners[tokenId] = owner;
    }
}

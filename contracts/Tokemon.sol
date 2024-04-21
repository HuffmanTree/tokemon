// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./interfaces/ERC165.sol";

contract Tokemon is ERC165 {
    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == this.supportsInterface.selector;
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

contract Hello {
    function sayHello(string memory name) pure public returns(string memory) {
        return string(abi.encodePacked("Hello ", name));
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./interfaces/ERC165.sol";
import "./interfaces/ERC721.sol";

contract Tokemon is ERC165, ERC721 {
    mapping(address owner => uint256) internal _balances;
    mapping(uint256 tokenId => address) internal _owners;

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return
            interfaceID == this.supportsInterface.selector ||
            interfaceID == this.balanceOf.selector ^
                this.ownerOf.selector ^
                bytes4(keccak256("safeTransferFrom(address,address,uint256,bytes)")) ^
                bytes4(keccak256("safeTransferFrom(address,address,uint256)")) ^
                this.transferFrom.selector ^
                this.approve.selector ^
                this.setApprovalForAll.selector ^
                this.getApproved.selector ^
                this.isApprovedForAll.selector;
    }

    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "Must not be called with the zero address");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        require(_owners[tokenId] != address(0), "Owner must not be the zero address");
        return _owners[tokenId];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) external payable {}

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {}

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {}

    function approve(address _approved, uint256 _tokenId) external payable {}

    function setApprovalForAll(address _operator, bool _approved) external {}

    function getApproved(uint256 _tokenId) external view returns (address) {}

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TronWexel721
 * @dev Optional TRC-721 NFT representation of Wexels on Tron
 * @notice This is a mirror/shadow of canonical Solana Wexels
 */
contract TronWexel721 is ERC721, ERC721URIStorage, AccessControl, Pausable {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Wexel metadata
    struct WexelMetadata {
        uint256 wexelId;
        bytes32 solanaHash;      // Link to canonical Solana Wexel
        uint256 principalUsd;
        uint16 apyBasisPoints;
        uint8 lockMonths;
        uint256 createdAt;
        bool isCollateralized;
        bool isRedeemed;
    }

    mapping(uint256 => WexelMetadata) public wexelMetadata;
    mapping(bytes32 => uint256) public solanaHashToTokenId;

    uint256 private _nextTokenId;

    // Events
    event WexelMinted(
        uint256 indexed tokenId,
        address indexed to,
        bytes32 solanaHash,
        uint256 principalUsd,
        uint16 apyBasisPoints
    );

    event CollateralFlagSet(uint256 indexed tokenId, bool isCollateralized);
    event WexelRedeemed(uint256 indexed tokenId);

    /**
     * @dev Constructor
     */
    constructor() ERC721("Tron Wexel", "TWXL") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        _nextTokenId = 1;
    }

    /**
     * @notice Mint a new Wexel NFT
     * @param to Recipient address
     * @param wexelId Wexel ID (matches Solana)
     * @param solanaHash Hash linking to Solana Wexel
     * @param principalUsd Principal amount in USD
     * @param apyBasisPoints APY in basis points
     * @param lockMonths Lock period in months
     */
    function mint(
        address to,
        uint256 wexelId,
        bytes32 solanaHash,
        uint256 principalUsd,
        uint16 apyBasisPoints,
        uint8 lockMonths
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(solanaHashToTokenId[solanaHash] == 0, "Wexel already minted");

        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);

        wexelMetadata[tokenId] = WexelMetadata({
            wexelId: wexelId,
            solanaHash: solanaHash,
            principalUsd: principalUsd,
            apyBasisPoints: apyBasisPoints,
            lockMonths: lockMonths,
            createdAt: block.timestamp,
            isCollateralized: false,
            isRedeemed: false
        });

        solanaHashToTokenId[solanaHash] = tokenId;

        emit WexelMinted(tokenId, to, solanaHash, principalUsd, apyBasisPoints);

        return tokenId;
    }

    /**
     * @notice Set collateral flag
     * @param tokenId Token ID
     * @param flag Collateral status
     */
    function setCollateralFlag(uint256 tokenId, bool flag) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        wexelMetadata[tokenId].isCollateralized = flag;

        emit CollateralFlagSet(tokenId, flag);
    }

    /**
     * @notice Mark Wexel as redeemed
     * @param tokenId Token ID
     */
    function markRedeemed(uint256 tokenId) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(!wexelMetadata[tokenId].isRedeemed, "Already redeemed");

        wexelMetadata[tokenId].isRedeemed = true;

        emit WexelRedeemed(tokenId);
    }

    /**
     * @notice Set token URI
     * @param tokenId Token ID
     * @param uri Token URI
     */
    function setTokenURI(uint256 tokenId, string memory uri) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        _setTokenURI(tokenId, uri);
    }

    /**
     * @notice Get Wexel metadata
     * @param tokenId Token ID
     * @return WexelMetadata struct
     */
    function getWexelMetadata(uint256 tokenId) 
        external 
        view 
        returns (WexelMetadata memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return wexelMetadata[tokenId];
    }

    /**
     * @notice Get token ID by Solana hash
     * @param solanaHash Solana Wexel hash
     * @return uint256 Token ID (0 if not found)
     */
    function getTokenIdBySolanaHash(bytes32 solanaHash) 
        external 
        view 
        returns (uint256) 
    {
        return solanaHashToTokenId[solanaHash];
    }

    /**
     * @notice Pause minting
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause minting
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Override transfer to prevent transfers of collateralized Wexels
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        // Prevent transfer of collateralized Wexels
        if (wexelMetadata[tokenId].isCollateralized && to != address(0)) {
            revert("Cannot transfer collateralized Wexel");
        }

        return super._update(to, tokenId, auth);
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

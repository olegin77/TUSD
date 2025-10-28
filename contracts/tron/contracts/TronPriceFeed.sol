// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TronPriceFeed
 * @dev Price oracle for boost tokens on Tron network
 * @notice Aggregates prices from multiple sources with fallback mechanism
 */
contract TronPriceFeed is AccessControl, ReentrancyGuard {
    // Roles
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Price data structure
    struct PriceData {
        uint256 price;          // Price in USD (8 decimals)
        uint256 timestamp;      // Last update timestamp
        uint256 confidence;     // Confidence level (0-10000 basis points)
        address[] sources;      // Price sources used
        bool isValid;           // Is price valid
    }

    // Token prices
    mapping(address => PriceData) public prices;
    address[] public supportedTokens;

    // Price source weights (basis points, total = 10000)
    uint16 public constant CHAINLINK_WEIGHT = 5000;  // 50%
    uint16 public constant DEX_TWAP_WEIGHT = 3000;   // 30%
    uint16 public constant MANUAL_WEIGHT = 2000;     // 20%

    // Price deviation threshold (basis points)
    uint16 public maxDeviationBP = 150; // 1.5%

    // Stale price threshold
    uint256 public stalePriceThreshold = 30 minutes;

    // Events
    event PriceUpdated(
        address indexed token,
        uint256 price,
        uint256 confidence,
        uint256 timestamp,
        address[] sources
    );

    event ManualPriceSet(
        address indexed token,
        uint256 price,
        address indexed setter,
        string reason
    );

    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event ConfigUpdated(uint16 maxDeviationBP, uint256 stalePriceThreshold);

    /**
     * @dev Constructor
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }

    /**
     * @notice Add a supported token
     * @param token Token address
     */
    function addToken(address token) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "Invalid token address");
        require(!prices[token].isValid, "Token already added");

        supportedTokens.push(token);
        
        // Initialize with invalid price
        prices[token] = PriceData({
            price: 0,
            timestamp: 0,
            confidence: 0,
            sources: new address[](0),
            isValid: false
        });

        emit TokenAdded(token);
    }

    /**
     * @notice Update token price
     * @param token Token address
     * @param price Price in USD (8 decimals)
     * @param confidence Confidence level (0-10000)
     * @param sources Price sources
     */
    function updatePrice(
        address token,
        uint256 price,
        uint256 confidence,
        address[] memory sources
    ) external onlyRole(ORACLE_ROLE) nonReentrant {
        require(prices[token].isValid || supportedTokens.length > 0, "Token not supported");
        require(price > 0, "Invalid price");
        require(confidence <= 10000, "Invalid confidence");

        // Validate price deviation if previous price exists
        if (prices[token].price > 0 && !_isPriceStale(token)) {
            uint256 deviation = _calculateDeviation(prices[token].price, price);
            require(deviation <= maxDeviationBP, "Price deviation too high");
        }

        prices[token] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence,
            sources: sources,
            isValid: true
        });

        emit PriceUpdated(token, price, confidence, block.timestamp, sources);
    }

    /**
     * @notice Set manual price (requires ADMIN_ROLE)
     * @param token Token address
     * @param price Price in USD (8 decimals)
     * @param reason Reason for manual price update
     */
    function setManualPrice(
        address token,
        uint256 price,
        string calldata reason
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        require(price > 0, "Invalid price");
        require(bytes(reason).length > 0, "Reason required");

        address[] memory sources = new address[](1);
        sources[0] = msg.sender;

        prices[token] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: MANUAL_WEIGHT, // Lower confidence for manual prices
            sources: sources,
            isValid: true
        });

        emit ManualPriceSet(token, price, msg.sender, reason);
        emit PriceUpdated(token, price, MANUAL_WEIGHT, block.timestamp, sources);
    }

    /**
     * @notice Get token price
     * @param token Token address
     * @return price Price in USD (8 decimals)
     * @return timestamp Last update timestamp
     * @return isValid Is price valid and not stale
     */
    function getPrice(address token) 
        external 
        view 
        returns (
            uint256 price,
            uint256 timestamp,
            bool isValid
        ) 
    {
        PriceData memory data = prices[token];
        bool notStale = !_isPriceStale(token);
        
        return (
            data.price,
            data.timestamp,
            data.isValid && notStale
        );
    }

    /**
     * @notice Get detailed price data
     * @param token Token address
     * @return PriceData struct
     */
    function getPriceData(address token) 
        external 
        view 
        returns (PriceData memory) 
    {
        return prices[token];
    }

    /**
     * @notice Check if price is stale
     * @param token Token address
     * @return bool True if stale
     */
    function isPriceStale(address token) external view returns (bool) {
        return _isPriceStale(token);
    }

    /**
     * @notice Update configuration
     * @param _maxDeviationBP Max price deviation in basis points
     * @param _stalePriceThreshold Stale price threshold in seconds
     */
    function updateConfig(
        uint16 _maxDeviationBP,
        uint256 _stalePriceThreshold
    ) external onlyRole(ADMIN_ROLE) {
        require(_maxDeviationBP <= 1000, "Deviation too high"); // Max 10%
        require(_stalePriceThreshold >= 5 minutes, "Threshold too low");

        maxDeviationBP = _maxDeviationBP;
        stalePriceThreshold = _stalePriceThreshold;

        emit ConfigUpdated(_maxDeviationBP, _stalePriceThreshold);
    }

    /**
     * @notice Get all supported tokens
     * @return Array of token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /**
     * @notice Get multiple prices at once
     * @param tokens Array of token addresses
     * @return prices Array of prices
     * @return timestamps Array of timestamps
     * @return validFlags Array of validity flags
     */
    function getPrices(address[] calldata tokens)
        external
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            bool[] memory
        )
    {
        uint256 length = tokens.length;
        uint256[] memory priceArray = new uint256[](length);
        uint256[] memory timestampArray = new uint256[](length);
        bool[] memory validArray = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            PriceData memory data = prices[tokens[i]];
            bool notStale = !_isPriceStale(tokens[i]);
            
            priceArray[i] = data.price;
            timestampArray[i] = data.timestamp;
            validArray[i] = data.isValid && notStale;
        }

        return (priceArray, timestampArray, validArray);
    }

    /**
     * @dev Check if price is stale (internal)
     */
    function _isPriceStale(address token) internal view returns (bool) {
        if (!prices[token].isValid) return true;
        return block.timestamp - prices[token].timestamp > stalePriceThreshold;
    }

    /**
     * @dev Calculate price deviation in basis points
     */
    function _calculateDeviation(
        uint256 oldPrice,
        uint256 newPrice
    ) internal pure returns (uint256) {
        if (oldPrice == 0) return 0;
        
        uint256 diff = oldPrice > newPrice 
            ? oldPrice - newPrice 
            : newPrice - oldPrice;
        
        return (diff * 10000) / oldPrice;
    }
}

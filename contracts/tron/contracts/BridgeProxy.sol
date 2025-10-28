// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title BridgeProxy
 * @dev Cross-chain bridge proxy for Tron <-> Solana communication
 * @notice Publishes proofs and events for cross-chain verification
 */
contract BridgeProxy is AccessControl, ReentrancyGuard, Pausable {
    // Roles
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Message types
    enum MessageType {
        DEPOSIT,
        WITHDRAWAL,
        WEXEL_MINT,
        COLLATERAL_UPDATE,
        PRICE_UPDATE
    }

    // Cross-chain message
    struct CrossChainMessage {
        uint256 id;
        MessageType messageType;
        bytes32 sourceChain;    // "TRON" or "SOLANA"
        bytes32 targetChain;
        bytes32 sender;
        bytes payload;
        uint256 timestamp;
        uint256 nonce;
        bool processed;
        uint8 validatorConfirmations;
    }

    // Message storage
    mapping(uint256 => CrossChainMessage) public messages;
    uint256 public nextMessageId;

    // Validator confirmations
    mapping(uint256 => mapping(address => bool)) public messageConfirmations;

    // Required confirmations
    uint8 public requiredConfirmations = 2;

    // Nonce tracking (prevent replay attacks)
    mapping(bytes32 => mapping(uint256 => bool)) public usedNonces;

    // Chain identifiers
    bytes32 public constant TRON_CHAIN = keccak256("TRON");
    bytes32 public constant SOLANA_CHAIN = keccak256("SOLANA");

    // Events
    event MessageCreated(
        uint256 indexed messageId,
        MessageType messageType,
        bytes32 sourceChain,
        bytes32 targetChain,
        bytes32 sender,
        bytes payload,
        uint256 nonce
    );

    event MessageConfirmed(
        uint256 indexed messageId,
        address indexed validator,
        uint8 totalConfirmations
    );

    event MessageProcessed(
        uint256 indexed messageId,
        bytes32 targetChain
    );

    event DepositBridged(
        uint256 indexed depositId,
        bytes32 solanaOwner,
        uint256 amount,
        uint8 poolId
    );

    event WexelMinted(
        uint256 indexed wexelId,
        uint256 depositId,
        bytes32 solanaOwner
    );

    event ConfigUpdated(uint8 requiredConfirmations);

    /**
     * @dev Constructor
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(BRIDGE_ROLE, msg.sender);
        
        nextMessageId = 1;
    }

    /**
     * @notice Create a cross-chain message
     * @param messageType Type of message
     * @param targetChain Target blockchain
     * @param sender Sender address hash
     * @param payload Message payload
     * @param nonce Unique nonce
     */
    function createMessage(
        MessageType messageType,
        bytes32 targetChain,
        bytes32 sender,
        bytes memory payload,
        uint256 nonce
    ) external onlyRole(BRIDGE_ROLE) whenNotPaused returns (uint256) {
        require(targetChain == TRON_CHAIN || targetChain == SOLANA_CHAIN, "Invalid target chain");
        require(!usedNonces[sender][nonce], "Nonce already used");

        uint256 messageId = nextMessageId++;
        bytes32 sourceChain = TRON_CHAIN; // This contract is on Tron

        messages[messageId] = CrossChainMessage({
            id: messageId,
            messageType: messageType,
            sourceChain: sourceChain,
            targetChain: targetChain,
            sender: sender,
            payload: payload,
            timestamp: block.timestamp,
            nonce: nonce,
            processed: false,
            validatorConfirmations: 0
        });

        usedNonces[sender][nonce] = true;

        emit MessageCreated(
            messageId,
            messageType,
            sourceChain,
            targetChain,
            sender,
            payload,
            nonce
        );

        return messageId;
    }

    /**
     * @notice Confirm a message (validator only)
     * @param messageId Message ID
     */
    function confirmMessage(uint256 messageId) 
        external 
        onlyRole(VALIDATOR_ROLE) 
        nonReentrant 
    {
        CrossChainMessage storage message = messages[messageId];
        require(message.id != 0, "Message does not exist");
        require(!message.processed, "Message already processed");
        require(!messageConfirmations[messageId][msg.sender], "Already confirmed");

        messageConfirmations[messageId][msg.sender] = true;
        message.validatorConfirmations++;

        emit MessageConfirmed(
            messageId,
            msg.sender,
            message.validatorConfirmations
        );

        // Auto-process if enough confirmations
        if (message.validatorConfirmations >= requiredConfirmations) {
            _processMessage(messageId);
        }
    }

    /**
     * @notice Bridge a deposit to Solana
     * @param depositId Deposit ID on Tron
     * @param solanaOwner Solana wallet address
     * @param amount Deposit amount
     * @param poolId Pool ID
     */
    function bridgeDeposit(
        uint256 depositId,
        bytes32 solanaOwner,
        uint256 amount,
        uint8 poolId
    ) external onlyRole(BRIDGE_ROLE) {
        bytes memory payload = abi.encode(depositId, solanaOwner, amount, poolId);
        
        uint256 messageId = this.createMessage(
            MessageType.DEPOSIT,
            SOLANA_CHAIN,
            solanaOwner,
            payload,
            depositId // Use depositId as nonce
        );

        emit DepositBridged(depositId, solanaOwner, amount, poolId);
    }

    /**
     * @notice Notify Wexel minted on Solana
     * @param wexelId Wexel ID on Solana
     * @param depositId Original deposit ID on Tron
     * @param solanaOwner Owner address
     */
    function notifyWexelMinted(
        uint256 wexelId,
        uint256 depositId,
        bytes32 solanaOwner
    ) external onlyRole(BRIDGE_ROLE) {
        emit WexelMinted(wexelId, depositId, solanaOwner);
    }

    /**
     * @notice Update required confirmations
     * @param _requiredConfirmations New required confirmations (1-10)
     */
    function updateRequiredConfirmations(uint8 _requiredConfirmations) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(_requiredConfirmations > 0 && _requiredConfirmations <= 10, "Invalid confirmations");
        requiredConfirmations = _requiredConfirmations;
        
        emit ConfigUpdated(_requiredConfirmations);
    }

    /**
     * @notice Pause bridge operations
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause bridge operations
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Get message details
     * @param messageId Message ID
     * @return CrossChainMessage struct
     */
    function getMessage(uint256 messageId) 
        external 
        view 
        returns (CrossChainMessage memory) 
    {
        return messages[messageId];
    }

    /**
     * @notice Check if validator confirmed message
     * @param messageId Message ID
     * @param validator Validator address
     * @return bool Confirmation status
     */
    function hasConfirmed(uint256 messageId, address validator) 
        external 
        view 
        returns (bool) 
    {
        return messageConfirmations[messageId][validator];
    }

    /**
     * @notice Get pending messages count
     * @return uint256 Count of unprocessed messages
     */
    function getPendingMessagesCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextMessageId; i++) {
            if (!messages[i].processed) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Internal function to process message
     */
    function _processMessage(uint256 messageId) internal {
        CrossChainMessage storage message = messages[messageId];
        require(!message.processed, "Already processed");
        require(
            message.validatorConfirmations >= requiredConfirmations,
            "Not enough confirmations"
        );

        message.processed = true;

        emit MessageProcessed(messageId, message.targetChain);
    }

    /**
     * @notice Manual process message (admin emergency)
     * @param messageId Message ID
     */
    function manualProcessMessage(uint256 messageId) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        _processMessage(messageId);
    }
}

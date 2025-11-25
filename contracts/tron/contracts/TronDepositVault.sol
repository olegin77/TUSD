// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TronDepositVault
 * @dev Accepts TRC-20 USDT deposits and emits events for cross-chain indexing
 * @notice This contract is part of the USDX/Wexel platform on Tron
 */
contract TronDepositVault is ReentrancyGuard, AccessControl, Pausable {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

    // USDT Token on Tron (TRC-20)
    IERC20 public immutable usdtToken;

    // Deposit tracking
    uint256 public nextDepositId;
    uint256 public totalDeposits;
    uint256 public totalDepositAmount;

    // Minimum deposit amount (in USDT, 6 decimals)
    uint256 public minDepositAmount = 100 * 1e6; // $100

    // Pool configurations
    struct Pool {
        uint8 id;
        uint16 apyBasisPoints; // 1800 = 18%
        uint8 lockMonths;      // 12-36 months
        uint64 minDepositUsd;
        bool isActive;
    }

    mapping(uint8 => Pool) public pools;
    uint8[] public poolIds;

    // Deposit records
    struct Deposit {
        uint256 id;
        address depositor;
        uint8 poolId;
        uint256 amount;
        bytes32 solanaOwner; // Solana address hash for cross-chain
        uint256 timestamp;
        bool processed;
    }

    mapping(uint256 => Deposit) public deposits;
    mapping(address => uint256[]) public userDeposits;

    // Events
    event DepositCreated(
        uint256 indexed depositId,
        address indexed depositor,
        uint8 poolId,
        uint256 amount,
        bytes32 solanaOwner,
        uint256 timestamp
    );

    event DepositProcessed(uint256 indexed depositId, uint256 wexelId);
    
    event PoolCreated(uint8 indexed poolId, uint16 apyBasisPoints, uint8 lockMonths);
    event PoolUpdated(uint8 indexed poolId, bool isActive);
    event MinDepositUpdated(uint256 oldAmount, uint256 newAmount);
    event EmergencyWithdraw(address indexed token, address indexed to, uint256 amount);
    event RewardPayout(
        uint256 indexed depositId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Constructor
     * @param _usdtToken Address of USDT token on Tron
     */
    constructor(address _usdtToken) {
        require(_usdtToken != address(0), "Invalid USDT address");
        
        usdtToken = IERC20(_usdtToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        nextDepositId = 1;
    }

    /**
     * @notice Create a new pool
     * @param poolId Pool identifier (1-10)
     * @param apyBasisPoints APY in basis points (1800 = 18%)
     * @param lockMonths Lock period in months (12-36)
     * @param minDepositUsd Minimum deposit in USD (with 6 decimals)
     */
    function createPool(
        uint8 poolId,
        uint16 apyBasisPoints,
        uint8 lockMonths,
        uint64 minDepositUsd
    ) external onlyRole(ADMIN_ROLE) {
        require(poolId > 0 && poolId <= 10, "Invalid pool ID");
        require(pools[poolId].id == 0, "Pool already exists");
        require(apyBasisPoints >= 1800 && apyBasisPoints <= 3600, "Invalid APY");
        require(lockMonths >= 12 && lockMonths <= 36, "Invalid lock period");

        pools[poolId] = Pool({
            id: poolId,
            apyBasisPoints: apyBasisPoints,
            lockMonths: lockMonths,
            minDepositUsd: minDepositUsd,
            isActive: true
        });

        poolIds.push(poolId);

        emit PoolCreated(poolId, apyBasisPoints, lockMonths);
    }

    /**
     * @notice Deposit USDT and create cross-chain record
     * @param poolId Pool to deposit into
     * @param amount Amount of USDT (6 decimals)
     * @param solanaOwner Solana wallet address (32 bytes)
     */
    function depositUSDT(
        uint8 poolId,
        uint256 amount,
        bytes32 solanaOwner
    ) external nonReentrant whenNotPaused returns (uint256) {
        // Validate inputs
        require(amount >= minDepositAmount, "Amount below minimum");
        require(solanaOwner != bytes32(0), "Invalid Solana address");
        
        Pool memory pool = pools[poolId];
        require(pool.id != 0, "Pool does not exist");
        require(pool.isActive, "Pool is not active");
        require(amount >= pool.minDepositUsd, "Amount below pool minimum");

        // Transfer USDT from user
        usdtToken.safeTransferFrom(msg.sender, address(this), amount);

        // Create deposit record
        uint256 depositId = nextDepositId++;
        
        deposits[depositId] = Deposit({
            id: depositId,
            depositor: msg.sender,
            poolId: poolId,
            amount: amount,
            solanaOwner: solanaOwner,
            timestamp: block.timestamp,
            processed: false
        });

        userDeposits[msg.sender].push(depositId);

        // Update totals
        totalDeposits++;
        totalDepositAmount += amount;

        // Emit event for cross-chain indexing
        emit DepositCreated(
            depositId,
            msg.sender,
            poolId,
            amount,
            solanaOwner,
            block.timestamp
        );

        return depositId;
    }

    /**
     * @notice Mark deposit as processed (called by bridge)
     * @param depositId Deposit ID
     * @param wexelId Corresponding Wexel ID on Solana
     */
    function markDepositProcessed(
        uint256 depositId,
        uint256 wexelId
    ) external onlyRole(BRIDGE_ROLE) {
        require(deposits[depositId].id != 0, "Deposit does not exist");
        require(!deposits[depositId].processed, "Already processed");

        deposits[depositId].processed = true;

        emit DepositProcessed(depositId, wexelId);
    }

    /**
     * @notice Update pool status
     * @param poolId Pool ID
     * @param isActive New status
     */
    function updatePoolStatus(
        uint8 poolId,
        bool isActive
    ) external onlyRole(ADMIN_ROLE) {
        require(pools[poolId].id != 0, "Pool does not exist");
        pools[poolId].isActive = isActive;

        emit PoolUpdated(poolId, isActive);
    }

    /**
     * @notice Update minimum deposit amount
     * @param newAmount New minimum (6 decimals)
     */
    function updateMinDeposit(uint256 newAmount) external onlyRole(ADMIN_ROLE) {
        require(newAmount > 0, "Invalid amount");
        uint256 oldAmount = minDepositAmount;
        minDepositAmount = newAmount;

        emit MinDepositUpdated(oldAmount, newAmount);
    }

    /**
     * @notice Pause deposits
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause deposits
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (admin only)
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), "Invalid recipient");

        IERC20(token).safeTransfer(to, amount);

        emit EmergencyWithdraw(token, to, amount);
    }

    /**
     * @notice Payout USDT rewards to depositor
     * @dev Called by backend after calculating rewards (with Laika boost, frequency multiplier)
     * @param depositId The deposit ID
     * @param recipient The recipient address
     * @param amount The calculated reward amount (6 decimals)
     */
    function payoutReward(
        uint256 depositId,
        address recipient,
        uint256 amount
    ) external nonReentrant onlyRole(BRIDGE_ROLE) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(deposits[depositId].id != 0, "Deposit does not exist");
        require(deposits[depositId].processed, "Deposit not processed");

        // Check vault has sufficient balance
        uint256 vaultBalance = usdtToken.balanceOf(address(this));
        require(vaultBalance >= amount, "Insufficient vault balance");

        // Transfer reward to recipient
        usdtToken.safeTransfer(recipient, amount);

        emit RewardPayout(depositId, recipient, amount, block.timestamp);
    }

    /**
     * @notice Batch payout rewards to multiple depositors
     * @dev More gas efficient for multiple payouts
     * @param depositIds Array of deposit IDs
     * @param recipients Array of recipient addresses
     * @param amounts Array of reward amounts
     */
    function batchPayoutRewards(
        uint256[] calldata depositIds,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant onlyRole(BRIDGE_ROLE) {
        require(
            depositIds.length == recipients.length &&
            recipients.length == amounts.length,
            "Array length mismatch"
        );
        require(depositIds.length <= 50, "Too many payouts");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        uint256 vaultBalance = usdtToken.balanceOf(address(this));
        require(vaultBalance >= totalAmount, "Insufficient vault balance");

        for (uint256 i = 0; i < depositIds.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be positive");
            require(deposits[depositIds[i]].id != 0, "Deposit does not exist");

            usdtToken.safeTransfer(recipients[i], amounts[i]);

            emit RewardPayout(depositIds[i], recipients[i], amounts[i], block.timestamp);
        }
    }

    /**
     * @notice Get vault USDT balance
     * @return Current USDT balance of the vault
     */
    function getVaultBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }

    /**
     * @notice Get user's deposit history
     * @param user User address
     * @return Array of deposit IDs
     */
    function getUserDeposits(address user) external view returns (uint256[] memory) {
        return userDeposits[user];
    }

    /**
     * @notice Get deposit details
     * @param depositId Deposit ID
     * @return Deposit struct
     */
    function getDeposit(uint256 depositId) external view returns (Deposit memory) {
        return deposits[depositId];
    }

    /**
     * @notice Get all pool IDs
     * @return Array of pool IDs
     */
    function getAllPools() external view returns (uint8[] memory) {
        return poolIds;
    }

    /**
     * @notice Get pool details
     * @param poolId Pool ID
     * @return Pool struct
     */
    function getPool(uint8 poolId) external view returns (Pool memory) {
        return pools[poolId];
    }

    /**
     * @notice Get contract statistics
     * @return totalDeposits Total number of deposits
     * @return totalDepositAmount Total amount deposited
     * @return nextDepositId Next deposit ID
     */
    function getStats() external view returns (
        uint256,
        uint256,
        uint256
    ) {
        return (totalDeposits, totalDepositAmount, nextDepositId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GEGTraceability
 * @notice On-chain traceability for recycled materials — GreenEcoGenius
 * @dev Only stores SHA-256 hashes. Full data lives off-chain in Supabase.
 */
contract GEGTraceability {
    address public owner;

    struct LotRecord {
        bytes32 dataHash;
        uint256 timestamp;
        address registeredBy;
        uint8 status; // 0=created, 1=in_transit, 2=delivered, 3=certified
    }

    mapping(string => LotRecord) public lots;
    mapping(string => bytes32[]) public lotHistory;
    mapping(address => bool) public authorizedOperators;

    uint256 public totalLots;
    uint256 public totalCertificates;

    event LotRegistered(string indexed lotId, bytes32 dataHash, uint256 timestamp);
    event LotUpdated(string indexed lotId, bytes32 newHash, uint8 newStatus);
    event CertificateIssued(string indexed lotId, bytes32 certHash);
    event OperatorAdded(address indexed operator);
    event OperatorRemoved(address indexed operator);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedOperators[msg.sender],
            "Not authorized"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedOperators[msg.sender] = true;
    }

    function addOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = true;
        emit OperatorAdded(operator);
    }

    function removeOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = false;
        emit OperatorRemoved(operator);
    }

    function registerLot(
        string calldata lotId,
        bytes32 dataHash
    ) external onlyAuthorized {
        require(lots[lotId].timestamp == 0, "Lot already exists");

        lots[lotId] = LotRecord({
            dataHash: dataHash,
            timestamp: block.timestamp,
            registeredBy: msg.sender,
            status: 0
        });

        lotHistory[lotId].push(dataHash);
        totalLots++;

        emit LotRegistered(lotId, dataHash, block.timestamp);
    }

    function updateLotStatus(
        string calldata lotId,
        bytes32 newHash,
        uint8 status
    ) external onlyAuthorized {
        require(lots[lotId].timestamp != 0, "Lot not found");
        require(status <= 3, "Invalid status");

        lots[lotId].dataHash = newHash;
        lots[lotId].status = status;
        lots[lotId].timestamp = block.timestamp;

        lotHistory[lotId].push(newHash);

        emit LotUpdated(lotId, newHash, status);
    }

    function issueCertificate(
        string calldata lotId,
        bytes32 certHash
    ) external onlyAuthorized {
        require(lots[lotId].timestamp != 0, "Lot not found");

        lots[lotId].status = 3; // certified
        lotHistory[lotId].push(certHash);
        totalCertificates++;

        emit CertificateIssued(lotId, certHash);
    }

    function verifyLot(
        string calldata lotId
    ) external view returns (LotRecord memory) {
        return lots[lotId];
    }

    function getLotHistory(
        string calldata lotId
    ) external view returns (bytes32[] memory) {
        return lotHistory[lotId];
    }

    function getLotStatus(
        string calldata lotId
    ) external view returns (uint8) {
        return lots[lotId].status;
    }
}

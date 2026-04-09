import { createHash } from 'crypto';

// Contract ABI (minimal — only the functions we call)
const CONTRACT_ABI = [
  'function registerLot(string calldata lotId, bytes32 dataHash) external',
  'function updateLotStatus(string calldata lotId, bytes32 newHash, uint8 status) external',
  'function issueCertificate(string calldata lotId, bytes32 certHash) external',
  'function verifyLot(string calldata lotId) external view returns (tuple(bytes32 dataHash, uint256 timestamp, address registeredBy, uint8 status))',
  'function getLotHistory(string calldata lotId) external view returns (bytes32[])',
  'function totalLots() external view returns (uint256)',
  'function totalCertificates() external view returns (uint256)',
  'event LotRegistered(string indexed lotId, bytes32 dataHash, uint256 timestamp)',
  'event LotUpdated(string indexed lotId, bytes32 newHash, uint8 newStatus)',
  'event CertificateIssued(string indexed lotId, bytes32 certHash)',
];

interface LotData {
  lotId: string;
  materialType: string;
  weightKg: number;
  sellerName: string;
  buyerName: string;
  co2Avoided: number;
  originLocation?: string;
  destinationLocation?: string;
}

interface TransactionResult {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  dataHash: string;
  success: boolean;
}

interface VerificationResult {
  exists: boolean;
  dataHash: string;
  timestamp: number;
  registeredBy: string;
  status: number; // 0=created, 1=in_transit, 2=delivered, 3=certified
  statusLabel: string;
  history: string[];
}

/**
 * Compute SHA-256 hash of data object
 */
export function computeDataHash(data: object): string {
  const json = JSON.stringify(data, Object.keys(data).sort());
  return '0x' + createHash('sha256').update(json).digest('hex');
}

/**
 * Get ethers provider and contract instance
 * Only call this server-side (API routes)
 */
async function getContractInstance() {
  const { ethers } = await import('ethers');

  const rpcUrl = process.env.ALCHEMY_RPC_URL;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error(
      'Missing blockchain config: ALCHEMY_RPC_URL, DEPLOYER_PRIVATE_KEY, or CONTRACT_ADDRESS',
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contract = new ethers.Contract(
    contractAddress,
    CONTRACT_ABI,
    wallet,
  ) as any;

  return { provider, wallet, contract };
}

/**
 * Get read-only contract instance (no wallet needed)
 */
async function getReadOnlyContract() {
  const { ethers } = await import('ethers');

  const rpcUrl = process.env.ALCHEMY_RPC_URL;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    return null;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contract = new ethers.Contract(
    contractAddress,
    CONTRACT_ABI,
    provider,
  ) as any;

  return { provider, contract };
}

/**
 * Register a lot on the blockchain
 */
export async function registerLotOnChain(
  lotData: LotData,
): Promise<TransactionResult> {
  const { contract } = await getContractInstance();

  const dataHash = computeDataHash({
    lotId: lotData.lotId,
    materialType: lotData.materialType,
    weightKg: lotData.weightKg,
    seller: lotData.sellerName,
    buyer: lotData.buyerName,
    co2Avoided: lotData.co2Avoided,
    origin: lotData.originLocation,
    destination: lotData.destinationLocation,
    timestamp: Date.now(),
    platform: 'GreenEcoGenius',
  });

  const tx = await contract.registerLot(lotData.lotId, dataHash);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    dataHash,
    success: receipt.status === 1,
  };
}

/**
 * Update lot status on-chain
 */
export async function updateLotStatusOnChain(
  lotId: string,
  status: number,
  newData: object,
): Promise<TransactionResult> {
  const { contract } = await getContractInstance();

  const newHash = computeDataHash({
    ...newData,
    status,
    updatedAt: Date.now(),
  });

  const tx = await contract.updateLotStatus(lotId, newHash, status);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    dataHash: newHash,
    success: receipt.status === 1,
  };
}

/**
 * Issue certificate on-chain
 */
export async function issueCertificateOnChain(
  lotId: string,
  certificateData: object,
): Promise<TransactionResult> {
  const { contract } = await getContractInstance();

  const certHash = computeDataHash({
    ...certificateData,
    issuedAt: Date.now(),
    platform: 'GreenEcoGenius',
  });

  const tx = await contract.issueCertificate(lotId, certHash);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    dataHash: certHash,
    success: receipt.status === 1,
  };
}

/**
 * Verify a lot on-chain (read-only, free)
 */
export async function verifyLotOnChain(
  lotId: string,
): Promise<VerificationResult | null> {
  const instance = await getReadOnlyContract();
  if (!instance) return null;

  const { contract } = instance;

  try {
    const record = await contract.verifyLot(lotId);
    const history = await contract.getLotHistory(lotId);

    const timestamp = Number(record.timestamp);

    if (timestamp === 0) {
      return {
        exists: false,
        dataHash: '',
        timestamp: 0,
        registeredBy: '',
        status: 0,
        statusLabel: 'unknown',
        history: [],
      };
    }

    const statusLabels = ['created', 'in_transit', 'delivered', 'certified'];

    return {
      exists: true,
      dataHash: record.dataHash,
      timestamp,
      registeredBy: record.registeredBy,
      status: Number(record.status),
      statusLabel: statusLabels[Number(record.status)] ?? 'unknown',
      history: history.map((h: string) => h),
    };
  } catch {
    return null;
  }
}

/**
 * Get blockchain stats (total lots, certificates)
 */
export async function getBlockchainStats(): Promise<{
  totalLots: number;
  totalCertificates: number;
  contractAddress: string;
  network: string;
} | null> {
  const instance = await getReadOnlyContract();
  if (!instance) return null;

  const { contract } = instance;

  try {
    const [totalLots, totalCertificates] = await Promise.all([
      contract.totalLots(),
      contract.totalCertificates(),
    ]);

    return {
      totalLots: Number(totalLots),
      totalCertificates: Number(totalCertificates),
      contractAddress: process.env.CONTRACT_ADDRESS ?? '',
      network: 'Polygon Mainnet',
    };
  } catch {
    return null;
  }
}

export const statusLabels: Record<number, string> = {
  0: 'Créé',
  1: 'En transit',
  2: 'Livré',
  3: 'Certifié',
};

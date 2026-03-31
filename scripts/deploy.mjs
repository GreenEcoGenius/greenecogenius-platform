import { ethers } from 'ethers';
import solc from 'solc';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const RPC_URL = process.env.ALCHEMY_RPC_URL;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  console.error('Set ALCHEMY_RPC_URL and DEPLOYER_PRIVATE_KEY');
  process.exit(1);
}

// Read contract source
const source = readFileSync(
  resolve(__dirname, '../contracts/GEGTraceability.sol'),
  'utf8',
);

// Compile with solc
const input = JSON.stringify({
  language: 'Solidity',
  sources: { 'GEGTraceability.sol': { content: source } },
  settings: {
    outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } },
    optimizer: { enabled: true, runs: 200 },
  },
});

console.log('Compiling contract...');
const output = JSON.parse(solc.compile(input));

if (output.errors) {
  const errors = output.errors.filter((e) => e.severity === 'error');
  if (errors.length > 0) {
    console.error('Compilation errors:', errors.map((e) => e.message).join('\n'));
    process.exit(1);
  }
}

const compiled = output.contracts['GEGTraceability.sol']['GEGTraceability'];
const abi = compiled.abi;
const bytecode = '0x' + compiled.evm.bytecode.object;

console.log('Contract compiled successfully');
console.log('Bytecode size:', bytecode.length / 2, 'bytes');

// Deploy
async function deploy() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const network = await provider.getNetwork();
  const balance = await provider.getBalance(wallet.address);

  console.log('');
  console.log('Deployer:', wallet.address);
  console.log('Network:', network.name, '(Chain ID:', network.chainId.toString() + ')');
  console.log('Balance:', ethers.formatEther(balance), 'MATIC');
  console.log('');
  console.log('Deploying GEGTraceability...');

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  console.log('Transaction hash:', contract.deploymentTransaction().hash);
  console.log('Waiting for confirmation...');

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log('');
  console.log('='.repeat(60));
  console.log('CONTRACT DEPLOYED SUCCESSFULLY');
  console.log('Address:', address);
  console.log('Polygonscan: https://polygonscan.com/address/' + address);
  console.log('='.repeat(60));
  console.log('');
  console.log('Add to Vercel env vars:');
  console.log('CONTRACT_ADDRESS=' + address);
}

deploy().catch((err) => {
  console.error('Deployment failed:', err.message);
  process.exit(1);
});

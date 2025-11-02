# Monad Mainnet Indexer API Documentation

Base URL: `http://localhost:3000`

## Table of Contents
- [General Endpoints](#general-endpoints)
- [Block Endpoints](#block-endpoints)
- [Transaction Endpoints](#transaction-endpoints)
- [Address Endpoints](#address-endpoints)
- [Token Endpoints](#token-endpoints)
- [Stats Endpoints](#stats-endpoints)
- [Indexing Endpoints](#indexing-endpoints)

---

## General Endpoints

### GET /
Get API information and available endpoints.

**Response:**
```json
{
  "name": "Monad Mainnet Indexer API",
  "version": "1.0.0",
  "endpoints": {
    "blocks": "/api/blocks",
    "transactions": "/api/transactions",
    "addresses": "/api/addresses",
    "tokens": "/api/tokens",
    "stats": "/api/stats",
    "indexing": "/api/indexing"
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T12:00:00.000Z"
}
```

---

## Block Endpoints

### GET /api/blocks/latest
Get the most recent blocks.

**Query Parameters:**
- `limit` (optional): Number of blocks to return (default: 10, max: 100)

**Example Request:**
```
GET /api/blocks/latest?limit=5
```

**Example Response:**
```json
{
  "data": [
    {
      "number": "32992500",
      "hash": "0x1234567890abcdef...",
      "parentHash": "0xabcdef1234567890...",
      "timestamp": "1730556000",
      "miner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
      "gasLimit": "30000000",
      "gasUsed": "12500000",
      "baseFeePerGas": "1000000000",
      "difficulty": "0",
      "totalDifficulty": "0",
      "transactionCount": 150,
      "nonce": "0x0000000000000000",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "logsBloom": "0x00000000...",
      "transactionsRoot": "0xabcd...",
      "stateRoot": "0xefgh...",
      "receiptsRoot": "0xijkl...",
      "extraData": "0x",
      "size": 50000
    }
  ],
  "count": 5
}
```

### GET /api/blocks
Get paginated list of blocks.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Blocks per page (default: 20, max: 100)

**Example Request:**
```
GET /api/blocks?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "number": "32992500",
      "hash": "0x1234567890abcdef...",
      "parentHash": "0xabcdef1234567890...",
      "timestamp": "1730556000",
      "miner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
      "gasLimit": "30000000",
      "gasUsed": "12500000",
      "baseFeePerGas": "1000000000",
      "difficulty": "0",
      "totalDifficulty": "0",
      "transactionCount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100000,
    "totalPages": 5000
  }
}
```

### GET /api/blocks/:blockNumber
Get a specific block by number. If the block is not indexed, triggers on-demand indexing.

**Example Request:**
```
GET /api/blocks/32992500
```

**Example Response (Block exists):**
```json
{
  "number": "32992500",
  "hash": "0x1234567890abcdef...",
  "parentHash": "0xabcdef1234567890...",
  "timestamp": "1730556000",
  "miner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
  "gasLimit": "30000000",
  "gasUsed": "12500000",
  "baseFeePerGas": "1000000000",
  "difficulty": "0",
  "totalDifficulty": "0",
  "transactionCount": 150,
  "transactions": [
    {
      "hash": "0xabc123...",
      "from": "0x1234...",
      "to": "0x5678...",
      "value": "1000000000000000000",
      "gas": "21000",
      "gasPrice": "1000000000",
      "gasUsed": "21000",
      "blockNumber": "32992500",
      "transactionIndex": 0,
      "timestamp": "1730556000"
    }
  ]
}
```

**Example Response (Block not indexed):**
```json
{
  "message": "Block not indexed yet. Indexing has been triggered.",
  "blockNumber": "32992500",
  "status": "indexing"
}
```

### GET /api/blocks/hash/:blockHash
Get a specific block by hash.

**Example Request:**
```
GET /api/blocks/hash/0x1234567890abcdef...
```

**Example Response:**
Same as GET /api/blocks/:blockNumber

---

## Transaction Endpoints

### GET /api/transactions/latest
Get the most recent transactions.

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 10, max: 100)

**Example Request:**
```
GET /api/transactions/latest?limit=10
```

**Example Response:**
```json
{
  "data": [
    {
      "hash": "0xabc123def456...",
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "gas": "21000",
      "gasPrice": "1000000000",
      "maxFeePerGas": "2000000000",
      "maxPriorityFeePerGas": "1000000000",
      "gasUsed": "21000",
      "cumulativeGasUsed": "500000",
      "effectiveGasPrice": "1000000000",
      "blockNumber": "32992500",
      "blockHash": "0x1234567890abcdef...",
      "timestamp": "1730556000",
      "transactionIndex": 5,
      "nonce": 42,
      "input": "0x",
      "status": true,
      "type": 2,
      "chainId": 143,
      "v": "0",
      "r": "0x123...",
      "s": "0x456..."
    }
  ],
  "count": 10
}
```

### GET /api/transactions
Get paginated list of transactions.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transactions per page (default: 20, max: 100)

**Example Request:**
```
GET /api/transactions?page=1&limit=50
```

**Example Response:**
```json
{
  "data": [
    {
      "hash": "0xabc123def456...",
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000000,
    "totalPages": 20000
  }
}
```

### GET /api/transactions/:txHash
Get a specific transaction by hash with logs and internal transactions.

**Example Request:**
```
GET /api/transactions/0xabc123def456...
```

**Example Response:**
```json
{
  "hash": "0xabc123def456...",
  "from": "0x1234567890abcdef...",
  "to": "0xfedcba0987654321...",
  "value": "1000000000000000000",
  "gas": "100000",
  "gasPrice": "1000000000",
  "gasUsed": "85000",
  "blockNumber": "32992500",
  "timestamp": "1730556000",
  "status": true,
  "logs": [
    {
      "address": "0xtoken123...",
      "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
      "data": "0x000000000000000000000000000000000000000000000000000000000000000a",
      "logIndex": 0,
      "blockNumber": "32992500",
      "transactionHash": "0xabc123def456..."
    }
  ],
  "internalTransactions": [
    {
      "from": "0xcontract1...",
      "to": "0xcontract2...",
      "value": "500000000000000000",
      "gas": "50000",
      "gasUsed": "35000",
      "type": "CALL"
    }
  ]
}
```

---

## Address Endpoints

### GET /api/addresses/:address
Get address information and balance.

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef...
```

**Example Response:**
```json
{
  "address": "0x1234567890abcdef...",
  "balance": "5000000000000000000",
  "transactionCount": 150,
  "firstSeenBlock": "32990000",
  "lastSeenBlock": "32992500",
  "isContract": false,
  "contractCreator": null,
  "contractCreationTxHash": null
}
```

### GET /api/addresses/:address/transactions
Get transactions for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transactions per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../transactions?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "hash": "0xabc123...",
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /api/addresses/:address/internal-transactions
Get internal transactions for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Internal transactions per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../internal-transactions?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "from": "0xcontract1...",
      "to": "0x1234567890abcdef...",
      "value": "100000000000000000",
      "gas": "21000",
      "gasUsed": "21000",
      "type": "CALL",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### GET /api/addresses/:address/token-transfers
Get ERC-20 token transfers for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Token transfers per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../token-transfers?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "tokenAddress": "0xtoken123...",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000",
      "logIndex": 0,
      "token": {
        "address": "0xtoken123...",
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 75,
    "totalPages": 4
  }
}
```

### GET /api/addresses/:address/token-balances
Get all ERC-20 token balances for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Token balances per page (default: 50, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../token-balances?page=1&limit=50
```

**Example Response:**
```json
{
  "data": [
    {
      "tokenAddress": "0xtoken123...",
      "holderAddress": "0x1234567890abcdef...",
      "balance": "5000000000000000000",
      "token": {
        "address": "0xtoken123...",
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18,
        "totalSupply": "1000000000000000000000000"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 15,
    "totalPages": 1
  }
}
```

---

## Token Endpoints

### GET /api/tokens
Get paginated list of all ERC-20 tokens.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Tokens per page (default: 20, max: 100)

**Example Request:**
```
GET /api/tokens?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0xtoken123...",
      "name": "Example Token",
      "symbol": "EXT",
      "decimals": 18,
      "totalSupply": "1000000000000000000000000",
      "createdAt": "2025-11-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

### GET /api/tokens/:tokenAddress
Get detailed information about a specific token.

**Example Request:**
```
GET /api/tokens/0xtoken123...
```

**Example Response:**
```json
{
  "address": "0xtoken123...",
  "name": "Example Token",
  "symbol": "EXT",
  "decimals": 18,
  "totalSupply": "1000000000000000000000000",
  "transferCount": 5000,
  "holderCount": 1250,
  "createdAt": "2025-11-02T12:00:00.000Z"
}
```

### GET /api/tokens/:tokenAddress/transfers
Get all transfers for a specific token.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transfers per page (default: 20, max: 100)

**Example Request:**
```
GET /api/tokens/0xtoken123.../transfers?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "tokenAddress": "0xtoken123...",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000",
      "logIndex": 0,
      "token": {
        "address": "0xtoken123...",
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "totalPages": 250
  }
}
```

### GET /api/tokens/:tokenAddress/holders
Get all holders for a specific token, ordered by balance.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Holders per page (default: 20, max: 100)

**Example Request:**
```
GET /api/tokens/0xtoken123.../holders?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "tokenAddress": "0xtoken123...",
      "holderAddress": "0x1234567890abcdef...",
      "balance": "50000000000000000000000"
    },
    {
      "tokenAddress": "0xtoken123...",
      "holderAddress": "0xfedcba0987654321...",
      "balance": "25000000000000000000000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```

---

## Stats Endpoints

### GET /api/stats
Get overall indexer statistics.

**Example Request:**
```
GET /api/stats
```

**Example Response:**
```json
{
  "blockCount": 100000,
  "transactionCount": 5000000,
  "addressCount": 250000,
  "tokenCount": 500,
  "latestBlock": {
    "number": "32992500",
    "timestamp": "1730556000"
  },
  "indexerState": {
    "lastIndexedBlock": "32992500",
    "isIndexing": true,
    "updatedAt": "2025-11-02T12:00:00.000Z"
  }
}
```

---

## Indexing Endpoints

### GET /api/indexing/request/:blockNumber
Get the status of a specific block indexing request.

**Example Request:**
```
GET /api/indexing/request/32992500
```

**Example Response (Completed):**
```json
{
  "blockNumber": "32992500",
  "status": "completed",
  "priority": 1,
  "createdAt": "2025-11-02T12:00:00.000Z",
  "updatedAt": "2025-11-02T12:01:00.000Z",
  "error": null
}
```

**Example Response (Failed):**
```json
{
  "blockNumber": "32992500",
  "status": "failed",
  "priority": 1,
  "createdAt": "2025-11-02T12:00:00.000Z",
  "updatedAt": "2025-11-02T12:01:00.000Z",
  "error": "Block not found"
}
```

### GET /api/indexing/pending
Get all pending block indexing requests.

**Example Request:**
```
GET /api/indexing/pending
```

**Example Response:**
```json
{
  "count": 5,
  "requests": [
    {
      "blockNumber": "32992501",
      "priority": 1,
      "createdAt": "2025-11-02T12:00:00.000Z"
    },
    {
      "blockNumber": "32992502",
      "priority": 0,
      "createdAt": "2025-11-02T12:01:00.000Z"
    }
  ]
}
```

### POST /api/indexing/request/:blockNumber
Manually trigger indexing for a specific block.

**Example Request:**
```
POST /api/indexing/request/32992500
```

**Example Response (New Request):**
```json
{
  "message": "Indexing request created",
  "blockNumber": "32992500",
  "status": "pending"
}
```

**Example Response (Already Indexed):**
```json
{
  "message": "Block already indexed",
  "blockNumber": "32992500",
  "status": "completed"
}
```

---

## Data Types

### BigInt Fields
All large numbers are returned as strings to prevent precision loss in JSON:
- `blockNumber`
- `timestamp`
- `gas`
- `gasUsed`
- `gasPrice`
- `value`
- `balance`
- etc.

### Address Format
All addresses are lowercase hex strings:
- Example: `0x1234567890abcdef1234567890abcdef12345678`

### Hash Format
All hashes are hex strings with 0x prefix:
- Example: `0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890`

### Pagination
All paginated endpoints return:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

### 202 Accepted (Block Indexing Triggered)
```json
{
  "message": "Block not indexed yet. Indexing has been triggered.",
  "blockNumber": "32992500",
  "status": "indexing"
}
```

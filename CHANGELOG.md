# Changelog

All notable changes to the Monad Mainnet Indexer.

## [2.2.0] - 2025-11-03

### 🚀 New Features

#### Transaction Enrichment & Method Display
**Feature**: Rich transaction responses with method names, address labels, and formatted data

**What's Added**:
- **Method Name Display**: Shows "MON Transfer", "transfer", "forward", etc.
- **Decoded Function Calls**: Human-readable function parameters
- **Address Labels**: Contract names, token symbols, verified badges
- **Transaction Fee**: Auto-calculated from gasUsed × effectiveGasPrice
- **Formatted Token Transfers**: ERC20, ERC721, ERC1155 clearly displayed
- **Internal Transaction Formatting**: Clean display of internal calls

**New Service**:
- `TransactionEnricher` - Enriches transactions with metadata

**API Enhancement**:
- `GET /api/transactions/:txHash?enriched=true` - Returns enriched transaction data

**Response Format** (similar to other indexers):
```json
{
  "methodID": "0x6fadcf72",
  "methodName": "forward",
  "inputInformation": {
    "original": "0x6fadcf72...",
    "defaultView": "forward(address,bytes)",
    "decodeInputData": {
      "target": "0x1234...",
      "data": "0x"
    }
  },
  "addressLabels": {
    "0xfe3d943a7de4f0acb2faaba3af8ac6469e6751f3": {
      "address": "0xfe3d943a7de4f0acb2faaba3af8ac6469e6751f3",
      "name": "Chainlink Price Feed Aggregator",
      "label": "Chainlink Oracle",
      "isToken": false,
      "isNFT": false,
      "isContract": true
    }
  },
  "erc20TokensTransferred": [...],
  "erc721TokensTransferred": [...],
  "internalTransactions": [...]
}
```

**Transaction Type Detection**:
- Native MON transfers → **"MON Transfer"**
- ERC20 transfers → **"transfer"** (with token name)
- Contract calls → **Function name** from ABI or signature registry
- Unknown methods → **"Unknown"** (with method ID)

**Benefits**:
- ✅ See what transactions do at a glance
- ✅ Decoded function parameters
- ✅ Address labels with contract/token identification
- ✅ All token transfers in one view
- ✅ Professional block explorer UX

**Files**:
- `src/services/transactionEnricher.ts` - Enrichment service
- `src/api/routes/transactions.ts` - Added enriched parameter

See `FEATURE_TRANSACTION_ENRICHMENT.md` for complete documentation.

---

#### Contract ABI Storage & Function Decoding
**Feature**: Store and decode contract ABIs like Etherscan/block explorers

**What's Added**:
- **ABI Storage**: Store full contract ABIs in database
- **Function Decoding**: Decode transaction input data to human-readable function calls
- **Event Decoding**: Decode event logs using stored ABIs
- **Function Signature Registry**: 4byte.directory-style method ID → signature mapping
- **7 New API Endpoints**: Complete ABI management and decoding functionality

**Database Tables**:
- `contract_abis` - Full ABI storage with metadata
- `function_signatures` - Method ID → function signature mapping

**API Endpoints**:
- `GET /api/abis/:address` - Get ABI for a contract
- `POST /api/abis` - Store/update contract ABI
- `DELETE /api/abis/:address` - Delete stored ABI
- `GET /api/abis` - List all contracts with ABIs
- `POST /api/abis/decode` - Decode function call input data
- `GET /api/abis/signatures/:methodId` - Get function signature by method ID
- `GET /api/abis/signatures` - List popular function signatures

**Pre-seeded Data**:
- **Chainlink Price Feed Aggregator** (`0xfe3d943a7de4f0acb2faaba3af8ac6469e6751f3`)
  - AggregatorV3Interface functions (decimals, description, getRoundData, latestRoundData, version)
  - Forwarder functions (forward)
  - Legacy aggregator functions (latestAnswer, latestRound, getAnswer, getTimestamp)
  - 12 function signatures indexed

**Benefits**:
- ✅ Decode "what function was called" in transactions
- ✅ Human-readable function parameters
- ✅ Event log decoding with parameter names
- ✅ Build your own function signature database
- ✅ Support for contract verification workflows

**Example Decoding**:
```bash
POST /api/abis/decode
{
  "contractAddress": "0xfe3d943a7de4f0acb2faaba3af8ac6469e6751f3",
  "inputData": "0x6fadcf72..."
}

Response:
{
  "methodId": "0x6fadcf72",
  "signature": "forward(address,bytes)",
  "name": "forward",
  "args": ["0x1234...", "0x"],
  "decodedParams": {
    "target": "0x1234...",
    "data": "0x"
  }
}
```

**Files**:
- `prisma/schema.prisma` - Added ContractABI and FunctionSignature models
- `src/services/abiDecoder.ts` - ABI decoding service with ethers.js
- `src/api/routes/abis.ts` - 7 ABI management endpoints
- `src/api/app.ts` - Registered /api/abis routes
- `prisma/seed-chainlink-abi.ts` - Seed script for Chainlink contract
- Migration: `20251103214759_add_contract_abi_storage`

**Future Enhancements**:
- Automatic ABI fetching from block explorers
- Contract source code verification
- More pre-seeded popular contracts
- Integration with transaction processing to auto-decode

See `API_DOCS.md` for complete endpoint documentation.

### 🐛 Bug Fixes (Post-Implementation)

#### Route Ordering Bug (CRITICAL)
**Severity**: CRITICAL - Signature endpoints were completely unreachable

**Problem**:
- Parameterized route `/:address` was defined before specific routes `/signatures`
- Express matched `/api/abis/signatures` to `/:address` with address="signatures"
- Signature endpoints never executed

**Fix**:
- Reordered routes: specific paths BEFORE parameterized paths
- Added warning comment about route order importance

**File**: `src/api/routes/abis.ts`

#### DELETE Endpoint Error Handling
**Severity**: MODERATE - Poor error messages

**Problem**:
- DELETE on non-existent ABI threw 500 error instead of 404
- Prisma "record not found" error exposed to users

**Fix**:
- Added existence check before deletion
- Returns proper 404 with clear error message

**File**: `src/api/routes/abis.ts:160-182`

#### Malformed ABI Input Validation
**Severity**: MODERATE - Crash risk

**Problem**:
- `extractFunctionSignatures` assumed all functions had `name` and `inputs`
- Would crash on malformed ABI data

**Fix**:
- Added validation for required fields
- Gracefully skips malformed functions with warnings
- Continues processing valid functions

**File**: `src/services/abiDecoder.ts:149-193`

#### Nested BigInt Serialization
**Severity**: HIGH - JSON serialization crash

**Problem**:
- Only converted top-level BigInts to strings
- Would crash on arrays/objects containing BigInts
- Error: "Do not know how to serialize a BigInt"

**Fix**:
- Created recursive `serializeValue()` helper
- Handles nested arrays, objects, and complex structures
- Updated both `decodeFunction()` and `decodeEvent()`

**Impact**:
- ✅ Works with complex return types (tuples, structs, arrays)
- ✅ Compatible with Uniswap, lending protocols, etc.

**File**: `src/services/abiDecoder.ts:115-144, 57-71, 247-259`

See `BUGFIX_ABI_ROUTES.md` for detailed analysis.

---

## [2.1.0] - 2025-11-03

### 🚀 New Features

#### Transaction Method ID (Function Selector) Capture
**Feature**: Capture and display function selectors like Etherscan

**What's Added**:
- **Method ID extraction**: First 4 bytes of transaction input (e.g., `0xa9059cbb`)
- **Database fields**: `methodId` and `functionSignature` on Transaction model
- **Indexed**: Can filter transactions by method ID
- **API response**: All transaction endpoints now include method ID

**Common Method IDs**:
- `0xa9059cbb` - ERC20 transfer
- `0x095ea7b3` - ERC20 approve
- `0x23b872dd` - ERC20/ERC721 transferFrom
- `0x38ed1739` - Uniswap swap exact tokens
- `0x7ff36ab5` - Uniswap swap exact ETH for tokens

**Benefits**:
- ✅ Users can see what function was called (like Etherscan)
- ✅ Analytics on popular contract interactions
- ✅ Filter transactions by function type
- ✅ Better debugging and monitoring

**Future Enhancement**:
- 4byte.directory integration to resolve method IDs to human-readable names
- Parameter decoding with contract ABIs

**Files**:
- `prisma/schema.prisma` - Added `methodId` and `functionSignature` fields
- `src/services/processor.ts:114-137` - Method ID extraction logic
- Migration: `20251103202747_add_method_id_to_transactions`

See `FEATURE_METHOD_ID.md` for complete documentation.

---

### 🐛 Critical Bug Fixes

#### Logger.warn Error Field Bug (OBSERVABILITY BUG)
**Severity**: MODERATE - Warning logs showed empty error objects

**Problem**:
- Fixed `logger.error()` to use `{ err: error }`, but forgot `logger.warn()`
- 7 occurrences of `logger.warn({ error })` still showing empty objects

**Fix**:
- Automated replacement: `{ error }` → `{ err: error }`
- All warning logs now show full error details

**Files**: 7 files across `src/services/` and `src/api/`

#### Method ID Extraction for Contract Creations (MINOR BUG)
**Severity**: LOW - Incorrect data for contract deployments

**Problem**:
- Method ID extracted from contract creation transactions
- Contract bytecode header (e.g., `0x60806040`) extracted as method ID
- Method ID should only be for contract function calls

**Fix**:
- Added check: Only extract methodId if `tx.to` exists (contract call)
- Contract creations now correctly have `methodId: null`

**File**: `src/services/processor.ts:118`

#### Error Logging Bug (OBSERVABILITY BUG)
**Severity**: HIGH - Debugging impossible due to empty error logs

**Problem**:
- All error logs showed empty objects: `error: {}`
- Used `{ error }` instead of `{ err: error }` in Pino logger
- JavaScript Error objects have non-enumerable properties
- Pino requires errors in the `err` field for proper serialization

**Impact**:
- ❌ Unable to debug production errors
- ❌ All error details missing from logs
- ❌ Monitoring systems couldn't track error types
- ❌ Wasted developer time trying to diagnose issues

**Fix**:
- Automated replacement across entire codebase
- Changed `logger.error({ error }` to `logger.error({ err: error }`
- Changed `logger.error({ error, ...}` to `logger.error({ err: error, ...}`
- 60+ occurrences fixed across 30+ files

**Impact**:
- ✅ Full error details now visible (message, stack trace, error codes)
- ✅ Easy debugging from logs
- ✅ Proper observability for monitoring
- ✅ Faster issue resolution

**Files**: Automated sed replacement across all `src/**/*.ts` files

See `BUGFIX_ERROR_LOGGING.md` for complete analysis.

#### RPC Calls Inside Database Transaction (CRITICAL PERFORMANCE BUG)
**Severity**: CRITICAL - Transaction timeouts causing indexer failure

**Problem**:
- Made 150+ slow RPC calls to blockchain node WHILE holding database transaction open
- Each block took 15+ seconds to process (transaction held open entire time)
- Parallel processing caused complete deadlock
- Constant P2028 "Unable to start a transaction in the given time" errors

**Root Cause**:
- `updateAddressBalances()` fetched balance data (3 RPC calls per address) inside the `prisma.$transaction()` block
- Block with 50 addresses = 150 RPC calls × 100ms each = 15 seconds with transaction locked
- Other blocks waiting for connections → timeout

**Fix**:
- Created new `fetchAddressBalances()` function to fetch ALL balance data BEFORE opening transaction
- Fetch happens in parallel (all addresses simultaneously)
- Each address fetches 3 RPC calls in parallel (balance, code, nonce)
- Transaction only does fast database writes (no RPC calls)

**Performance Improvement**:
- **Before**: 15+ seconds per block (transaction duration)
- **After**: <0.5 seconds per block (transaction duration)
- **Speedup**: 30x faster!
- **RPC fetch time**: 50x faster (parallel vs sequential)

**Impact**:
- ✅ No more P2028 transaction timeouts
- ✅ Parallel block processing works perfectly
- ✅ 30x faster transaction performance
- ✅ Stable continuous indexing

**Files**:
- `src/services/processor.ts:466-506` - NEW: `fetchAddressBalances()`
- `src/services/processor.ts:508-513` - Modified: `saveToDatabase()`
- `src/services/processor.ts:911-971` - Modified: `updateAddressBalances()`

See `BUGFIX_TRANSACTION_PERFORMANCE.md` for complete analysis.

#### Address Balance History Race Condition (PRODUCTION CRASH FIX)
**Severity**: CRITICAL - Indexer was crashing in production

**Problem**:
- Parallel block processing caused duplicate balance history inserts
- Database unique constraint violations: `P2002`
- Transaction timeouts: `P2028`
- Indexer unable to continue processing blocks

**Root Cause**:
- Used `create()` for balance history records with unique constraint on `(address, blockNumber)`
- When blocks processed in parallel, multiple transactions tried to INSERT same record
- Zero address (`0x0000000000000000000000000000000000000000`) most affected (appears in many blocks)

**Fix**:
- Changed from `create()` to `upsert()` in `updateAddressBalances()`
- Now idempotent and race-condition safe
- Handles retries and parallel processing gracefully

**Impact**:
- ✅ No more crashes from duplicate balance history
- ✅ Continuous block processing without interruption
- ✅ Safe for high-volume parallel indexing

**File**: `src/services/processor.ts:903-927`

See `BUGFIX_BALANCE_HISTORY_RACE.md` for complete analysis.

#### Falsy Value Handling (11 bugs fixed)
Fixed critical bugs where JavaScript's truthy/falsy evaluation incorrectly converted valid zero values to null:

**CRITICAL Fixes:**
- **Gas Price Fields**: Zero gas price transactions (while rare) are valid but were being stored as null
- **Effective Gas Price**: Actual price paid was lost for zero-price transactions

**HIGH Priority:**
- **Chain ID**: Chain ID 0 was indistinguishable from pre-EIP-155 transactions

**MODERATE Priority:**
- **Signature Components**: Signatures with v=0 were corrupted (breaks verification)
- **Base Fee Per Gas**: Zero base fee blocks were stored incorrectly
- **Block Nonce**: Nonce=0 (valid in PoW) was stored as null

**LOW Priority:**
- **Transaction Status**: Semantically confusing (worked but unclear)
- **Logs Bloom, Extra Data, State Root**: Edge cases with empty strings
- **Block Size**: Empty blocks (size=0) handled correctly but confusingly

**Impact**: Without these fixes, rare but valid transactions with zero values would suffer **data loss**.

**Fix Applied**: Changed all checks from `value ? ... : null` to `value != null ? ... : null` to correctly distinguish between:
- `null`/`undefined` (no value) → store as `null`
- `0` / `0n` / `""` (zero/empty value) → preserve as-is

See `BUGFIXES_TRANSACTION_TYPES.md` for detailed analysis.

### 🔧 Enhanced Transaction Support

#### Full EIP Support for Monad-Compatible Transaction Types
- Added support for **Type 1 (EIP-2930)** Access List transactions
- Added support for **Type 4 (EIP-7702)** Set Code transactions
- Continued support for Type 0 (Legacy) and Type 2 (EIP-1559)
- Added validation to detect and log unsupported Type 3 (EIP-4844) transactions

**New Transaction Fields:**
- `accessList` (JSON) - Captures access lists for Type 1, 2, and 4 transactions
- `authorizationList` (JSON) - Captures authorization lists for Type 4 transactions

**Database Changes:**
- Added `accessList` column to `transactions` table (JSONB)
- Added `authorizationList` column to `transactions` table (JSONB)
- Migration: `20251103194615_add_transaction_access_and_auth_lists`

#### Transaction Type Coverage

| Type | Name | Status | Fields |
|------|------|--------|--------|
| 0 | Legacy | ✅ Supported | gasPrice, chainId (optional) |
| 1 | EIP-2930 | ✅ Supported | gasPrice, accessList |
| 2 | EIP-1559 | ✅ Supported | maxFeePerGas, maxPriorityFeePerGas, accessList (optional) |
| 3 | EIP-4844 | ❌ Not Supported | Logged as warning if encountered |
| 4 | EIP-7702 | ✅ Supported | maxFeePerGas, maxPriorityFeePerGas, authorizationList |

#### Pre-EIP-155 Support
- Transactions without `chainId` are properly handled
- Stored as `chainId: null` in database
- Compatible with keyless deployment methods

### 📚 Documentation Updates
- Added comprehensive **Transaction Types & EIP Support** section to API docs
- Documented all transaction type field structures with examples
- Explained access lists and authorization lists
- Added pre-EIP-155 transaction warnings
- Created `TRANSACTION_TYPES.md` with detailed implementation notes

### 🔍 What This Enables

**Access Lists (EIP-2930, Type 1)**:
- Track which contracts use access lists for gas optimization
- Analyze storage access patterns
- Monitor gas savings from pre-declared access

**Authorization Lists (EIP-7702, Type 4)**:
- Track EOA accounts using smart wallet features
- Monitor code delegation patterns
- Analyze smart wallet adoption on Monad

**Complete Transaction Analysis**:
- Full compatibility with all Monad transaction types
- No data loss from unsupported fields
- Ready for future EIP-7702 adoption tracking

---

## [2.0.0] - 2025-11-03

### 🚀 Major Features Added

#### NFT Support (ERC721 & ERC1155)
- Added comprehensive NFT tracking for both ERC721 and ERC1155 standards
- NFT collection metadata (name, symbol, total supply)
- NFT ownership tracking with real-time updates
- NFT transfer history with full event details
- Automatic token standard detection via ERC165

**New Tables:**
- `nft_collections` - NFT contract information
- `nft_tokens` - Individual NFT ownership records
- `nft_transfers` - All NFT transfer events

#### Advanced Event Decoding
- Automatic decoding of common event types:
  - ERC20: Transfer, Approval
  - ERC721: Transfer (with tokenId)
  - ERC1155: TransferSingle, TransferBatch
  - Uniswap V2: Swap
- Human-readable event parameters
- Searchable by event type and contract

**New Table:**
- `decoded_events` - Decoded event data with JSON parameters

#### Address Balance History
- Historical balance tracking at each block
- Tracks nonce, contract status, and code hash
- Enables time-series queries for balance changes
- Perfect for analytics and charts

**New Table:**
- `address_balance_history` - Historical balance snapshots

#### Contract Metadata & Labeling System
- Human-readable names for contracts (e.g., "Uniswap V2 Router")
- Categories and tags (DeFi::DEX, Infra::Oracle, etc.)
- Project associations (Uniswap, Chainlink, PancakeSwap)
- Social links (website, Twitter, GitHub, docs)
- Token metadata (symbol, decimals, type)
- Canonical contract registry

**New Tables:**
- `address_metadata` - Contract/address labels and metadata
- `protocols` - Protocol/project registry with addresses

**Seeded Data:**
- 18 Canonical Monad contracts (Multicall3, Safe, ERC-4337, etc.)
- Uniswap V2/V3 contracts (Factory, Router, Position Manager)
- PancakeSwap contracts (Factory, Router, Smart Router)
- Chainlink price feeds (BTC/USD, ETH/USD, and more available)
- USDC token with Circle metadata
- WMON (Wrapped MON)

#### Re-enabled Internal Transactions
- Contract-to-contract call tracking
- Internal ETH transfers
- Full call stack visibility
- Shows CALL, DELEGATECALL, STATICCALL, CREATE types

### 🔧 Bug Fixes

#### Critical: ERC721 Detection Bug (Fixed)
**Impact:** ERC721 NFTs were never being detected
**Cause:** Logic error checking `topics.length === 3` then `topics.length === 4` inside
**Fix:** Restructured event detection logic to properly handle both ERC20 and ERC721

#### Log Matching Bug (Fixed)
**Impact:** Could cause undefined errors when matching events to logs
**Cause:** Used non-existent `created.logIndex` property
**Fix:** Simplified matching using transaction hash, address, and block number

### 📚 API Additions

#### New Metadata Endpoints
- `GET /api/metadata/address/:address` - Get contract metadata
- `GET /api/metadata/addresses` - List labeled addresses (filterable)
- `GET /api/metadata/canonical` - Canonical Monad contracts
- `GET /api/metadata/tokens` - Labeled tokens
- `GET /api/metadata/projects` - List all projects
- `GET /api/metadata/project/:name` - Get project contracts
- `GET /api/metadata/categories` - List all categories
- `GET /api/metadata/search?q=` - Search metadata
- `GET /api/metadata/protocols` - List protocols
- `GET /api/metadata/protocols/:slug` - Get protocol details

#### Enhanced Transaction Response
- Now includes decoded events in transaction details
- Shows event names, signatures, and decoded parameters
- Links to contract metadata when available

### 📖 Documentation Updates
- Added NFT endpoints documentation
- Added Decoded Events endpoints documentation
- Added Balance History endpoints documentation
- Added Contract Metadata & Labels section
- Updated Stats endpoint with new metrics
- Updated home endpoint with feature list

### 🗃️ Database Schema Changes
- 6 new tables added
- 25+ new indexes for performance
- Support for JSON fields for flexible metadata
- Cascade deletion for data integrity

### ⚙️ Configuration
- No configuration changes required
- All features enabled by default
- Backward compatible with existing data

### 🔄 Migration Path
```bash
# Database migrations applied automatically
npx prisma migrate deploy

# Seed canonical contracts (optional, run once)
npx ts-node prisma/seed-metadata.ts

# Restart application to apply code changes
docker-compose restart
# or
npm run dev
```

### 📊 Performance Impact
- **Internal transactions:** +30-50% indexing time (requires trace calls)
- **Balance history:** +20-30% indexing time (requires balance queries)
- **NFT tracking:** +5-10% database writes
- **Event decoding:** Minimal impact (< 5%)

**Optimization:**
- Parallel block processing already implemented
- Database indexes added for all queries
- Efficient batch operations

### 🎯 What's Coming Next
- More Chainlink price feeds
- Additional event decoders (Lending, Governance, Bridges)
- Contract verification integration
- ABI storage and decoding
- More protocol metadata

---

## [1.0.0] - 2025-11-02

### Initial Release
- Block indexing with full block data
- Transaction indexing with receipts
- Address tracking with balances
- ERC20 token tracking
- Token transfer tracking
- Token balance tracking
- Internal transaction tracing (initially disabled)
- On-demand block indexing
- RESTful API with pagination
- PostgreSQL database with Prisma ORM

### Features
- Real-time blockchain indexing
- Parallel block processing
- Safe confirmations (waits for block finality)
- Error handling and retry logic
- Comprehensive logging
- Docker support

# Moggi Explorer

A modern, fast, and clean blockchain explorer for Monad Mainnet built with Next.js 16, React 19, TypeScript, and shadcn/ui.

## Features

- **Smart Search**: Auto-detects search type (block number, block hash, transaction hash, or address) based on input format
- **Block Explorer**: View detailed block information including transactions, gas usage, and metadata
- **Transaction Details**: Comprehensive transaction views with logs and internal transactions
- **Address Pages**: Track address balances, transactions, token holdings, and token transfers
- **Modern UI**: Clean, responsive design using shadcn/ui components
- **Type-Safe**: Fully typed with TypeScript for better developer experience

## Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system
- Monad Mainnet Indexer API running (see API_DOCS.md)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moggi_mainnet_page
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── address/[address]/    # Address detail page
│   ├── block/[id]/           # Block detail page
│   ├── tx/[hash]/            # Transaction detail page
│   ├── layout.tsx            # Root layout with header
│   ├── page.tsx              # Homepage with search
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── header.tsx            # Navigation header
│   └── search-command.tsx    # Smart search component
├── lib/
│   ├── api.ts                # API client functions
│   ├── format-utils.ts       # Formatting utilities
│   ├── search-utils.ts       # Search type detection
│   └── utils.ts              # General utilities
└── public/                   # Static assets
```

## Search Detection

The explorer automatically detects the search type based on input format:

- **Block Number**: Pure numbers (e.g., `32992500`)
- **Block Hash**: `0x` + 64 hex characters
- **Transaction Hash**: `0x` + 64 hex characters
- **Address**: `0x` + 40 hex characters

## API Integration

This explorer connects to the Monad Mainnet Indexer API. See [API_DOCS.md](./API_DOCS.md) for complete API documentation.

### Available Endpoints

- `/api/blocks/:blockNumber` - Get block details
- `/api/transactions/:txHash` - Get transaction details
- `/api/addresses/:address` - Get address information
- `/api/addresses/:address/transactions` - Get address transactions
- `/api/addresses/:address/token-balances` - Get token balances
- `/api/addresses/:address/token-transfers` - Get token transfers

## Building for Production

```bash
bun run build
bun start
```

## Development

```bash
# Run development server
bun run dev

# Run linter
bun run lint

# Build for production
bun run build
```

## License

MIT

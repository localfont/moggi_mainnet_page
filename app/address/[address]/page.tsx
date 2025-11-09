import {
  getAddress,
  getAddressTransactions,
  getAddressTokenBalances,
  getAddressTokenTransfers,
  getAddressMetadata,
  getAddressNFTs,
  getAddressNFTTransfers,
  getAddressInternalTransactions
} from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Box,
  Globe,
  Github,
  Twitter,
  BookOpen,
  Shield,
  ImageIcon,
  Repeat
} from 'lucide-react';
import { formatEther, formatTimestamp, formatTimeAgo, truncateHash, formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddressDisplay } from '@/components/address-display';
import { BytecodeDisplay } from '@/components/bytecode-display';

export const dynamic = 'force-dynamic';

interface AddressPageProps {
  params: Promise<{ address: string }>;
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;

  let addressData;
  let metadata;
  let transactions;
  let tokenBalances;
  let tokenTransfers;
  let nfts;
  let nftTransfers;
  let internalTxs;
  let error;

  try {
    [
      addressData,
      metadata,
      transactions,
      tokenBalances,
      tokenTransfers,
      nfts,
      nftTransfers,
      internalTxs
    ] = await Promise.all([
      getAddress(address),
      getAddressMetadata(address).catch(() => null),
      getAddressTransactions(address, 1, 20),
      getAddressTokenBalances(address, 1, 50),
      getAddressTokenTransfers(address, 1, 20),
      getAddressNFTs(address, 1, 20).catch(() => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })),
      getAddressNFTTransfers(address, 1, 20).catch(() => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })),
      getAddressInternalTransactions(address, 1, 20).catch(() => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load address';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Address</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!addressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>Address Not Found</CardTitle>
              <CardDescription>Address {address} could not be found.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explorer
            </Button>
          </Link>
        </div>

        {/* Dashboard Header with Metadata */}
        <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              {/* Title Section */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Wallet className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {metadata ? (
                        <>
                          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {metadata.name}
                          </h1>
                          {metadata.isVerified && (
                            <Badge className="flex items-center gap-1 bg-blue-600 text-white border-0">
                              <Shield className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                          {metadata.isCanonical && (
                            <Badge variant="secondary">
                              Canonical
                            </Badge>
                          )}
                        </>
                      ) : (
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                          {addressData.isContract ? 'Smart Contract' : 'Address'}
                        </h1>
                      )}
                    </div>
                  </div>

                  {/* Symbol, Category, and Project */}
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    {metadata?.symbol && (
                      <Badge variant="outline" className="font-mono">
                        {metadata.symbol}
                      </Badge>
                    )}
                    {metadata?.category && (
                      <span className="text-zinc-600 dark:text-zinc-400">{metadata.category}</span>
                    )}
                    {metadata?.projectName && (
                      <>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{metadata.projectName}</span>
                      </>
                    )}
                    {addressData.isContract && !metadata && (
                      <Badge variant="secondary">Smart Contract</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <AddressDisplay address={addressData.address} />

              {/* Description */}
              {metadata?.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {metadata.description}
                </p>
              )}

              {/* Social Links */}
              {metadata && (metadata.website || metadata.twitter || metadata.github || metadata.docs) && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 flex-wrap">
                    {metadata.website && (
                      <a
                        href={metadata.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {metadata.twitter && (
                      <a
                        href={metadata.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {metadata.github && (
                      <a
                        href={metadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {metadata.docs && (
                      <a
                        href={metadata.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Docs</span>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEther(addressData.balance)} MON</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(addressData.transactionCount)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>First Seen</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/block/${addressData.firstSeenBlock}`} className="text-lg font-semibold text-blue-600 hover:underline">
                Block #{formatNumber(addressData.firstSeenBlock)}
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Last Seen</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/block/${addressData.lastSeenBlock}`} className="text-lg font-semibold text-blue-600 hover:underline">
                Block #{formatNumber(addressData.lastSeenBlock)}
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contract Information */}
        {addressData.isContract && (
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addressData.contractCreator && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Creator</span>
                    <Link href={`/address/${addressData.contractCreator}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                      {addressData.contractCreator}
                    </Link>
                  </div>
                )}

                {addressData.contractCreationTx && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Deployment Transaction</span>
                    <Link href={`/tx/${addressData.contractCreationTx}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                      {truncateHash(addressData.contractCreationTx, 12, 10)}
                    </Link>
                  </div>
                )}
              </div>

              {addressData.contractCode && (
                <BytecodeDisplay bytecode={addressData.contractCode} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="transactions">
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">Txs</span>
              <span className="ml-1">({transactions?.pagination?.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="internal">
              <span className="hidden sm:inline">Internal</span>
              <span className="sm:hidden">Int</span>
              <span className="ml-1">({internalTxs?.pagination?.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="tokens">
              <span className="hidden sm:inline">Tokens</span>
              <span className="sm:hidden">ERC20</span>
              <span className="ml-1">({tokenBalances?.data?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="transfers">
              <span className="hidden sm:inline">Transfers</span>
              <span className="sm:hidden">Trans</span>
              <span className="ml-1">({tokenTransfers?.pagination?.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="nfts">
              <span className="hidden sm:inline">NFTs</span>
              <span className="sm:hidden">NFT</span>
              <span className="ml-1">({nfts?.pagination?.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="nft-transfers">
              <span className="hidden sm:inline">NFT Transfers</span>
              <span className="sm:hidden">NFT Tx</span>
              <span className="ml-1">({nftTransfers?.pagination?.total || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Transactions
                </CardTitle>
                <CardDescription>All transactions involving this address</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions && transactions.data.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.data.map((tx) => (
                      <div key={tx.hash} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Link href={`/tx/${tx.hash}`} className="text-sm font-mono text-blue-600 hover:underline truncate">
                              {truncateHash(tx.hash, 10, 8)}
                            </Link>
                            {tx.status !== undefined && (
                              <Badge variant={tx.status ? 'default' : 'destructive'} className="text-xs">
                                {tx.status ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Link href={`/block/${tx.blockNumber}`} className="hover:underline flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              {formatNumber(tx.blockNumber)}
                            </Link>
                            <span>•</span>
                            <span>{formatTimeAgo(tx.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>From: {truncateHash(tx.from)}</span>
                            <span>→</span>
                            <span>To: {tx.to ? truncateHash(tx.to) : 'Contract Creation'}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium">{formatEther(tx.value)} MON</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No transactions found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Internal Transactions Tab */}
          <TabsContent value="internal" className="mt-6">
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                    <Repeat className="h-5 w-5 text-white" />
                  </div>
                  Internal Transactions
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Internal contract-to-contract transactions</p>
              </div>
              <div className="p-6">
                {internalTxs && internalTxs.data.length > 0 ? (
                  <div className="space-y-3">
                    {internalTxs.data.map((tx, idx) => (
                      <div key={`${tx.transactionHash}-${idx}`} className="flex items-center justify-between p-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            {tx.transactionHash && (
                              <Link href={`/tx/${tx.transactionHash}`} className="text-sm font-mono text-purple-600 dark:text-purple-400 hover:underline truncate font-semibold">
                                {truncateHash(tx.transactionHash, 10, 8)}
                              </Link>
                            )}
                            <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700">{tx.type}</Badge>
                          </div>
                          {tx.blockNumber && tx.timestamp && (
                            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                              <Link href={`/block/${tx.blockNumber}`} className="hover:underline flex items-center gap-1">
                                <Box className="h-3 w-3" />
                                Block {formatNumber(tx.blockNumber)}
                              </Link>
                              <span>•</span>
                              <span>{formatTimeAgo(tx.timestamp)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">From:</span> <span className="font-mono">{truncateHash(tx.from)}</span>
                            <span>→</span>
                            <span className="font-medium">To:</span> <span className="font-mono">{truncateHash(tx.to)}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatEther(tx.value)}</div>
                          <div className="text-xs text-zinc-500">MON</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-12">No internal transactions found</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Token Balances Tab */}
          <TabsContent value="tokens" className="mt-6">
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                    <Coins className="h-5 w-5 text-white" />
                  </div>
                  Token Balances
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">ERC-20 tokens held by this address</p>
              </div>
              <div className="p-6">
                {tokenBalances && tokenBalances.data.length > 0 ? (
                  <div className="space-y-3">
                    {tokenBalances.data.map((balance) => (
                      <div key={balance.tokenAddress} className="flex items-center justify-between p-5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{balance.token.name}</span>
                            <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 font-mono font-semibold">
                              {balance.token.symbol}
                            </Badge>
                          </div>
                          <Link href={`/address/${balance.tokenAddress}`} className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline block">
                            {balance.tokenAddress}
                          </Link>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {(Number(balance.balance) / Math.pow(10, balance.token.decimals)).toLocaleString('en-US', {
                              maximumFractionDigits: 4,
                            })}
                          </div>
                          <div className="text-xs text-zinc-500 font-medium">{balance.token.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-12">No token balances found</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Token Transfers Tab */}
          <TabsContent value="transfers" className="mt-6">
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <ArrowRightLeft className="h-5 w-5 text-white" />
                  </div>
                  Token Transfers
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">ERC-20 token transfer history</p>
              </div>
              <div className="p-6">
                {tokenTransfers && tokenTransfers.data.length > 0 ? (
                  <div className="space-y-3">
                    {tokenTransfers.data.map((transfer) => (
                      <div key={`${transfer.transactionHash}-${transfer.logIndex}`} className="flex items-center justify-between p-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-all">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700 font-mono font-semibold">
                              {transfer.token.symbol}
                            </Badge>
                            <Link href={`/tx/${transfer.transactionHash}`} className="text-sm font-mono text-cyan-600 dark:text-cyan-400 hover:underline truncate font-semibold">
                              {truncateHash(transfer.transactionHash, 8, 6)}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                            <Link href={`/block/${transfer.blockNumber}`} className="hover:underline flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              Block {formatNumber(transfer.blockNumber)}
                            </Link>
                            <span>•</span>
                            <span>{formatTimeAgo(transfer.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">From:</span> <span className="font-mono">{truncateHash(transfer.from)}</span>
                            <span>→</span>
                            <span className="font-medium">To:</span> <span className="font-mono">{truncateHash(transfer.to)}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                            {(Number(transfer.value) / Math.pow(10, transfer.token.decimals)).toLocaleString('en-US', {
                              maximumFractionDigits: 4,
                            })}
                          </div>
                          <div className="text-xs text-zinc-500 font-medium">{transfer.token.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-12">No token transfers found</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-6">
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  NFT Holdings
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">ERC-721 and ERC-1155 tokens owned by this address</p>
              </div>
              <div className="p-6">
                {nfts && nfts.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nfts.data.map((nft) => (
                      <div key={`${nft.collectionAddress}-${nft.tokenId}`} className="p-5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {nft.collection?.name && (
                              <span className="font-bold text-base">{nft.collection.name}</span>
                            )}
                            {nft.collection?.tokenType && (
                              <Badge variant="outline" className="text-xs bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700">
                                {nft.collection.tokenType}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                            Token ID: <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">{nft.tokenId}</span>
                          </div>
                          {nft.amount && nft.amount !== '1' && (
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                              Amount: <span className="font-semibold text-rose-600 dark:text-rose-400">{nft.amount}</span>
                            </div>
                          )}
                          <Link href={`/address/${nft.collectionAddress}`} className="text-xs font-mono text-rose-600 dark:text-rose-400 hover:underline block break-all">
                            {truncateHash(nft.collectionAddress, 10, 8)}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-12">No NFTs found</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* NFT Transfers Tab */}
          <TabsContent value="nft-transfers" className="mt-6">
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                    <ArrowRightLeft className="h-5 w-5 text-white" />
                  </div>
                  NFT Transfers
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">NFT transfer history for this address</p>
              </div>
              <div className="p-6">
                {nftTransfers && nftTransfers.data.length > 0 ? (
                  <div className="space-y-3">
                    {nftTransfers.data.map((transfer, idx) => (
                      <div key={`${transfer.transactionHash}-${transfer.tokenId}-${idx}`} className="flex items-center justify-between p-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            {transfer.collection?.name && (
                              <span className="font-bold text-base">{transfer.collection.name}</span>
                            )}
                            <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
                              {transfer.tokenType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                              Token ID: <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">{transfer.tokenId}</span>
                            </span>
                            <Link href={`/tx/${transfer.transactionHash}`} className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                              {truncateHash(transfer.transactionHash, 8, 6)}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                            <Link href={`/block/${transfer.blockNumber}`} className="hover:underline flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              Block {formatNumber(transfer.blockNumber)}
                            </Link>
                            <span>•</span>
                            <span>{formatTimeAgo(transfer.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">From:</span> <span className="font-mono">{truncateHash(transfer.from)}</span>
                            <span>→</span>
                            <span className="font-medium">To:</span> <span className="font-mono">{truncateHash(transfer.to)}</span>
                          </div>
                        </div>
                        {transfer.amount && transfer.amount !== '1' && (
                          <div className="ml-4 text-right">
                            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">×{transfer.amount}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-12">No NFT transfers found</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

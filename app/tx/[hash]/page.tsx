import { getEnrichedTransaction, getAddressMetadata, getAddress } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRightLeft, CheckCircle2, XCircle, Clock, Zap, FileCode, ArrowLeft, Box, Shield, Wallet } from 'lucide-react';
import { formatEther, formatGwei, formatTimestamp, formatTimeAgo, truncateHash, formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface TransactionPageProps {
  params: Promise<{ hash: string }>;
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { hash } = await params;

  let transaction;
  let fromMetadata;
  let toMetadata;
  let fromAddress;
  let toAddress;
  let error;

  try {
    // Fetch enriched transaction (includes decoded function data)
    transaction = await getEnrichedTransaction(hash);

    // Fetch metadata and address info for from and to addresses in parallel
    if (transaction) {
      [fromMetadata, toMetadata, fromAddress, toAddress] = await Promise.all([
        getAddressMetadata(transaction.from).catch(() => null),
        transaction.to ? getAddressMetadata(transaction.to).catch(() => null) : Promise.resolve(null),
        getAddress(transaction.from).catch(() => null),
        transaction.to ? getAddress(transaction.to).catch(() => null) : Promise.resolve(null),
      ]);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load transaction';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Transaction</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Not Found</CardTitle>
              <CardDescription>Transaction {hash} could not be found.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const txFee = BigInt(transaction.gasUsed) * BigInt(transaction.effectiveGasPrice || transaction.gasPrice || '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-2xl">Transaction Details</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTimestamp(transaction.timestamp)} ({formatTimeAgo(transaction.timestamp)})
                </CardDescription>
              </div>
              {transaction.status !== undefined && (
                <Badge variant={transaction.status ? 'default' : 'destructive'} className="flex items-center gap-2">
                  {transaction.status ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Success
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Failed
                    </>
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Transaction Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Transaction Hash</span>
                <code className="text-sm font-mono break-all">{transaction.hash}</code>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    Block Number
                  </span>
                  <Link href={`/block/${transaction.blockNumber}`} className="text-sm text-blue-600 hover:underline">
                    {formatNumber(transaction.blockNumber)}
                  </Link>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Transaction Index</span>
                  <span className="text-sm">#{transaction.transactionIndex}</span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">From</span>
                  {fromAddress?.isContract ? (
                    <span title="Contract">
                      <FileCode className="h-4 w-4 text-purple-600" />
                    </span>
                  ) : (
                    <span title="Wallet">
                      <Wallet className="h-4 w-4 text-zinc-400" />
                    </span>
                  )}
                </div>
                {fromMetadata ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/address/${transaction.from}`} className="text-sm font-semibold text-blue-600 hover:underline">
                        {fromMetadata.name}
                      </Link>
                      {fromMetadata.isVerified && (
                        <Shield className="h-3 w-3 text-green-600" />
                      )}
                      {fromMetadata.symbol && (
                        <Badge variant="outline" className="text-xs">{fromMetadata.symbol}</Badge>
                      )}
                    </div>
                    <Link href={`/address/${transaction.from}`} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-blue-600 block break-all">
                      {transaction.from}
                    </Link>
                  </div>
                ) : (
                  <Link href={`/address/${transaction.from}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                    {transaction.from}
                  </Link>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">To</span>
                  {transaction.to && toAddress?.isContract ? (
                    <span title="Contract">
                      <FileCode className="h-4 w-4 text-purple-600" />
                    </span>
                  ) : transaction.to ? (
                    <span title="Wallet">
                      <Wallet className="h-4 w-4 text-zinc-400" />
                    </span>
                  ) : null}
                </div>
                {transaction.to ? (
                  toMetadata ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/address/${transaction.to}`} className="text-sm font-semibold text-blue-600 hover:underline">
                          {toMetadata.name}
                        </Link>
                        {toMetadata.isVerified && (
                          <Shield className="h-3 w-3 text-green-600" />
                        )}
                        {toMetadata.symbol && (
                          <Badge variant="outline" className="text-xs">{toMetadata.symbol}</Badge>
                        )}
                      </div>
                      <Link href={`/address/${transaction.to}`} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-blue-600 block break-all">
                        {transaction.to}
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/address/${transaction.to}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                      {transaction.to}
                    </Link>
                  )
                ) : (
                  <Badge variant="secondary" className="w-fit">Contract Creation</Badge>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Value</span>
                  <span className="text-sm font-semibold">{formatEther(transaction.value)} MON</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Transaction Fee</span>
                  <span className="text-sm">{formatEther(txFee.toString())} MON</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gas Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Gas Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gas Limit</span>
                <span className="text-sm">{formatNumber(transaction.gas)}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gas Used</span>
                <span className="text-sm">{formatNumber(transaction.gasUsed)}</span>
              </div>

              {transaction.gasPrice && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gas Price</span>
                  <span className="text-sm">{formatGwei(transaction.gasPrice)} Gwei</span>
                </div>
              )}

              {transaction.effectiveGasPrice && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Effective Gas Price</span>
                  <span className="text-sm">{formatGwei(transaction.effectiveGasPrice)} Gwei</span>
                </div>
              )}

              {transaction.maxFeePerGas && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Max Fee Per Gas</span>
                  <span className="text-sm">{formatGwei(transaction.maxFeePerGas)} Gwei</span>
                </div>
              )}

              {transaction.maxPriorityFeePerGas && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Max Priority Fee Per Gas</span>
                  <span className="text-sm">{formatGwei(transaction.maxPriorityFeePerGas)} Gwei</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Nonce</span>
                <span className="text-sm">{transaction.nonce}</span>
              </div>

              {transaction.type !== undefined && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Transaction Type</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {transaction.type === 0 && 'Type 0 (Legacy)'}
                      {transaction.type === 1 && 'Type 1 (EIP-2930)'}
                      {transaction.type === 2 && 'Type 2 (EIP-1559)'}
                      {transaction.type === 4 && 'Type 4 (EIP-7702)'}
                      {transaction.type !== 0 && transaction.type !== 1 && transaction.type !== 2 && transaction.type !== 4 && `Type ${transaction.type}`}
                    </Badge>
                  </div>
                </div>
              )}

              {transaction.chainId !== undefined && transaction.chainId !== null && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Chain ID</span>
                  <span className="text-sm">{transaction.chainId}</span>
                </div>
              )}

              {transaction.methodId && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Method ID</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
                      {transaction.methodId}
                    </code>
                    {transaction.functionSignature && (
                      <Badge variant="secondary" className="text-xs">
                        {transaction.functionSignature}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {transaction.input && transaction.input !== '0x' && (
              <>
                <Separator />
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Input Data
                    {transaction.methodName && (
                      <Badge variant="outline" className="ml-2">
                        {transaction.methodName}
                      </Badge>
                    )}
                  </span>

                  {transaction.inputInformation?.decodeInputData && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-blue-600">
                              Decoded Function Call
                            </Badge>
                          </div>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base font-bold text-blue-900 dark:text-blue-100">
                              {transaction.methodName}
                            </span>
                            {transaction.inputInformation.defaultView && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                                {transaction.inputInformation.defaultView}
                              </span>
                            )}
                          </div>
                        </div>

                        {Object.keys(transaction.inputInformation.decodeInputData).length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Parameters:</span>
                            <div className="space-y-2">
                              {Object.entries(transaction.inputInformation.decodeInputData).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-1 p-3 bg-white/50 dark:bg-black/20 rounded border border-blue-200 dark:border-blue-900">
                                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{key}:</span>
                                  <code className="text-xs font-mono text-zinc-900 dark:text-zinc-100 break-all">
                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs text-zinc-500">Raw Input:</span>
                    <code className="text-xs font-mono break-all bg-zinc-100 dark:bg-zinc-900 p-3 rounded-lg overflow-x-auto block">
                      {transaction.input}
                    </code>
                  </div>
                </div>
              </>
            )}

            {transaction.accessList && transaction.accessList.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Access List (EIP-2930)</span>
                  <div className="space-y-2">
                    {transaction.accessList.map((item, index) => (
                      <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-zinc-500">Address:</span>
                            <Link href={`/address/${item.address}`} className="text-xs font-mono text-blue-600 hover:underline">
                              {item.address}
                            </Link>
                          </div>
                          {item.storageKeys.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-zinc-500">Storage Keys ({item.storageKeys.length}):</span>
                              {item.storageKeys.map((key, keyIndex) => (
                                <code key={keyIndex} className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 ml-4">
                                  {key}
                                </code>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {transaction.authorizationList && transaction.authorizationList.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Authorization List (EIP-7702)</span>
                  <div className="space-y-2">
                    {transaction.authorizationList.map((auth, index) => (
                      <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium text-zinc-500">Chain ID:</span>
                            <span className="ml-2">{auth.chainId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-zinc-500">Nonce:</span>
                            <span className="ml-2">{auth.nonce}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-zinc-500">Address:</span>
                            <Link href={`/address/${auth.address}`} className="ml-2 font-mono text-blue-600 hover:underline">
                              {auth.address}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Token Transfers */}
        {transaction.erc20TokensTransferred && transaction.erc20TokensTransferred.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Token Transfers ({transaction.erc20TokensTransferred.length})</CardTitle>
              <CardDescription>ERC-20 tokens transferred in this transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transaction.erc20TokensTransferred.map((transfer, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">
                          ERC-20
                        </Badge>
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          {transfer.token.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {transfer.token.symbol}
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">From:</span>
                          <Link href={`/address/${transfer.from}`} className="font-mono text-blue-600 hover:underline">
                            {truncateHash(transfer.from)}
                          </Link>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">To:</span>
                          <Link href={`/address/${transfer.to}`} className="font-mono text-blue-600 hover:underline">
                            {truncateHash(transfer.to)}
                          </Link>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">Amount:</span>
                          <span className="font-semibold">
                            {(Number(transfer.value) / Math.pow(10, transfer.token.decimals)).toLocaleString()} {transfer.token.symbol}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">Token Contract:</span>
                          <Link href={`/address/${transfer.token.address}`} className="font-mono text-xs text-blue-600 hover:underline">
                            {truncateHash(transfer.token.address)}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs */}
        {transaction.logs && transaction.logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Logs ({transaction.logs.length})</CardTitle>
              <CardDescription>Events emitted by this transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transaction.logs.map((log, index) => (
                  <div key={`${log.transactionHash}-${log.logIndex}`} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Log #{log.logIndex}</span>
                      <Link href={`/address/${log.address}`} className="text-sm font-mono text-blue-600 hover:underline">
                        {truncateHash(log.address)}
                      </Link>
                    </div>
                    {log.topics.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-zinc-500">Topics:</span>
                        {log.topics.map((topic, i) => (
                          <code key={i} className="block text-xs font-mono break-all text-zinc-600 dark:text-zinc-400">
                            [{i}] {topic}
                          </code>
                        ))}
                      </div>
                    )}
                    {log.data && log.data !== '0x' && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-zinc-500">Data:</span>
                        <code className="block text-xs font-mono break-all text-zinc-600 dark:text-zinc-400">
                          {log.data}
                        </code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Internal Transactions */}
        {transaction.internalTransactions && transaction.internalTransactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Internal Transactions ({transaction.internalTransactions.length})</CardTitle>
              <CardDescription>Calls made during this transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transaction.internalTransactions.map((itx, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{itx.type}</Badge>
                        <span className="text-zinc-500">From:</span>
                        <Link href={`/address/${itx.from}`} className="font-mono text-blue-600 hover:underline">
                          {truncateHash(itx.from)}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500 ml-16">To:</span>
                        <Link href={`/address/${itx.to}`} className="font-mono text-blue-600 hover:underline">
                          {truncateHash(itx.to)}
                        </Link>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatEther(itx.value)} MON</div>
                      <div className="text-xs text-zinc-500">Gas: {formatNumber(itx.gasUsed)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

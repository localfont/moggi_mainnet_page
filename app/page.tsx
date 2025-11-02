import { SearchCommand } from '@/components/search-command';
import { getLatestBlocks, getLatestTransactions } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, ArrowRightLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatNumber, formatTimeAgo, truncateHash, formatEther } from '@/lib/format-utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let latestBlocks;
  let latestTransactions;

  try {
    [latestBlocks, latestTransactions] = await Promise.all([
      getLatestBlocks(10),
      getLatestTransactions(10),
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome Monad Dev
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Fast, composable blockchain explorer for Monad Mainnet
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <SearchCommand />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Latest Blocks Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-600" />
                Latest Blocks
              </CardTitle>
              <CardDescription>Most recent blocks on the Monad network</CardDescription>
            </CardHeader>
            <CardContent>
              {latestBlocks && latestBlocks.data.length > 0 ? (
                <div className="space-y-3">
                  {latestBlocks.data.map((block) => (
                    <Link
                      key={block.number}
                      href={`/block/${block.number}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-mono">
                            #{formatNumber(block.number)}
                          </Badge>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(block.timestamp)}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500">
                          {block.transactionCount} transactions
                        </div>
                      </div>
                      <div className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="font-mono text-xs truncate max-w-[120px]">
                          {truncateHash(block.miner, 6, 4)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 text-center py-8">No blocks available</p>
              )}
            </CardContent>
          </Card>

          {/* Latest Transactions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-purple-600" />
                Latest Transactions
              </CardTitle>
              <CardDescription>Most recent transactions on the network</CardDescription>
            </CardHeader>
            <CardContent>
              {latestTransactions && latestTransactions.data.length > 0 ? (
                <div className="space-y-3">
                  {latestTransactions.data.map((tx) => (
                    <Link
                      key={tx.hash}
                      href={`/tx/${tx.hash}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-600 truncate max-w-[140px]">
                            {truncateHash(tx.hash, 8, 6)}
                          </span>
                          {tx.status !== undefined && (
                            <Badge variant={tx.status ? 'default' : 'destructive'} className="text-xs flex items-center gap-1">
                              {tx.status ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Success</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3" />
                                  <span>Failed</span>
                                </>
                              )}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(tx.timestamp)}
                        </div>
                        <div className="text-xs text-zinc-500">
                          From {truncateHash(tx.from)} → {tx.to ? truncateHash(tx.to) : 'Contract'}
                        </div>
                      </div>
                      <div className="ml-3 text-right">
                        <div className="text-sm font-medium whitespace-nowrap">
                          {formatEther(tx.value)} MON
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 text-center py-8">No transactions available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

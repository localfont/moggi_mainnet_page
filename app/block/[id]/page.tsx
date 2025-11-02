import { getBlock } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Box, Clock, User, Zap, Database, ArrowLeft } from 'lucide-react';
import { formatEther, formatGwei, formatTimestamp, formatTimeAgo, truncateHash, formatNumber, formatBytes, calculatePercentage } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface BlockPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { id } = await params;

  let block;
  let error;

  try {
    block = await getBlock(id);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load block';
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
              <CardTitle className="text-red-600">Error Loading Block</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!block) {
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
              <CardTitle>Block Not Found</CardTitle>
              <CardDescription>Block {id} could not be found or is being indexed.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const gasUsedPercentage = calculatePercentage(BigInt(block.gasUsed), BigInt(block.gasLimit));

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
                  <Box className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-3xl">Block #{formatNumber(block.number)}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTimestamp(block.timestamp)} ({formatTimeAgo(block.timestamp)})
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {block.transactionCount} transactions
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Block Details */}
        <Card>
          <CardHeader>
            <CardTitle>Block Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Block Hash</span>
                <code className="text-sm font-mono break-all">{block.hash}</code>
              </div>

              <Separator />

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Parent Hash</span>
                <code className="text-sm font-mono break-all">{block.parentHash}</code>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Miner
                  </span>
                  <Link href={`/address/${block.miner}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                    {block.miner}
                  </Link>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Timestamp</span>
                  <span className="text-sm">{formatTimestamp(block.timestamp)}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Gas Used
                  </span>
                  <div className="space-y-1">
                    <span className="text-sm">{formatNumber(block.gasUsed)} ({gasUsedPercentage}%)</span>
                    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${gasUsedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gas Limit</span>
                  <span className="text-sm">{formatNumber(block.gasLimit)}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Base Fee Per Gas</span>
                  <span className="text-sm">{formatGwei(block.baseFeePerGas)} Gwei</span>
                </div>

                {block.size && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Block Size
                    </span>
                    <span className="text-sm">{formatBytes(block.size)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        {block.transactions && block.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({block.transactions.length})</CardTitle>
              <CardDescription>Recent transactions in this block</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {block.transactions.slice(0, 10).map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link href={`/tx/${tx.hash}`} className="text-sm font-mono text-blue-600 hover:underline truncate block">
                        {truncateHash(tx.hash, 10, 8)}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>From: {truncateHash(tx.from)}</span>
                        <span>→</span>
                        <span>To: {tx.to ? truncateHash(tx.to) : 'Contract Creation'}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium">{formatEther(tx.value)} MON</div>
                      <Badge variant={tx.status ? 'default' : 'destructive'} className="mt-1">
                        {tx.status ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {block.transactions.length > 10 && (
                <p className="text-sm text-zinc-500 text-center mt-4">
                  Showing 10 of {block.transactions.length} transactions
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

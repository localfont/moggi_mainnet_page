import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AddressLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Address Header Card Skeleton */}
        <Card className="shadow-lg animate-pulse">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Balance and Stats */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <Card className="mt-6 shadow-lg">
          <CardContent className="pt-6">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
                <TabsTrigger value="transactions" className="animate-pulse">
                  <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </TabsTrigger>
                <TabsTrigger value="token-txs" className="animate-pulse">
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </TabsTrigger>
                <TabsTrigger value="tokens" className="animate-pulse">
                  <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </TabsTrigger>
                <TabsTrigger value="nfts" className="animate-pulse">
                  <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </TabsTrigger>
                <TabsTrigger value="nft-txs" className="animate-pulse">
                  <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </TabsTrigger>
                <TabsTrigger value="internal" className="animate-pulse">
                  <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </TabsTrigger>
              </TabsList>

              {/* Content Area Skeleton */}
              <TabsContent value="transactions" className="animate-pulse">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

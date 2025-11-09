import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BlockLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Block Details Card Skeleton */}
        <Card className="shadow-lg animate-pulse">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-7 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-4 w-56 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            {/* Block Info Section */}
            <div>
              <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Gas Details Section */}
            <div>
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card Skeleton */}
        <Card className="shadow-lg mt-6 animate-pulse">
          <CardHeader>
            <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

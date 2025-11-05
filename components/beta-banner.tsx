import { AlertCircle } from 'lucide-react';

export function BetaBanner() {
  return (
    <div className="bg-yellow-500/90 dark:bg-yellow-600/90 text-zinc-900 dark:text-zinc-50 py-3 px-6">
      <div className="container mx-auto flex items-center justify-center gap-3 text-center">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">
          <span className="font-bold">Beta Notice:</span> This website and our indexer are in beta.
          We are actively working to resolve all issues before the real mainnet launch on <span className="font-bold">November 24th</span>.
        </p>
      </div>
    </div>
  );
}

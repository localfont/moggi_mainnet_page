'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BytecodeDisplayProps {
  bytecode: string;
}

export function BytecodeDisplay({ bytecode }: BytecodeDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = bytecode.length > 300;
  const displayCode = isExpanded || !shouldTruncate ? bytecode : bytecode.slice(0, 300);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Contract Bytecode</span>
      <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border">
        <code className="text-xs font-mono break-all text-zinc-700 dark:text-zinc-300">
          {displayCode}
          {!isExpanded && shouldTruncate && '...'}
        </code>
      </div>
      {shouldTruncate && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {isExpanded
              ? `Showing all ${bytecode.length} characters`
              : `Showing first 300 characters of ${bytecode.length} total`
            }
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-7"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

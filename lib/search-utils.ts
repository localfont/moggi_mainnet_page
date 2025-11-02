export type SearchType = 'block' | 'transaction' | 'address' | 'unknown';

export interface SearchResult {
  type: SearchType;
  value: string;
}

/**
 * Detects the type of search query based on its format
 * - Block number: numeric string (e.g., "32992500")
 * - Block hash: 0x + 64 hex characters
 * - Transaction hash: 0x + 64 hex characters
 * - Address: 0x + 40 hex characters
 */
export function detectSearchType(query: string): SearchResult {
  const trimmed = query.trim();

  // Check if it's a pure number (block number)
  if (/^\d+$/.test(trimmed)) {
    return { type: 'block', value: trimmed };
  }

  // Check if it starts with 0x
  if (!trimmed.startsWith('0x')) {
    return { type: 'unknown', value: trimmed };
  }

  const hexPart = trimmed.slice(2);

  // Check if it's valid hex
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
    return { type: 'unknown', value: trimmed };
  }

  // Determine type based on length
  if (hexPart.length === 64) {
    // Could be block hash or transaction hash
    // We'll treat them as transaction by default
    // and try block hash as fallback in the search
    return { type: 'transaction', value: trimmed.toLowerCase() };
  } else if (hexPart.length === 40) {
    return { type: 'address', value: trimmed.toLowerCase() };
  }

  return { type: 'unknown', value: trimmed };
}

export function getSearchTypeLabel(type: SearchType): string {
  switch (type) {
    case 'block':
      return 'Block';
    case 'transaction':
      return 'Transaction';
    case 'address':
      return 'Address';
    default:
      return 'Unknown';
  }
}

export function getSearchUrl(result: SearchResult): string {
  switch (result.type) {
    case 'block':
      return `/block/${result.value}`;
    case 'transaction':
      return `/tx/${result.value}`;
    case 'address':
      return `/address/${result.value}`;
    default:
      return '/';
  }
}

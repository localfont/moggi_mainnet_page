import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { AddToMetaMask } from '@/components/add-to-metamask';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Learn more about Moggi Explorer and how we bring you blockchain data
            </p>
          </div>

          {/* Add to MetaMask Section */}
          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle>Add Monad Mainnet to MetaMask</CardTitle>
              <CardDescription>Connect to Monad Mainnet with one click</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <AddToMetaMask />
              <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
                Click the button above to automatically add Monad Mainnet to your MetaMask wallet
              </p>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>General Questions</CardTitle>
              <CardDescription>Common questions about Moggi Explorer</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do you fetch this data before launch?</AccordionTrigger>
                  <AccordionContent>
                    We made our own custom indexer that indexes the Monad mainnet before the official launch.
                    Our indexer continuously monitors the blockchain in real-time, capturing blocks, transactions,
                    and smart contract events as they occur. This allows us to provide comprehensive blockchain
                    data from day one.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What is Moggi Explorer?</AccordionTrigger>
                  <AccordionContent>
                    Moggi Explorer is a fast, modern blockchain explorer specifically built for Monad Mainnet.
                    It allows you to search and explore blocks, transactions, addresses, and token transfers on
                    the Monad blockchain with a clean, intuitive interface powered by real-time data.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How often is the data updated?</AccordionTrigger>
                  <AccordionContent>
                    Our indexer processes new blocks in near real-time as they are confirmed on the Monad network.
                    The explorer displays the latest blocks and transactions with minimal delay, typically within
                    seconds of block finalization. You can refresh the homepage to see the most recent activity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What can I search for on Moggi Explorer?</AccordionTrigger>
                  <AccordionContent>
                    You can search for:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li><strong>Block Numbers</strong> - e.g., 32992500</li>
                      <li><strong>Block Hashes</strong> - 0x followed by 64 hexadecimal characters</li>
                      <li><strong>Transaction Hashes</strong> - 0x followed by 64 hexadecimal characters</li>
                      <li><strong>Addresses</strong> - 0x followed by 40 hexadecimal characters</li>
                    </ul>
                    <p className="mt-2">
                      Our smart search automatically detects what you're looking for based on the format.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Is this an official Monad explorer?</AccordionTrigger>
                  <AccordionContent>
                    Moggi Explorer is an independent, community-built explorer for the Monad Mainnet.
                    While not an official Monad Labs product, we are committed to providing accurate,
                    reliable blockchain data to the Monad community through our custom-built indexing
                    infrastructure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>What information can I see for each transaction?</AccordionTrigger>
                  <AccordionContent>
                    For each transaction, you can view:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Transaction hash and status (success/failed)</li>
                      <li>Block number and timestamp</li>
                      <li>From and To addresses</li>
                      <li>Transaction value in MON</li>
                      <li>Gas usage and gas prices</li>
                      <li>Transaction input data</li>
                      <li>Event logs emitted</li>
                      <li>Internal transactions (if any)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Can I see token balances and transfers?</AccordionTrigger>
                  <AccordionContent>
                    Yes! When viewing an address, you can see:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li><strong>Token Balances</strong> - All ERC-20 tokens held by the address</li>
                      <li><strong>Token Transfers</strong> - Complete history of token transfers to/from the address</li>
                      <li><strong>Transaction History</strong> - All transactions involving the address</li>
                    </ul>
                    <p className="mt-2">
                      Each token displays its name, symbol, and properly formatted balance based on its decimals.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>How accurate is the data?</AccordionTrigger>
                  <AccordionContent>
                    Our indexer connects directly to Monad nodes and processes blockchain data exactly as it
                    appears on-chain. All information displayed is sourced directly from the blockchain with no
                    modifications. However, like any indexer, there may be brief delays during periods of high
                    network activity or during indexer maintenance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>Do you have an API?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Moggi Explorer is powered by a comprehensive REST API that provides access to blocks,
                    transactions, addresses, and token data. The API supports pagination, filtering, and real-time
                    queries. Check our API documentation for detailed endpoint information and usage examples.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>What makes Moggi Explorer different?</AccordionTrigger>
                  <AccordionContent>
                    Moggi Explorer focuses on:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li><strong>Speed</strong> - Built with Next.js 16 and React 19 for blazing-fast performance</li>
                      <li><strong>Clean Design</strong> - Modern, intuitive interface using shadcn/ui components</li>
                      <li><strong>Smart Search</strong> - Automatic detection of search types with keyboard shortcuts</li>
                      <li><strong>Custom Indexer</strong> - Our own indexing infrastructure for reliable data</li>
                      <li><strong>Developer-Friendly</strong> - Full API access for building on Monad</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11">
                  <AccordionTrigger>How do I add Monad Mainnet to MetaMask?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Click the "Add Monad to MetaMask" button at the top of the page or in the header.
                      This will automatically configure MetaMask with the following network details:
                    </p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li><strong>Network Name:</strong> Monad Mainnet</li>
                      <li><strong>Chain ID:</strong> 143 (0x8F)</li>
                      <li><strong>Currency Symbol:</strong> MON</li>
                      <li><strong>RPC URL:</strong> https://rpc-mainnet.monadinfra.com/rpc/...</li>
                      <li><strong>Block Explorer URL:</strong> https://mainnet.moggi.tools</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      Once added, you'll be able to view your transactions directly in Moggi Explorer
                      by clicking "View on Explorer" in MetaMask.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>We're here to help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                If you have additional questions or need support, feel free to reach out to us on Twitter:
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://x.com/Moggi_tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Follow @Moggi_tools
                </a>
                <a
                  href="https://x.com/ZortosCrypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  DM @ZortosCrypto
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

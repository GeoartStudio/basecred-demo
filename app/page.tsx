"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/profile-card";
import { useProfile } from "@/hooks/use-profile";
import { Wallet, Github, Package, ExternalLink, Copy, Check, Loader2, Search } from "lucide-react";

export default function Home() {
  const { address: connectedAddress } = useAccount();
  const [inputAddress, setInputAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const { data: profile, isLoading, error, refetch } = useProfile(selectedAddress);

  const handleSearch = () => {
    if (inputAddress && isAddress(inputAddress)) {
      setSelectedAddress(inputAddress);
    }
  };

  const handleUseConnectedWallet = () => {
    if (connectedAddress) {
      setInputAddress(connectedAddress);
      setSelectedAddress(connectedAddress);
    }
  };

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("npm i basecred-sdk");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidInput = inputAddress && isAddress(inputAddress);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-between">
          {/* Main Content */}
          <div className="flex flex-col items-center gap-4 lg:gap-8 w-full max-w-md">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">BaseCred Demo</h1>
              <p className="text-muted-foreground mt-2">
                View reputation data from Ethos Network and Talent Protocol
              </p>
            </div>

            {/* Wallet Connection */}
            <div className="flex flex-col items-center gap-4 w-full">
              <ConnectButton />

              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or enter address</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Address Input */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="font-mono text-sm"
                  />
                  <Button onClick={handleSearch} disabled={!isValidInput || isLoading}>
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
                {inputAddress && !isValidInput && (
                  <p className="text-xs text-destructive">
                    Please enter a valid Ethereum address
                  </p>
                )}
                {connectedAddress && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUseConnectedWallet}
                    className="w-full"
                  >
                    <Wallet className="size-4" />
                    Use connected wallet
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <ProfileCard
              profile={profile}
              isLoading={isLoading}
              error={error}
              onRetry={() => refetch()}
            />

            {/* Example Addresses */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Try these addresses:</p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {[
                  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                  "0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1",
                ].map((addr) => (
                  <button
                    key={addr}
                    onClick={() => {
                      setInputAddress(addr);
                      setSelectedAddress(addr);
                    }}
                    className="font-mono text-xs bg-muted hover:bg-accent px-2 py-1 rounded transition-colors"
                  >
                    {addr.slice(0, 6)}...{addr.slice(-4)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SDK Info Panel */}
          <div className="w-full max-w-lg lg:sticky lg:top-8 lg:self-start lg:justify-end">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Install the SDK from NPM
                  </p>
                  <div className="bg-muted rounded-md p-3 font-mono text-sm flex items-center justify-between gap-2">
                    <span>npm i basecred-sdk</span>
                    <button
                      onClick={handleCopyInstall}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      aria-label="Copy install command"
                    >
                      {copied ? (
                        <Check className="size-4 text-green-500" />
                      ) : (
                        <Copy className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Quick integration
                  </p>
                  <div className="bg-muted rounded-md p-3 font-mono text-xs overflow-x-auto">
                    <pre className="whitespace-pre">{`import { getUnifiedProfile } from 'basecred-sdk';

const profile = await getUnifiedProfile(
  '0xabc...',
  {
    ethos: {
      baseUrl: 'https://api.ethos.network',
      clientId: 'your-app@0.1.0',
    },
    talent: {
      baseUrl: 'https://api.talentprotocol.com',
      apiKey: process.env.TALENT_API_KEY!,
    },
  }
);`}</pre>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.npmjs.com/package/basecred-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Package className="size-4" />
                    <span>NPM Package</span>
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                  <a
                    href="https://github.com/GeoartStudio/basecred-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Github className="size-4" />
                    <span>GitHub Repository</span>
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    basecred-sdk provides unified access to reputation data from Ethos Network and Talent Protocol.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

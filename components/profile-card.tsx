"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreDisplay } from "./score-display";
import { ProfileStats } from "./profile-stats";
import { UnifiedProfile, AvailabilityState } from "@/hooks/use-profile";
import { AlertCircle } from "lucide-react";

interface ProfileCardProps {
  profile: UnifiedProfile | undefined;
  isLoading: boolean;
  error: Error | null;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function AvailabilityBadge({
  source,
  status,
}: {
  source: string;
  status: AvailabilityState;
}) {
  const colors: Record<AvailabilityState, string> = {
    available: "bg-green-500/20 text-green-400",
    not_found: "bg-yellow-500/20 text-yellow-400",
    unlinked: "bg-orange-500/20 text-orange-400",
    error: "bg-red-500/20 text-red-400",
  };

  const labels: Record<AvailabilityState, string> = {
    available: "Available",
    not_found: "Not found",
    unlinked: "Unlinked",
    error: "Error",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}
    >
      {source}: {labels[status]}
    </span>
  );
}

export function ProfileCard({ profile, isLoading, error }: ProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Skeleton className="h-16 w-24" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <AlertCircle className="size-12 text-destructive" />
          <p className="text-destructive font-medium">Failed to load profile</p>
          <p className="text-sm text-muted-foreground text-center">
            {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <p className="text-muted-foreground">
            Enter an address to view profile
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasEthosData = profile.availability.ethos === "available" && profile.ethos;
  const hasTalentData = profile.availability.talent === "available" && profile.talent;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {profile.identity.address.slice(2, 4).toUpperCase()}
        </div>
        <CardTitle className="font-mono text-sm mt-2">
          {truncateAddress(profile.identity.address)}
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2 justify-center">
          <AvailabilityBadge source="Ethos" status={profile.availability.ethos} />
          <AvailabilityBadge source="Talent" status={profile.availability.talent} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <ScoreDisplay
          ethosScore={hasEthosData ? profile.ethos!.data.score : undefined}
          builderScore={hasTalentData ? profile.talent!.data.builderScore : undefined}
          hasNegativeReviews={hasEthosData ? profile.ethos!.signals.hasNegativeReviews : false}
        />
        {hasEthosData && (
          <ProfileStats
            reviews={profile.ethos!.data.reviews}
            vouchesReceived={profile.ethos!.data.vouchesReceived}
          />
        )}
        {!hasEthosData && !hasTalentData && (
          <p className="text-sm text-muted-foreground text-center">
            No reputation data found for this address
          </p>
        )}
      </CardContent>
    </Card>
  );
}

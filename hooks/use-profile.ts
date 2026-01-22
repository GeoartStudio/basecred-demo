import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";

export type AvailabilityState = "available" | "not_found" | "unlinked" | "error";

export interface UnifiedProfile {
  identity: {
    address: string;
  };
  availability: {
    ethos: AvailabilityState;
    talent: AvailabilityState;
  };
  ethos?: {
    data: {
      score: number;
      vouchesReceived: number;
      reviews: {
        positive: number;
        neutral: number;
        negative: number;
      };
    };
    signals: {
      hasNegativeReviews: boolean;
      hasVouches: boolean;
    };
    meta: {
      firstSeenAt: string | null;
      lastUpdatedAt: string | null;
      activeSinceDays: number | null;
    };
  };
  talent?: {
    data: {
      builderScore: number;
    };
    signals: {
      verifiedBuilder: boolean;
    };
    meta: {
      lastUpdatedAt: string | null;
    };
  };
}

async function fetchProfile(address: string): Promise<UnifiedProfile> {
  const response = await fetch(`/api/profile/${address}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch profile");
  }
  return response.json();
}

export function useProfile(address: string | undefined) {
  return useQuery({
    queryKey: ["profile", address],
    queryFn: () => fetchProfile(address!),
    enabled: !!address && isAddress(address),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

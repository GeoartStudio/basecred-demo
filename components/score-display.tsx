import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface ScoreDisplayProps {
  ethosScore?: number;
  builderScore?: number;
  hasNegativeReviews?: boolean;
}

function getScoreStatus(
  score: number,
  hasNegativeReviews: boolean
): { label: string; color: string; description: string } {
  if (hasNegativeReviews) {
    return {
      label: "Negative",
      color: "text-red-600",
      description: "This address has received negative reviews"
    };
  }
  if (score >= 1500) {
    return {
      label: "Trusted",
      color: "text-green-700",
      description: "Score 1500+: Highly trusted with positive reputation"
    };
  }
  if (score >= 1000) {
    return {
      label: "Positive",
      color: "text-emerald-600",
      description: "Score 1000-1499: Good standing with positive activity"
    };
  }
  return {
    label: "Neutral",
    color: "text-muted-foreground",
    description: "Score below 1000: New or limited activity"
  };
}

export function ScoreDisplay({
  ethosScore,
  builderScore,
  hasNegativeReviews = false,
}: ScoreDisplayProps) {
  const hasEthos = ethosScore !== undefined;
  const hasTalent = builderScore !== undefined;

  if (!hasEthos && !hasTalent) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">No score data available</p>
      </div>
    );
  }

  const status = hasEthos
    ? getScoreStatus(ethosScore, hasNegativeReviews)
    : null;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {hasEthos && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-bold tracking-tight">
            {ethosScore}
          </span>
          <div className="flex items-center gap-1" title={status?.description}>
            <span className={cn("text-sm font-medium", status?.color)}>
              {status?.label}
            </span>
            <HelpCircle className="size-3 text-muted-foreground cursor-help" />
          </div>
          <span className="text-xs text-muted-foreground">Ethos Score</span>
        </div>
      )}
      {hasTalent && (
        <div className="flex flex-col items-center gap-1 pt-2 border-t border-border w-full">
          <div
            className="flex items-center gap-2 mt-2"
            title="Talent Protocol Builder Score: Measures on-chain builder activity"
          >
            <span className="text-2xl font-semibold">{builderScore}</span>
            <span className="text-xs text-muted-foreground">Builder Score</span>
            <HelpCircle className="size-3 text-muted-foreground cursor-help" />
          </div>
        </div>
      )}
    </div>
  );
}

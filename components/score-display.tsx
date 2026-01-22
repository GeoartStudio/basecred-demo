import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  ethosScore?: number;
  builderScore?: number;
  hasNegativeReviews?: boolean;
}

function getScoreStatus(
  score: number,
  hasNegativeReviews: boolean
): { label: string; color: string } {
  if (hasNegativeReviews) {
    return { label: "Negative", color: "text-red-500" };
  }
  if (score >= 1500) {
    return { label: "Trusted", color: "text-green-500" };
  }
  if (score >= 1000) {
    return { label: "Positive", color: "text-emerald-400" };
  }
  return { label: "Neutral", color: "text-muted-foreground" };
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
          <span className={cn("text-sm font-medium", status?.color)}>
            {status?.label}
          </span>
          <span className="text-xs text-muted-foreground">Ethos Score</span>
        </div>
      )}
      {hasTalent && (
        <div className="flex flex-col items-center gap-1 pt-2 border-t border-border w-full">
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-semibold">{builderScore}</span>
            <span className="text-xs text-muted-foreground">Builder Score</span>
          </div>
        </div>
      )}
    </div>
  );
}

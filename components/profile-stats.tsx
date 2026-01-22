import { ThumbsUp, Users } from "lucide-react";

interface ProfileStatsProps {
  reviews?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  vouchesReceived?: number;
}

function calculatePositivePercentage(reviews: {
  positive: number;
  neutral: number;
  negative: number;
}): number {
  const total = reviews.positive + reviews.neutral + reviews.negative;
  if (total === 0) return 0;
  return Math.round((reviews.positive / total) * 100);
}

export function ProfileStats({ reviews, vouchesReceived }: ProfileStatsProps) {
  const hasReviews = reviews !== undefined;
  const hasVouches = vouchesReceived !== undefined;

  if (!hasReviews && !hasVouches) {
    return null;
  }

  const totalReviews = hasReviews
    ? reviews.positive + reviews.neutral + reviews.negative
    : 0;
  const positivePercentage = hasReviews
    ? calculatePositivePercentage(reviews)
    : 0;

  return (
    <div className="flex flex-wrap gap-4 justify-center text-sm">
      {hasReviews && totalReviews > 0 && (
        <div className="flex items-center gap-2">
          <ThumbsUp className="size-4 text-green-500" />
          <span>
            <span className="font-medium">{positivePercentage}%</span>{" "}
            <span className="text-muted-foreground">
              positive ({totalReviews} reviews)
            </span>
          </span>
        </div>
      )}
      {hasReviews && totalReviews === 0 && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <ThumbsUp className="size-4" />
          <span>No reviews yet</span>
        </div>
      )}
      {hasVouches && (
        <div className="flex items-center gap-2">
          <Users className="size-4 text-blue-500" />
          <span>
            <span className="font-medium">{vouchesReceived}</span>{" "}
            <span className="text-muted-foreground">
              {vouchesReceived === 1 ? "vouch" : "vouches"}
            </span>
          </span>
        </div>
      )}
      {hasVouches && vouchesReceived === 0 && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="size-4" />
          <span>No vouches yet</span>
        </div>
      )}
    </div>
  );
}

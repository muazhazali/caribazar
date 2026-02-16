import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  className?: string
  showValue?: boolean
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 14,
  className,
  showValue = false,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }, (_, i) => {
        const fillPercent = Math.min(1, Math.max(0, rating - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-muted-foreground/30"
              fill="currentColor"
              strokeWidth={0}
            />
            {fillPercent > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent * 100}%` }}
              >
                <Star
                  size={size}
                  className="text-accent"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

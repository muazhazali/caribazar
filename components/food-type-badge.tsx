import { cn } from "@/lib/utils"
import { FOOD_TYPE_LABELS, FOOD_TYPE_COLORS, type FoodType } from "@/lib/types"

interface FoodTypeBadgeProps {
  foodType: FoodType
  className?: string
}

export function FoodTypeBadge({ foodType, className }: FoodTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        FOOD_TYPE_COLORS[foodType],
        className
      )}
    >
      {FOOD_TYPE_LABELS[foodType]}
    </span>
  )
}

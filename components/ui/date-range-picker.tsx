"use client"

import { DayPicker, type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  selected?: DateRange
  onSelect?: (range: DateRange | undefined) => void
  className?: string
  disabled?: boolean
  minDate?: Date
}

export function DateRangePicker({
  selected,
  onSelect,
  className,
  disabled = false,
  minDate,
}: DateRangePickerProps) {
  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={onSelect}
      disabled={minDate ? { before: minDate } : disabled || undefined}
      className={cn("p-3", className)}
    />
  )
}
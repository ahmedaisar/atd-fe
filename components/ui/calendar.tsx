"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-semibold text-gray-900",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 border-none",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell: "text-gray-500 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-blue-50 [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }), 
          "h-10 w-10 p-0 font-normal text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors aria-selected:opacity-100"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white rounded-md",
        day_today: "bg-blue-50 text-blue-600 font-semibold border border-blue-200",
        day_outside:
          "day-outside text-gray-400 opacity-50 aria-selected:bg-blue-50 aria-selected:text-blue-400 aria-selected:opacity-60",
        day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-600",
        day_range_start: "rounded-l-md bg-blue-600 text-white hover:bg-blue-700",
        day_range_end: "rounded-r-md bg-blue-600 text-white hover:bg-blue-700",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        NextMonthButton: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar, type DateRange }

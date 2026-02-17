"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  modifiersClassNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rdp-root p-3 text-slate-100", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center h-9",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 h-9 w-9 rounded-lg bg-slate-800 p-0 opacity-70 hover:opacity-100 text-slate-100",
        button_next: "absolute right-1 h-9 w-9 rounded-lg bg-slate-800 p-0 opacity-70 hover:opacity-100 text-slate-100",
        caption_label: "text-sm font-medium",
        weekday: "text-slate-400 text-[0.8rem]",
        day: "relative p-0 text-center",
        day_button: "h-9 w-9 rounded-lg p-0 text-slate-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900",
        outside: "text-slate-600 opacity-50",
        disabled: "text-slate-600 opacity-50",
        ...classNames,
      }}
      modifiersClassNames={{
        today: "bg-slate-700/50",
        selected: "!bg-sky-500 !text-white",
        ...modifiersClassNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

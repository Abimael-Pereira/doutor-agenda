"use client";

import { addMonths, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const from = fromParam ? parseISO(fromParam) : new Date();
  const to = toParam ? parseISO(toParam) : addMonths(new Date(), 1);

  const handleDateSelect = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from || !dateRange?.to) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", dateRange.from.toISOString().split("T")[0]);
    params.set("to", dateRange.to.toISOString().split("T")[0]);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const date = { from, to };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal sm:w-auto",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                    {format(date.to, "LLL dd, y", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </span>
            <span className="inline truncate text-xs sm:hidden">
              {date?.from && date?.to ? (
                <>
                  {format(date.from, "dd/MM", { locale: ptBR })} -{" "}
                  {format(date.to, "dd/MM", { locale: ptBR })}
                </>
              ) : (
                <span>Período</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            locale={ptBR}
            className="sm:hidden"
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
            className="hidden sm:block"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

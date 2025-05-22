import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const DatePicker = React.forwardRef<
  HTMLButtonElement,
  {
    value?: Date;
    onChange: (date?: Date) => void;
    error?: boolean;
  }
>(({ value, onChange, error }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          error && "border-destructive"
        )}
      >
        <CalendarIcon className="mr h-4 w-4" />
        {value ? format(value, "dd/MM/yyyy") : "Choisir une date"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        initialFocus
        disabled={(date) => date > new Date()}
        captionLayout="dropdown-buttons"
        defaultMonth={new Date(2024)}
      />
    </PopoverContent>
  </Popover>
));

DatePicker.displayName = "DatePicker";

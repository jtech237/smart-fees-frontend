import React, { useEffect, useState } from "react";
import { format as formatDate, isValid, parse } from "date-fns";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const parseDateFormat = (format: string) => {
  const sep = format.match(/[^dmy]/)?.[0] || "/";
  const parts = format.split(new RegExp(`[${sep}]`)).map((part) => {
    if (part === "dd" || part === "MM" || part === "yyyy") return part;
    throw new Error(`Invalid date format part: ${part}`);
  });
  return { parts, separator: sep };
};

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value: Date | string;
  onChange: (value: Date | null) => void;
  format?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, format = "dd/MM/yyyy", className, ...props }, ref) => {
    const { parts, separator } = parseDateFormat(format);
    const [rawValue, setRawValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Conversion initiale
    useEffect(() => {
      if (!isTyping) {
        const date = typeof value === "string" ? parse(value, format, new Date()) : value;
        setRawValue(isValid(date) ? formatDate(date, format) : "");
      }
    }, [value, format, isTyping]);

    const validateAndFormat = (input: string): { formatted: string; date: Date | null } => {
      // Nettoyage et segmentation
      const digits = input.replace(/\D/g, "");
      const partLengths = parts.map(p => p === "yyyy" ? 4 : 2);
      const totalDigits = partLengths.reduce((a, b) => a + b, 0);
      const cleaned = digits.slice(0, totalDigits);

      // Découpage en parties
      let idx = 0;
      const segments = partLengths.map(len => {
        const seg = cleaned.slice(idx, idx + len);
        idx += len;
        return seg;
      });

      // Formatage avec séparateurs
      let formatted = "";
      segments.forEach((seg, i) => {
        if (!seg) return;
        formatted += seg;
        if (i < segments.length - 1 && segments[i + 1]) formatted += separator;
      });

      // Validation complète
      const allPartsValid = segments.every((seg, i) => {
        const expectedLength = partLengths[i];
        return seg.length === expectedLength;
      });

      // Conversion en Date uniquement si complet
      const date = allPartsValid ? parse(formatted, format, new Date()) : null;
      return { formatted, date: isValid(date) ? date : null };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsTyping(true);
      const result = validateAndFormat(e.target.value);
      setRawValue(result.formatted);
      onChange(result.date);
    };

    const handleBlur = () => {
      setIsTyping(false);
      const result = validateAndFormat(rawValue);

      if (result.date) {
        setRawValue(formatDate(result.date, format));
        onChange(result.date);
      } else {
        setRawValue("");
        onChange(null);
      }
    };

    return (
      <Input
        className={cn(className)}
        ref={ref}
        value={rawValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={format.toLowerCase()}
        inputMode="numeric"
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircleIcon, CheckCircle } from "lucide-react";
import { StepDef, StepStatus } from "./RegisterForm";

type StepperProps = {
  steps: StepDef[];
  currentStep: number;
  onStepChange: (idx: number) => void;
  statuses: StepStatus[];
};

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  statuses,
  onStepChange,
}) => {
  const listRef = useRef<HTMLOListElement>(null);
  const translatePercent =
    currentStep > 1
      ? Math.min((currentStep - 1) * (100 / 3), (steps.length - 3) * (100 / 3))
      : 0;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const scrollAmount = (translatePercent / 100) * el.scrollWidth;
    el.scrollTo({ left: scrollAmount, behavior: "smooth" });
  }, [currentStep, translatePercent]);

  return (
    <ol
      ref={listRef}
      role="list"
      aria-label="Registration progress"
      className="flex overflow-x-auto gap-4 px-2 py-4 snap-x scroll-pl-2"
    >
      {steps.map((step, idx) => {
        const status = statuses[idx];
        const active = idx === currentStep;
        let icon, circleClasses, lineClasses;

        if (status === "success") {
          icon = <CheckCircle />;
          circleClasses = "bg-green-500 border-green-500 text-white";
          lineClasses = "bg-green-500";
        } else if (status === "error") {
          icon = <AlertCircleIcon />;
          circleClasses = "bg-red-500 border-red-500 text-white";
          lineClasses = "bg-red-500";
        } else {
          icon = step.icon;
          circleClasses = active
            ? "border-indigo-600 text-indigo-600"
            : "border-gray-300 text-gray-500";
          lineClasses = active ? "bg-indigo-600" : "bg-gray-300";
        }

        return (
          <motion.li
            key={idx}
            role="listitem"
            aria-current={active ? "step" : undefined}
            aria-label={`Step ${idx + 1}: ${step.title}`}
            className={cn(
              "relative flex-shrink-0 w-[calc(100%/3)] px-4 flex flex-col items-center text-center snap-start cursor-pointer",
              active ? "text-indigo-600" : "text-foreground"
            )}
            onClick={() => onStepChange?.(idx)}
          >
            <motion.div
              layout
              initial={{ scale: 0.8 }}
              animate={{ scale: active ? 1.1 : 1 }}
              className={cn(
                "mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center",
                circleClasses
              )}
            >
              {icon ?? <span>{idx + 1}</span>}
            </motion.div>

            {/* Titre et description */}
            <div className="flex gap-x-4">
              <h3 className="mt-2 text-sm font-medium">{step.title}</h3>
              {step.description && (
                <p className="mt-1 text-xs hidden md:block text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>

            {/* Trait de connexion (entre les étapes) */}
            {idx < steps.length - 1 && (
              <span
                className={cn(
                  "absolute hidden top-1/2 right-[-50%] w-full h-[2px] z-[-1]",
                  lineClasses
                )}
                aria-hidden="true"
              />
            )}
          </motion.li>
        );
      })}
    </ol>
  );
};

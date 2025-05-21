import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircleIcon, CheckCircle, LucideIcon } from "lucide-react";
import { StepDef, StepStatus } from "./RegisterForm";

const statusClasses = {
  success: {
    circle: "bg-green-500 border-green-500 text-white",
    line: "bg-green-500",
  },
  error: {
    circle: "bg-red-500 border-red-500 text-white",
    line: "bg-red-500",
  },
  pending: {
    circle: "border-gray-300 text-gray-500",
    line: "bg-gray-300",
  },
};

type StepIndicatorProps = {
  status: StepStatus;
  active: boolean;
  idx: number;
  icon?: React.ReactNode;
  isCompleted: boolean;
};

type StatusKey = Exclude<StepStatus, 'pending'>;

const iconComponents: Record<StatusKey, LucideIcon> = {
  success: CheckCircle,
  error: AlertCircleIcon,
};

const StepIndicator = React.memo(
  ({ status, active, idx, icon, isCompleted }: StepIndicatorProps) => {
    const isPending = status === 'pending';
    const IconComponent = !isPending ? iconComponents[status] : null;
    const showNumber = !status || status === "pending";

    return (
      <motion.div
        initial={false}
        animate={{ scale: active ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 500 }}
        className={cn(
          "mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center",
          status === "success" && statusClasses.success.circle,
          status === "error" && statusClasses.error.circle,
          status === "pending" && [
            statusClasses.pending.circle,
            active && "border-primary text-primary",
          ]
        )}
      >
        {isCompleted && !active ? (
          <CheckCircle className="w-5 h-5" />
        ) : IconComponent ? (
          <IconComponent className="w-5 h-5" />
        ) : (
          icon || (showNumber && <span className="text-sm">{idx + 1}</span>)
        )}
      </motion.div>
    );
  }
);
StepIndicator.displayName = "StepIndicator";

type StepperProps = {
  steps: StepDef[];
  currentStep: number;
  onStepChange: (idx: number) => void;
  statuses: StepStatus[];
};

const Stepper: React.FC<StepperProps> = ({
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

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onStepChange(idx);
    }
  };

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
        const isCompleted = status === "success";

        return (
          <motion.li
            key={idx}
            role="button"
            tabIndex={0}
            aria-label={`${step.title} - ${status}`}
            className={cn(
              "relative flex-shrink-0 w-[calc(100%/3)] px-4 flex flex-col items-center text-center snap-start",
              active ? "text-primary" : "text-muted-foreground",
              "hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            style={{ transform: `translateX(-${translatePercent}%)` }}
            onClick={() => onStepChange(idx)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
          >
            <StepIndicator
              status={status}
              active={active}
              idx={idx}
              icon={step.icon}
              isCompleted={isCompleted}
            />

            {/* Titre et description */}
            <div className="flex gap-x-4 flex-col md:flex-row mt-2">
              <h3 className="mt-2 text-sm font-medium">{step.title}</h3>
              {step.description && (
                <p className="text-xs hidden md:block text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>

            {/* Trait de connexion (entre les étapes) */}
            {idx < steps.length - 1 && (
              <span
                className={cn(
                  "absolute hidden top-1/2 right-[-50%] w-full h-[2px] z-[-1]",
                  statusClasses[status].line
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

export { StepIndicator, Stepper };

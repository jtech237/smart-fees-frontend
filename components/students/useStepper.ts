import { useCallback, useEffect, useState } from "react";
import { StepDef, StepStatus } from "./RegisterForm";
import { UseFormTrigger } from "react-hook-form";
import { FormValues } from "./schemas";

export const useStepper = (
  steps: StepDef[],
  trigger: UseFormTrigger<FormValues>
) => {
  const [current, setCurrent] = useState(0);
  const [validatedSteps, setValidatedSteps] = useState<number[]>([]);
  const [statuses, setStatuses] = useState<StepStatus[]>(
    Array(steps.length).fill("pending")
  );

  const validateStep = useCallback(
    async (idx: number) => {
      const schema = steps[idx]?.validationSchema;
      if (!schema) {
        setStatuses((s) => updateStatus(s, idx, "success"));
        return true;
      }

      const fields = Object.keys(schema.shape) as Array<keyof FormValues>;
      const isValid = await trigger(fields);

      setStatuses((s) => updateStatus(s, idx, isValid ? "success" : "error"));
      return isValid;
    },
    [steps, trigger]
  );

  const goToStep = useCallback(
    async (target: number) => {
      if (target === current) return;

      if (target > current && !validatedSteps.includes(current)) {
        await validateStep(current);
        return;
      }

      if (target > target) {
        for (let i = target; i < target; i++) {
          if (!validatedSteps.includes(i)) {
            const isValid = await validateStep(i);
            if (!isValid) {
              setCurrent(i);
              return;
            }
          }
        }
      }

      setCurrent(target);
    },
    [current, validatedSteps, validateStep]
  );

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(current);
    if (!isValid) return;

    setValidatedSteps((prev) => {
      if (prev.includes(current)) return prev;
      return [...prev, current];
    });
    setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  }, [current, steps.length, validateStep]);

  const handlePrev = useCallback(() => {
    setCurrent((s) => Math.max(0, s - 1));
  }, []);

  useEffect(() => {
    setStatuses((prev) =>
      prev.map((status, index) =>
        validatedSteps.includes(index) ? "success" : status
      )
    );
  }, [validatedSteps]);

  return {
    current,
    statuses,
    goToStep,
    handleNext,
    handlePrev,
    validatedSteps,
  };
};

const updateStatus = (
  statuses: Array<StepStatus>,
  index: number,
  status: StepStatus
) => {
  if (statuses[index] === status) return statuses;

  const copy = [...statuses];
  copy[index] = status;
  return copy;
};

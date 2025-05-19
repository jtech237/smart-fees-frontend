import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { Step1, Step2, Step3, Step4 } from "./steps";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormValues, fullSchema, stepSchemas } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { useLocalStorage } from "usehooks-ts";

export type StepDef = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  component: React.FC;
  validationSchema?: (typeof stepSchemas)[number];
};

export type StepStatus = "pending" | "success" | "error";

const steps: StepDef[] = [
  { title: "CGU", component: Step1, validationSchema: stepSchemas[0] },
  {
    title: "Informations personnelles",
    component: Step2,
    validationSchema: stepSchemas[1],
  },
  { title: "Scolarité", component: Step3, validationSchema: stepSchemas[2] },
  { title: "Verification", component: Step4 },
];

const RegisterForm = ({
  initialData,
  onDirtyChange,
  onDataChange
}: {
  initialData?: FormValues;
  onDirtyChange?: (dirty: boolean) => void;
  onDataChange?: (data: FormValues) => void;
}) => {

  const [savedData, setSavedData] = useLocalStorage('registerForm', {
    data: {} as FormValues,
    step: 0,
    statuses: Array(steps.length).fill('pending')
  })

  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<StepStatus[]>(savedData.statuses);

  const methods = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: initialData || {
      accept: true,
      classe_id: 0,
      cycle: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = methods.watch((data) => {
      onDataChange?.(data as FormValues);
      onDirtyChange?.(methods.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  useEffect(() => {
    onDirtyChange?.(methods.formState.isDirty)
  }, [methods.formState.isDirty])

  const triggerStepValidation = async (idx: number) => {
    const schema = steps[idx].validationSchema;
    if (!schema) {
      setStepStatus((s) => {
        const copy = [...s];
        copy[idx] = "success";
        return copy;
      });
      return true;
    }

    const fields = Object.keys(schema.shape) as Array<keyof FormValues>;
    const valid = await methods.trigger(fields);
    setStepStatus((s) => {
      const copy = [...s];
      copy[idx] = valid ? "success" : "error";
      return copy;
    });
    return valid;
  };

  const StepComponent = steps[currentStep]?.component;

  const goToStep = async (idx: number) => {
    if (idx === currentStep) return;
    if (idx > currentStep) {
      // Pour aller en avant, valider l’étape courante
      for (let i = currentStep; i < idx; i++) {
        if (!(await triggerStepValidation(i))) {
          goToStep(i);
          return;
        }
      }
    }
    setCurrentStep(idx);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setSavedData({
      data: {} as FormValues,
      step: 0,
      statuses: Array(steps.length).fill('pending'),
    });
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      methods.handleSubmit(onSubmit)();
    } else {
      await goToStep(currentStep + 1);
    }
  };
  const handlePrev = () => setCurrentStep((s) => s - 1);

  return (
    <Form {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={(idx) => goToStep(idx)}
          statuses={stepStatus}
        />
        <div className="mt-4">{StepComponent && <StepComponent />}</div>

        <div className="flex justify-between mt-6">
          {currentStep !== 0 && (
            <Button type="button" variant="ghost" onClick={handlePrev}>
              Precedent
            </Button>
          )}

          <Button
            onClick={handleNext}
            className={cn(currentStep === 0 && "ms-auto")}
          >
            {currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;

import { Button } from "../ui/button";
import React, { useState } from "react";
import { Stepper } from "./Stepper";
import { Step1, Step2, Step3, Step4 } from "./steps";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormValues, fullSchema, stepSchemas } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";

export type StepDef = {
  title: string
  description?: string
  icon?: React.ReactNode
  component: React.FC
  validationSchema?: typeof stepSchemas[number]
}

export type StepStatus = "pending" | "success" | "error"

const steps: StepDef[] = [
  { title: "CGU", component: Step1, validationSchema: stepSchemas[0] },
  { title: "Informations personnelles", component: Step2, validationSchema: stepSchemas[1] },
  { title: "Scolarité", component: Step3, validationSchema: stepSchemas[2] },
  { title: "Verification", component: Step4 }
]

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<StepStatus[]>(Array(steps.length).fill("pending"))
  const methods = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      accept: true,
      classe_id: 0,
      cycle: 0
    },
    mode: "onChange"
  })

  const validateStep = async (idx: number) => {
    const schema = steps[idx].validationSchema!;
    const fields = Object.keys(schema.shape) as Array<keyof FormValues>;
    const valid = await methods.trigger(fields);
    setStepStatus((s) => {
      const copy = [...s];
      copy[idx] = valid ? "success" : "error";
      return copy;
    });
    return valid;
  };


  const StepComponent = steps[currentStep].component
  const goToStep = async (idx: number) => {
    if (idx === currentStep) return;
    if (idx > currentStep) {
      // Pour aller en avant, valider l’étape courante
      const ok = await validateStep(currentStep);
      if (!ok) return;
    }
    setCurrentStep(idx);
  };

  const handleNext = () => goToStep(currentStep + 1);
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
        <div className="mt-4">
          {StepComponent && <StepComponent/>}
        </div>

        <div className="flex justify-between mt-6">
          {currentStep !== 0 && (
            <Button type="button" variant="ghost" onClick={handlePrev}>Precedent</Button>
          ) }

          <Button onClick={handleNext} className={cn(
            currentStep === 0 && "ms-auto"
          )}>
            {currentStep === steps.length-1 ? "Terminer" : "Suivant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm

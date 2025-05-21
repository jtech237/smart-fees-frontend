import { Button } from "../ui/button";
import React, { useCallback, useState } from "react";
import { Stepper } from "./Stepper";
import { Step1, Step2, Step3, Step4 } from "./steps";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormValues, fullSchema, stepSchemas } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { usePreRegistration } from "@/lib/api/students";
import { AxiosError } from "axios";
import { useStepper } from "./useStepper";

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
    title: "Informations",
    component: Step2,
    validationSchema: stepSchemas[1],
  },
  { title: "Scolarité", component: Step3, validationSchema: stepSchemas[2] },
  { title: "Vérification", component: Step4 },
];

const RegisterForm = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      accept: true,
      classe: 0,
      cycle: 0,
    },
    mode: "onChange",
  });

  const {
    current: currentStep,
    statuses,
    goToStep,
    handleNext: handleStepperNext,
    handlePrev,
    validatedSteps
  } = useStepper(steps, methods.trigger);

  const { mutateAsync, isPending, isSuccess, data } = usePreRegistration();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutateAsync(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.status === 422) {
            setSubmissionError(
              "Une erreur est survenue lors de l'enregistrement: Verifiez vos informations saisies."
            );
          }
        } else {
          setSubmissionError(
            "Une erreur est survenue lors de l'enregistrement"
          );
        }
      }
    },
    [mutateAsync]
  );

  const handleNext = useCallback(async () => {
    if (currentStep === steps.length - 1) {
      await methods.handleSubmit(onSubmit)();
    } else {
      await handleStepperNext();
    }
  }, [currentStep, handleStepperNext, methods, onSubmit]);

  const StepComponent = steps[currentStep]?.component;

  return (
    <Form {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={goToStep}
          statuses={statuses}
        />
        <div className="mt-4">
          {isSuccess ? (
            <div className="p-4 bg-primary text-primary-foreground">
              <h2 className="text-xl font-bold">
                Votre pre-inscription a ete enregistrer
              </h2>
              <ul className="mt-2 space-y-2">
                <li>Votre Matricule: {data.matricule}</li>
                <li>Votre Mot de passe par defaut: {data.password}</li>
              </ul>
            </div>
          ) : (
            <>
              {submissionError && (
                <div className="p-4 bg-destructive text-destructive-foreground mb-4">
                  {submissionError}
                </div>
              )}
              {validatedSteps.includes(currentStep) && <StepComponent />}
              {!validatedSteps.includes(currentStep) && <StepComponent />}
            </>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {currentStep !== 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              disabled={isPending}
            >
              Precedent
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={isPending}
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

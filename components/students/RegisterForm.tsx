import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { Step1, Step2, Step3, Step4 } from "./steps";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormValues, fullSchema, stepSchemas } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
<<<<<<< HEAD
import { useLocalStorage } from "usehooks-ts";
=======
import { usePreRegistration } from "@/lib/api/students";
import { AxiosError } from "axios";
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992

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

<<<<<<< HEAD
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
=======
const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [statuses, setStatuses] = useState<StepStatus[]>(
    Array(steps.length).fill("pending")
  );
  const methods = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      accept: true,
      classe: 0,
      cycle: 0,
    },
    mode: "onChange",
  });

  const triggerStepValidation = async (idx: number) => {
    const schema = steps[idx].validationSchema;
    if (!schema) {
      // Pas de validation nécessaire pour cette étape
      setStatuses((s) => {
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992
        const copy = [...s];
        copy[idx] = "success";
        return copy;
      });
      return true;
    }

<<<<<<< HEAD
=======
    // Sinon, validation normale
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992
    const fields = Object.keys(schema.shape) as Array<keyof FormValues>;
    const valid = await methods.trigger(fields);
    setStatuses((s) => {
      const copy = [...s];
      copy[idx] = valid ? "success" : "error";
      return copy;
    });
    return valid;
  };

  const StepComponent = steps[currentStep]?.component;
<<<<<<< HEAD

  const goToStep = async (idx: number) => {
    if (idx === currentStep) return;
    if (idx > currentStep) {
      // Pour aller en avant, valider l’étape courante
=======
  const goToStep = async (idx: number) => {
    if (idx === currentStep) return;
    if (idx > currentStep) {
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992
      for (let i = currentStep; i < idx; i++) {
        if (!(await triggerStepValidation(i))) {
          goToStep(i);
          return;
        }
      }
    }
    setCurrentStep(idx);
  };

<<<<<<< HEAD
  const onSubmit = (data: FormValues) => {
    console.log(data);
    setSavedData({
      data: {} as FormValues,
      step: 0,
      statuses: Array(steps.length).fill('pending'),
    });
=======
  const { mutateAsync, isPending, isSuccess, data } = usePreRegistration();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const onSubmit = async (data: FormValues) => {
    try {
      await mutateAsync(data);
    } catch (err) {
      if(err instanceof AxiosError){
        if(err.status === 422){
          setSubmissionError("Une erreur est survenue lors de l'enregistrement: Verifiez vos informations saisies.")
        }
      }else{
        setSubmissionError("Une erreur est survenue lors de l'enregistrement");
      }
    }
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
<<<<<<< HEAD
=======
      // ici, c’est le bouton "Terminer" : tu peux appeler onSubmit ou methods.handleSubmit(...)
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992
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
          statuses={statuses}
        />
<<<<<<< HEAD
        <div className="mt-4">{StepComponent && <StepComponent />}</div>
=======
        <div className="mt-4 h-[500px] overflow-y-scroll">
          {isSuccess && (
            <div>
              <span></span>
              <ul>
                <li>Votre Matricule: {data.matricule}</li>
                <li>Votre Mot de passe par defaut: {data.firstname}</li>
              </ul>
            </div>
          )}

          {submissionError && (
            <div className="p-4 bg-destructive text-destructive-foreground mb-4">
              {submissionError}
            </div>
          )}
          {StepComponent && <StepComponent />}
        </div>
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992

        <div className="flex justify-between mt-6">
          {currentStep !== 0 && (
            <Button type="button" variant="ghost" onClick={handlePrev}>
              Precedent
            </Button>
          )}

          <Button
            onClick={handleNext}
<<<<<<< HEAD
=======
            disabled={isPending}
>>>>>>> 9e7078a22edbb72cd47f596cf131167c454c2992
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

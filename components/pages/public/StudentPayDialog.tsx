import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RequiredFees } from "@/lib/api/fees";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/index";
import { toast } from "sonner";
import Link from "next/link";
import { AxiosError } from "axios";

type MethodOption = {
  id: number;
  label: string;
  logo: string; // ou string si tu importes avec next/image
  ussdPrefix: string; // "*126*" ou "*150*"
};

const METHODS: MethodOption[] = [
  {
    id: 2,
    label: "MTN Mobile Money",
    logo: "/assets/images/momo-logo.webp",
    ussdPrefix: "*126*",
  },
  {
    id: 1,
    label: "Orange Money",
    logo: "/assets/images/om-logo.png",
    ussdPrefix: "*150*",
  },
];

export function StudentPayDialog({ fee }: { fee: RequiredFees }) {
  const [state, setState] = useState<{
    step: "method" | "number" | "processing" | "error" | "success";
    error?: string;
    selectedMethod?: MethodOption;
    receiptUrl?: string;
    phone?: string;
  }>({ step: "method" });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!state.selectedMethod || !state.phone) {
        console.log(state)
        throw new Error("Sélection incomplète");
      }

      const res = await api.post<{ reference: string; receiptUrl: string }>(
        "/payments",
        {
          fee_id: fee.id,
          method_id: state.selectedMethod?.id,
          phone_number: state.phone,
        }
      );

      return res.data;
    },
    onSuccess(data) {
      setState({
        step: "success",
        receiptUrl: data.receiptUrl,
      });
    },
    onError(error) {
      console.log(error)
      let message = "Erreur inconnue";

      if (error instanceof AxiosError) {
        if (error.response) {
          const { data } = error.response;
          if (data.detail) message = data.detail;
          else if (data.message) message = data.message;
        } else if (error.message) {
          message = error.message;
        }
      }

      if (error instanceof Error) {
        setState({
          step: "error",
          error: error.message,
        });
      }

      setState({
        step: "error",
        error: message,
      });
    },
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (state.step === "processing") {
      timeout = setTimeout(() => {
        if (state.step === "processing") {
          paymentMutation.reset();
          setState({
            step: "error",
            error: "Délai d'attente dépassé.",
          });
        }
      }, 120000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [paymentMutation, state.step]);
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  const renderStep = () => {
    switch (state.step) {
      case "method":
        return (
          <div className="space-y-4">
            {METHODS.map((m) => (
              <Button
                key={m.id}
                variant="outline"
                className="h-24 w-full flex flex-col gap-2"
                onClick={() => setState({ step: "number", selectedMethod: m })}
              >
                <Image src={m.logo} alt={m.label} width={80} height={40} />
                <span>{m.label}</span>
              </Button>
            ))}
          </div>
        );

      case "number":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Entrez votre numéro {state.selectedMethod?.label} sans indicatif
            </p>
            <Input
              placeholder="6XX XXX XXX"
              type="tel"
              value={state.phone || ""}
              onChange={(e) =>
                setState((s) => ({ ...s, phone: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setState({ step: "method" })}
              >
                Retour
              </Button>
              <Button
                disabled={!state.phone}
                onClick={() => {
                  setState((s) => ({...s, step: "processing"}));
                  paymentMutation.mutate();
                }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p>Traitement du paiement en cours...</p>
            <p className="text-sm text-gray-500 mt-2">
              {"Veuillez valider l'opération sur votre téléphone"}
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="font-semibold">Paiement réussi!</p>
            <p className="text-sm text-gray-500 mt-2">
              Votre reçu est disponible ci-dessous
            </p>
            <a
              href={state.receiptUrl}
              target="_blank"
              className="mt-4 inline-block"
            >
              <Button variant="secondary">Voir le reçu</Button>
            </a>
          </div>
        );

      case "error":
        return (
          <div className="text-center py-4">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="font-semibold">Échec du paiement</p>
            <p className="text-red-500 mt-2">{state.error}</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setState({ step: "method" })}
              >
                Réessayer
              </Button>
              <Button asChild>
                <Link href="/support">Support</Link>
              </Button>
            </div>
          </div>
        );
    }
  };

  // const handleMethod = (m: MethodOption)=> {
  //   setSelectedMethod(m)
  //   setStep("number")
  // }

  // const handlePay = () => {
  //   if(!phone || !selectedMethod) return
  //   paymentMutation.mutate()
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Payer maintenant</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Paiement: {fee.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            {Intl.NumberFormat("fr", {
              currency: "XAF",
              style: "currency",
            }).format(fee.amount)}
          </DialogDescription>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}

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
import { Fee } from "@/types/fees";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCreatePayment } from "@/lib/api/students"; // adapte le path
import { RequiredFees } from "@/lib/api/fees";

type MethodOption = {
  id: number;
  label: string;
  logo: string; // ou string si tu importes avec next/image
  ussdPrefix: string;     // "*126*" ou "*150*"
};

const METHODS: MethodOption[] = [
  { id: 1, label: "MTN Mobile Money", logo: "/assets/images/momo-logo.webp", ussdPrefix: "*126*" },
  { id: 2, label: "Orange Money",    logo: "/assets/images/om-logo.png",    ussdPrefix: "*150*" },
];

export function StudentPayDialog({ fee }: { fee: RequiredFees }) {
  const [selectedMethod, setSelectedMethod] = useState<MethodOption | null>(null);
  const [step, setStep] = useState<"method" | "number" | "confirm">("method");
  const [phone, setPhone] = useState("");
  const createPayment = useCreatePayment();

  const ussdCode = selectedMethod
    ? `${selectedMethod.ussdPrefix}${fee.amount}#`
    : "";

  const handleConfirm = () => {
    if (!selectedMethod || !phone) return;
    setStep("confirm");
    // appel au back
    createPayment.mutate(
      { feeId: fee.id, method: selectedMethod.id },
      {
        onSuccess: () => {
          // tu peux afficher un toast ou fermer la dialog
        },
        onError: (err: any) => {
          console.error(err);
          // afficher message d'erreur
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Payer maintenant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Frais : {fee.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-6">
            {step === "method" && METHODS.map((m) => (
              <Button
                key={m.id}
                variant="outline"
                className="h-24 w-full flex flex-col gap-2"
                onClick={() => {
                  setSelectedMethod(m);
                  setStep("number");
                }}
              >
                <Image src={m.logo} alt={m.label} width={80} height={40} />
                <span>{m.label}</span>
              </Button>
            ))}

            {step === "number" && (
              <>
                <Input
                  placeholder="Numéro de téléphone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={handleConfirm}
                  disabled={createPayment.isPending}
                >
                  {createPayment.isPending ? (
                    <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                  ) : (
                    "Confirmer"
                  )}
                </Button>
              </>
            )}

            {step === "confirm" && (
              <div className="text-center space-y-4">
                <p>Compose sur ton téléphone :</p>
                <div className="text-xl font-mono bg-gray-100 p-4 rounded">
                  {ussdCode}
                </div>
                {createPayment.isError && (
                  <p className="text-red-500">
                    Erreur lors du paiement. Réessaie.
                  </p>
                )}
                {createPayment.isSuccess && (
                  <p className="text-green-600">
                    Paiement enregistré !
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

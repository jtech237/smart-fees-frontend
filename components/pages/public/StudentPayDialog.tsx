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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { RequiredFees } from "@/lib/api/fees";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/index";
import { toast } from "sonner";

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
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)

    const paymentMutation = useMutation({
      mutationFn: () => api.post<{reference: string, receiptUrl: string}>("/payments", {
        fee_id: fee.id,
        method_id: selectedMethod?.id,
        phone_number: phone
      }),
      onSuccess(res){
        setReceiptUrl(res.data.receiptUrl)
        toast.success("Paiment reuissi")

      },
      onError(error){
        toast.error(error.message || "Echec du paiment")
        setStep("method")
      }
    }
    )

    const handleMethod = (m: MethodOption)=> {
      setSelectedMethod(m)
      setStep("number")
    }

    const handlePay = () => {
      if(!phone || !selectedMethod) return
      paymentMutation.mutate()
    }


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
                onClick={() => handleMethod(m)}
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
                  onClick={handlePay}
                  disabled={paymentMutation.isPending}
                >
                  {paymentMutation.isPending ? (
                    <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                  ) : (
                    "Payer"
                  )}
                </Button>
              </>
            )}

{receiptUrl && (
          <div className="space-y-4 text-center">
            <p className="text-green-600">Paiement validé !</p>
            <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">Voir le reçu / Imprimer</Button>
            </a>
          </div>
        )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

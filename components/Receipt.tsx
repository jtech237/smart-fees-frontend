// app/payments/[reference]/page.tsx  → components/ReceiptClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchPaymentDetail, PaymentDetail } from "@/lib/api/payment";
import { getCurrentAcademicYear } from "@/lib/utils";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ReceiptClient() {
  const { ref } = useParams();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(ref);
    if (!ref) {
      setError("Référence manquante");
      setLoading(false);
      return;
    }

    console.log(ref);

    fetchPaymentDetail(String(ref))
      .then((data) => {
        setPayment(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [ref]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-20 w-20 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error || !payment) {
    notFound();
    return null;
  }

  return (
    <div className="h-screen print:bg-white print:text-black print:p-4 print:overflow-hidden print:h-auto print:w-auto">
      {/* <!-- Entete --> */}
      <div className="grid grid-cols-3 items-center">
        <div className="flex flex-col gap-y-3 text-center">
          <span>République du cameroun</span>

          <div className="flex items-center justify-center">
            <div className="relative h-7 w-15">
              <Image src={"/assets/images/cameroun.png"} alt="Cameroun" fill />
            </div>
          </div>
          <span>Paix-Travail-Patrie</span>
        </div>
        <div className=" flex items-center justify-center ">
          <div className="relative h-40 w-40">
            <Image
              src="/assets/images/logos/full.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-3 text-center">
          <span>Republic of Cameroon</span>
          <div className="flex items-center justify-center">
            <div className="relative h-7 w-15">
              <Image src={"/assets/images/cameroun.png"} alt="Cameroun" fill />
            </div>
          </div>
          <span>Peace-Work-Fatherland</span>
        </div>
      </div>
      {/* <!-- Corps --> */}
      <div className="mt-4">
        <div className="relative">
          <h1 className="text-center text-bold text-4xl">Reçu</h1>
          <p className="text-sm text-center italic text-bold">
            Ref: {payment.reference}
          </p>
          <div className="top-0 right-0 absolute" >
            <Image
            className=""
              src={"/assets/images/qr-code.png"}
              alt="Reference"
              width={80}
              height={80}
            />
          </div>
        </div>

        <div className="border-2 border-gray-800 mt-6">
          <div className="bg-gray-400 p-2">
            <h2 className="text-semibold">{"Information de l'élève"}</h2>
          </div>
          <div className="p-2 grid grid-cols-3 gap-y-4">
            <span>Noms et prénoms</span>
            <span className="col-span-2">{`${payment.student.firstname} ${payment.student.lastname}`}</span>
            <span>Matricule</span>
            <span className="col-span-2">{`${payment.student.matricule}`}</span>
            <span>Date de naissance</span>
            <span className="col-span-2">{`${payment.student.dateOfBirth.toLocaleString()}`}</span>
          </div>
        </div>
        <div className="border-2 border-gray-800 mt-3">
          <div className="bg-gray-400 p-2">
            <h2 className="text-semibold">Scolarité</h2>
          </div>
          <div className="p-2 grid grid-cols-3 gap-y-4">
            <span>Année scolaire</span>
            <span className="col-span-2">{getCurrentAcademicYear()}</span>
            <span>Classe</span>
            <span className="col-span-2">{payment.student.classe.name}</span>
          </div>
        </div>
        <div className="border-2 border-gray-800 mt-4">
          <div className="bg-gray-400 p-2">
            <h2 className="text-semibold">Informations du paiemnt</h2>
          </div>
          <div className="p-2 grid grid-cols-3 gap-y-4">
            <span>Frais payé</span>
            <span className="col-span-2">{`${payment.fee.name}`}</span>
            <span>Montant payé</span>
            <span className="col-span-2">{`${Intl.NumberFormat("fr", {
              currency: "XAF",
              style: "currency",
            }).format(payment.amount)}`}</span>
          </div>
        </div>
      </div>

      <div className="print:hidden mt-6 flex space-x-4">
        <Button onClick={() => window.print()}>Imprimer / Export PDF</Button>
        <a
          href="/"
          className="px-4 py-2 border rounded hover:bg-gray-100 transition"
        >
          Retour à l’accueil
        </a>
      </div>
    </div>
  );
}

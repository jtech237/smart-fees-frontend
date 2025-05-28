"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Label } from "@/components/ui/label";
import { useRequiredDocuments } from "@/lib/api/classes";
import { useRequiredFees } from "@/lib/api/fees";
import { useStudent } from "@/lib/api/students";
import { Info, Loader2, Terminal } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function StudentDashboard() {
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null);
  const [paymentFee, setPaymentFee] = useState<any | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ussdCode, setUssdCode] = useState("");
  const [paymentStep, setPaymentStep] = useState<
    "method" | "number" | "confirm"
  >("method");
  const [selectedMethod, setSelectedMethod] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    data: student,
    isLoading,
    error,
  } = useStudent(String(session?.user.personalId), {
    staleTime: Infinity,
  });

  const {
    data: requiredDocs,
    isLoading: requiredDocsLoading,
    error: requiredDocsError,
  } = useRequiredDocuments(
    {
      classeId: Number(student?.classe.id),
    },
    {
      enabled: !isLoading,
    }
  );

  const {
    data: requiredFees,
    isLoading: requiredFeesLoading,
    error: requiredFeesError,
  } = useRequiredFees(Number(student?.classe.id), {
    enabled: !isLoading,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient()

  const handleDocumentUpload = async (docTypeId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("doc_type_id", docTypeId.toString());
      formData.append("file", file);

      await uploadStudentDocument(formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const simulatePayment = async () => {
    // Simulation de paiement
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 2000);
    });
  };

  useEffect(() => {
    if (session?.user && session.user.role !== "STUDENT") {
      signOut({ callbackUrl: "/auth/login?next=/students" });
    }
  }, [session, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className=" h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!student) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <Terminal className="h-4 w-4 mr-2" />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription>
          {(error as Error).message || "Erreur de chargement des données"}
        </AlertDescription>
        <Button onClick={() => signOut()}>Se déconnecter</Button>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Bienvenue dans votre espace personnel</AlertTitle>
          <AlertDescription>
            Votre dossier étudiant a bien été créé
          </AlertDescription>
        </Alert>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Informations personnelles</h2>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Matricule :</span>
              <span className="font-mono">{student.matricule}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Nom complet :</span>
              <span>
                {student.firstname} {student.lastname?.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Date de naissance :</span>
              <span>
                {new Date(student.dateOfBirth).toLocaleDateString("fr-FR")}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Classe :</span>
              <span>{student.classe.name}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Documents requis pour l'admission
            </h2>
            {requiredDocsLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : requiredDocsError ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Impossible de charger les documents requis
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {requiredDocs?.map((doc) => {
                  const isSubmitted = student.documents?.some(
                    (d: any) => d.document_type.id === doc.id
                  );
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div>
                        <span className="font-medium">{doc.name}</span>
                        {doc.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      {!isSubmitted && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={"sm"}>Envoyer</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Soumission de {`${doc.name}`}
                              </DialogTitle>
                            </DialogHeader>
                            <DialogDescription asChild>
                              <div className="space-x-4">
                                <Label htmlFor="doc-upload">
                                  Importez votre document au format img, jpg ou
                                  png
                                </Label>
                                <Input
                                  type="file"
                                  accept="images/*"
                                  id="doc-upload"
                                />
                                <Button>Envoyer</Button>
                              </div>
                            </DialogDescription>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nouvelle section Frais requis */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Frais requis pour l'inscription
            </h2>
            {requiredFeesLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : requiredFeesError ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Impossible de charger les frais requis
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {requiredFees?.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div>
                      <span className="font-medium">{fee.name}</span>
                      {fee.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {fee.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {Intl.NumberFormat("fr", {
                          currency: "XAF",
                          style: "currency",
                        }).format(fee.amount)}
                      </p>
                      {fee.deadline && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Échéance:{" "}
                          {new Date(fee.deadline).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">Payer maintenant</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Paiements des frais : {`${fee.name}`}
                          </DialogTitle>
                        </DialogHeader>
                        <DialogDescription asChild>
                          <div>
                            {paymentStep === "method" && (
                              <div className="space-y-4">
                                <Button
                                  variant="outline"
                                  className="h-24 w-full flex flex-col gap-2"
                                  onClick={() => {
                                    setSelectedMethod("MTN");
                                    setPaymentStep("number");
                                  }}
                                >
                                  <Image
                                    src="/assets/images/momo-logo.webp"
                                    alt="MTN Mobile Money"
                                    height={40}
                                    width={80}
                                  />
                                  <span>MTN Mobile Money</span>
                                </Button>

                                <Button
                                  variant="outline"
                                  className="h-24 w-full flex flex-col gap-2"
                                  onClick={() => {
                                    setSelectedMethod("Orange");
                                    setPaymentStep("number");
                                  }}
                                >
                                  <Image
                                    src="/assets/images/om-logo.png"
                                    width={80}
                                    height={40}
                                    alt="Orange Money"
                                  />
                                  <span>Orange Money</span>
                                </Button>
                              </div>
                            )}

                            {paymentStep === "number" && (
                              <div className="space-y-4">
                                <Input
                                  placeholder="Numéro de téléphone"
                                  value={phoneNumber}
                                  onChange={(e) =>
                                    setPhoneNumber(e.target.value)
                                  }
                                  type="tel"
                                />
                                <Button
                                  className="w-full"
                                  onClick={() => {
                                    setPaymentStep("confirm");
                                    // Simulation USSD
                                    setTimeout(() => {
                                      setUssdCode(
                                        `${selectedMethod === "MTN" ? "*126*1" : "#150*1"}*${fee.amount}#`
                                      );
                                      simulatePayment().then(() => {
                                        setTimeout(
                                          () => setPaymentFee(null),
                                          2000
                                        );
                                      });
                                    }, 1000);
                                  }}
                                >
                                  Confirmer
                                </Button>
                              </div>
                            )}

                            {paymentStep === "confirm" && (
                              <div className="text-center space-y-4">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                                <p>Composez sur votre téléphone :</p>
                                <div className="text-xl font-mono bg-gray-100 p-4 rounded">
                                  {ussdCode}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <Link href="/#payment">Accéder au portail de paiement</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/#receipt">Voir mes reçus de paiement</Link>
            </Button>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => signOut({ callbackUrl: "/#inscription" })}
              variant="destructive"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

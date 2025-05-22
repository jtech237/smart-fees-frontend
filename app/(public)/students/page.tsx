"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/lib/api/students";
import { Loader2, Terminal } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { data: student, isLoading, error } = useStudent(session?.user.id);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      signOut({ redirectTo: "/#inscription" });
    } else if (session.user.role !== "STUDENT") {
      signOut({ redirectTo: "/#inscription" });
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
          <Terminal className="h-4 w-4" />
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

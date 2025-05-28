"use client";
import {
  useClasse,
  useClasseClassrooms,
  useRequiredDocuments,
} from "@/lib/api/classes";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const DetailedClasse: React.FC<{
  id: number;
}> = ({ id }) => {
  const [hasRequestedDocuments, setHasRequestedDocuments] = useState(false);
  const [hasRequestedClassrooms, setHasRequestedClassrooms] = useState(false);

  const { data: classe, isLoading, error, refetch } = useClasse(id);

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useRequiredDocuments(
    { classeId: id },
    { enabled: hasRequestedDocuments }
  );

  const {
    data: classrooms,
    isLoading: isLoadingClassrooms,
    error: classroomsError,
  } = useClasseClassrooms(id, {
    staleTime: Infinity,
    enabled: hasRequestedClassrooms,
  });

  useEffect(() => {
    if (!isLoading && classe) {
      document.title = "Details de la classe " + classe?.name;
    } else {
      document.title = "Loading...";
    }
  }, [classe, isLoading]);

  const handleDocumentsOpen = useCallback(
    (open: boolean) => {
      if (open && !hasRequestedDocuments) {
        setHasRequestedDocuments(true);
      }
    },
    [hasRequestedDocuments]
  );

  const handleClassroomsOpen = useCallback(
    (open: boolean) => {
      if (open && !hasRequestedClassrooms) {
        setHasRequestedClassrooms(true);
      }
    },
    [hasRequestedClassrooms]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className=" h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-y-3 justify-center items-center h-screen">
        <p className="text-red-500">Erreur: {(error as Error).message}</p>
        <Button onClick={() => refetch()}>Réessayer</Button>
        <Link href="/admin/manage/classes">
          <Button variant="outline">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  if (!classe) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">{classe.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{classe.cycle.name}</Badge>
          </div>
        </div>
        <Link href="/admin/manage/classes">
          <Button variant="outline">← Retour aux classes</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section hiérarchie */}
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hiérarchie</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Classe parente :</span>{" "}
              {classe.parent?.name || "Aucune"}
            </p>
            <p>
              <span className="font-medium">{"Nombre d'enfants :"}</span>{" "}
              {/* {classe.children?.length || 0} */}
            </p>
          </div>

          {/* Section cycle */}
          {classe.cycle && (
            <div className="p-6 bg-card rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Cycle</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nom :</span> {classe.cycle.name}
                </p>
                <p>
                  <span className="font-medium">Nombre de classes :</span>{" "}
                  {/* {classe.cycle.classes?.length || 0} */}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section documents */}
      <Collapsible onOpenChange={handleDocumentsOpen}>
        <div className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full flex justify-between items-center p-6"
            >
              <h2>Documents requis pour cette classe</h2>
              {hasRequestedDocuments ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div>
              <div className="p-6 bg-card rounded-lg shadow">
                {isLoadingDocuments ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : documentsError ? (
                  <p className="text-red-500">
                    Erreur de chargement des documents
                  </p>
                ) : documents?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground">
                              {doc.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={doc.required ? "destructive" : "outline"}
                        >
                          {doc.required ? "Obligatoire" : "Recommandé"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun document requis</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Section Salles de classe */}
      <Collapsible onOpenChange={handleClassroomsOpen}>
        <div className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center p-6"
            >
              <h2 className="text-xl font-semibold">Salles de classe</h2>
              {hasRequestedClassrooms ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-6 bg-card rounded-lg shadow">
              {isLoadingClassrooms ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : classroomsError ? (
                <p className="text-red-500">Erreur de chargement des salles</p>
              ) : classrooms?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classrooms.map((classroom) => (
                    <div
                      key={classroom.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{classroom.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Capacité : {classroom.capacity || 0} élèves
                        </p>
                      </div>
                      <Badge variant="outline">{classroom.classe.name}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune salle attribuée</p>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

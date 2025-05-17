"use client";

import { useDeleteClasse } from "@/lib/api/classes";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClasseForm from "@/components/classes/ClasseForm";
import { toast } from "sonner";
import Link from "next/link";

export default function ClasseActions({
  classe,
}: {
  classe: { id: number; name: string; parent?: number; cycle: number };
}) {
  const deleteClasse = useDeleteClasse();

  return (
    <div className="flex space-x-2">
      <Link href={`/admin/manage/classes/${classe.id}`}>
        <Button variant={"ghost"}>Afficher</Button>
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {classe.name}</DialogTitle>
          </DialogHeader>
          <ClasseForm
            initialData={classe}
            onSuccess={() => window.location.reload()}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Supprimer</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Voulez-vous vraiment supprimer cette classe ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Supprimer cette classe entraînera la suppression des classes
              enfants et toute autre relation avec cette classe. Cette action
              est irréversible !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteClasse.mutate(classe.id, {
                    onSuccess: () => toast.success("Classe supprimée !"),
                    onError: (err) => {
                      console.error("Erreur lors de la suppression !", err);
                      toast.error("Erreur lors de la suppression");
                    },
                  });
                }}
              >
                Supprimer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useDeleteFee, useFees } from "@/lib/api/fees";
import { Fee } from "@/types/fees";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import FeesForm from "./FeesForm";
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
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { useCallback, useState } from "react";

export default function FeeActions({ fee }: { fee: Fee }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { refetch } = useFees();
  const { mutateAsync: deleteFee } = useDeleteFee();

  const initialData = {
    id: fee.id,
    classe: fee.classe.id,
    feesType: fee.feesType.id,
    academicYear: fee.academicYear,
    amount: fee.amount,
    description: fee.description,
    dueDate: fee.dueDate?.toString(),
  };

  const handleDelete = useCallback(() => {
    toast.promise(deleteFee(fee.id), {
      success: () => {
        refetch();
        return "Frais supprimé avec succès";
      },
      loading: "Suppression en cours...",
      error: (error) => {
        return error.message || "Une erreur s'est produite";
      },
    });
  }, [deleteFee, fee.id, refetch]);

  return (
    <div className="flex space-x-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier</DialogTitle>
          </DialogHeader>
          <FeesForm
            initialData={initialData}
            onSuccess={() => {
              refetch();
              setIsDialogOpen(false);
            }}
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
              Voulez-vous vraiment supprimer ce frais ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Supprimer ce frais entraînera la suppression de toutes les
              informations associées. Cette action est irréversible !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

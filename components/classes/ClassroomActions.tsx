import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';
import ClassroomForm from './ClassroomForm';

export default function ClassroomActions({classe}: {classe: {id: number; name: string, classe: number}}){
  return (
    <div className='flex space-x-2 items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {classe.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <ClassroomForm initialData={classe}/>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Supprimer</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmez la suppression de cette salle.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
              <p>Supprimer cette salle de classe entrainera une suppression en cascade plus ou moins importante dans le reste de l&apos;application. <br />
              Cette action est irreversible.</p>
            </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                >
                  Oui, supprimer
                </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RequiredDocument } from "@/types/classes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useUploadDoc } from "@/lib/api/students";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function StudentUploadDoc({ doc }: { doc: RequiredDocument }) {
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File|null>(null)
  const {mutateAsync, isPending, isSuccess, data} = useUploadDoc()
  const handleDocumentUpload = useCallback(async () => {
    console.log("Submit")
    console.log(file)
    if(file == null){
      setError("Please submite file before")
      return;
    }
    const data = {
      doc_type_id: doc.id,
      file: file
    }
    try {
      await mutateAsync(data)
    } catch (error) {
      if(error instanceof AxiosError){
        if(error.status === 403){
          setError("Vous n'etes pas autorise a effectuer cette operation.")
        }
        if(Number(error.status) >= 400){
          setError(error.response?.data.detail || "Erreur. Mauvaise requete")
        }

        setError("Une erreur est survenue pendant la l'enregistrement de votre document.")
      }else{
        setError("Une erreur est survenue pendant la l'enregistrement de votre document.")
      }
    }
  }, [doc.id, file, mutateAsync])

  useEffect(() => {
    if(error){
      toast.error(error)
    }
  }, [error])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>Envoyer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Soumission de {`${doc.name}`}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>

          <div className="space-x-4">
            <Label htmlFor="doc-upload">
              Importez votre document au format img, jpg ou png
            </Label>
            <Input disabled={isPending} onChange={(e) => {
              console.log(e.target)
              if(e.target.files?.[0]){
                setFile(e.target.files[0])
              }else{
                setFile(null)
              }
            }} type="file" accept="image/*" id="doc-upload" />
            <Button disabled={isPending} onClick={() => handleDocumentUpload()}>
              {isPending && (
                <Loader2 className="h-8 w-8 animate-spin text-white"/>
              )} Envoyer
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

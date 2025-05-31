import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useMemo } from "react";
import { Info, Loader2 } from "lucide-react";
import {useState} from "react"
import { fetchData } from "@/lib/api/api-crud";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { AxiosError } from "axios";

const currentYear = new Date().getFullYear();
const schema = z.object({
  matricule: z.string().trim().min(1, "Matricule requis"),
  year: z.string()
  .regex(/^(19|20)\d{2}$/, "Veuillez saisir une annee valide"),
});

type FormValues = z.infer<typeof schema>;
type PaymentResult = {
  reference: string
  amount: number
  paidAt: string
  feeType: string
}

export const FeesCheckForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: useMemo(() => ({ matricule: "", year: "" }), []),
  });

  const [results, setResults] = useState<PaymentResult[]>([])
  const [loadingResults, setLoadinResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (values: FormValues) => {
    setError(null)
    setLoadinResults(true)
    setResults([])
    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const year = parseInt(values.year, 10)
      const query = new URLSearchParams({
        matricule: values.matricule,
        year: String(year)
      }).toString()

      const res = await fetchData<PaymentResult[]>(`/payments/by-matricule?${query}`)
      setResults(res)

    } catch (error) {
        console.error("Erreur:", error);
      if(error instanceof AxiosError){
        setError(error.message);
      }

      if(error instanceof Error){
        setError(error.message);
      }

      setError("Erreur inconnue")
    }finally{
      setLoadinResults(false)
    }
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="matricule"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="matricule">Matricule</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="matricule"
                    placeholder="EX12345"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="matricule-error"
                  />
                </FormControl>
                <FormMessage id="matricule-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="year">Année scolaire</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="year"
                    inputMode="numeric"
                    placeholder={`Ex: ${currentYear}`}
                    min={1900}
                    max={currentYear + 1}
                    aria-invalid={fieldState.invalid}
                    aria-describedby="year-error"
                  />
                </FormControl>
                <FormMessage id="year-error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={form.formState.isSubmitting || loadingResults}
          >
            {form.formState.isSubmitting || loadingResults ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {loadingResults ? "Recherche en cours..." : "Rechercher"}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant={"destructive"}>
          <Info className="h-4 w-4 mr-2" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Paiements trouvés :</h3>
          <ul className="space-y-2">
            {results.map((payment) => (
              <li
                key={payment.reference}
                className="border p-4 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p>
                    <strong>Référence :</strong>{" "}
                    <span className="text-indigo-600">{payment.reference}</span>
                  </p>
                  <p>
                    <strong>Montant :</strong> {payment.amount.toFixed(2)} XAF
                  </p>
                  <p>
                    <strong>Date de paiement :</strong>{" "}
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Type de frais :</strong> {payment.feeType}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <Link
                    href={`/payments/${payment.reference}`}
                    className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
                  >
                    Voir le reçu
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loadingResults && results.length === 0 && !error && (
        <div className="mt-4 text-gray-600">
          Aucun paiement trouvé pour ce matricule et cette année.
        </div>
      )}
    </>
  );
};

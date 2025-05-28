"use client";
import { FormValues } from "@/components/students/schemas";
import { LoginForm } from "@/components/students/LoginForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { FeesCheckForm } from "@/components/students/FeesCheckForm";
import { IdCheckForm } from "@/components/students/IdCheckForm";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "next-auth/react";

const LANGUAGES = [
  {
    code: "fr",
    labels: [
      { lang: "fr", label: "Français" },
      { lang: "en", label: "French" },
    ],
  },
  {
    code: "en",
    labels: [
      { lang: "fr", label: "Anglais" },
      { lang: "en", label: "English" },
    ],
  },
];

const TABS = ["inscription", "payment", "check", "id", "receipt"] as const;

const RegisterForm = dynamic(
  () => import("@/components/students/RegisterForm"),
  {
    loading: () => <Skeleton />,
    ssr: false,
  }
);

export default function HomePage() {
  const [lang, setLang] = useLocalStorage("lang", "fr");
  const [activeTab, setActiveTab] = useState("inscription");
  const [isNewStudent, setIsNewStudent] = useState(true);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formData, setFormData] = useState<FormValues | undefined>(undefined);


    const {data: session, status} = useSession()
    useEffect(() => {
      if(status!=="authenticated" || !session?.user){
        signOut({redirect: false})
      }
    }, [session?.user, status])

  useBeforeUnload(formIsDirty);

  const handleHashNavigation = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && TABS.includes(hash as (typeof TABS)[number])) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);
    return () => window.removeEventListener("hashchange", handleHashNavigation);
  }, [handleHashNavigation]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (activeTab === "inscription" && formIsDirty) {
        sessionStorage.setItem("unsavedForm", JSON.stringify(formData));
      }
      window.location.hash = newTab;
    },
    [activeTab, formIsDirty, formData]
  );

  const handleStudentTypeChange = useCallback(
    (value: string) => {
      if (formIsDirty) {
        sessionStorage.setItem("unsavedForm", JSON.stringify(formData));
      }
      setIsNewStudent(value === "new");
      setFormIsDirty(false);
    },
    [formIsDirty, formData]
  );

  useEffect(() => {
    // Restaurer les données au montage
    const saved = sessionStorage.getItem("unsavedForm");
    if (saved) {
      setFormData(JSON.parse(saved));
      setFormIsDirty(true);
    }
  }, []);

  return (
    <>
      <header className="bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md dark:shadow-none">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-3">
          {/* Logos */}
          <div className="flex items-center space-x-4">
            <Image
              width={50}
              height={50}
              src={"/assets/images/logos/icon.svg"}
              alt="App Logo"
              priority
            />
            <div className="w-40 h-12 relative">
              <Image
                src={"/assets/images/logos/text-only.webp"}
                alt="Smart Fees"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          {/* Nav */}
          <nav className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger
                className="min-w-[120px]"
                aria-label="Sélection de la langue"
              >
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((language) => {
                  return (
                    <SelectItem key={language.code} value={language.code}>
                      {
                        language.labels.find((label) => label.lang === lang)
                          ?.label
                      }
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  window.location.hash = "inscription";
                  setIsNewStudent(false);
                }}
              >
                Se Connecter
              </Button>
              <Button
                onClick={() => {
                  window.location.hash = "inscription";
                  setIsNewStudent(true);
                }}
              >
                S&lsquo;inscrire
              </Button>
            </div>
          </nav>
        </div>
        {/* Slogan ou hero */}
        <div className="text-center py-4 text-lg font-semibold bg-black/10">
          Simplifiez la gestion des frais scolaire
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto py-8">
        <Tabs
          defaultValue="inscription"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="w-full grid grid-cols-5 mb-4 border-b overflow-x-auto">
            <TabsTrigger value="inscription">Inscription</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="check">Suivi des frais</TabsTrigger>
            <TabsTrigger value="id">Matricule</TabsTrigger>
            <TabsTrigger value="receipt">Reçu</TabsTrigger>
          </TabsList>

          {/* Inscription */}
          <TabsContent value="inscription">
            <div className="p-4 rounded shadow grid sm:grid-cols-12 gap-6">
              <div className="flex flex-col items-center sm:col-span-2">
                <h2 className="text-xl font-bold mb-4">
                  {lang === "fr"
                    ? isNewStudent
                      ? "Nouveau eleve"
                      : "Ancien eleve"
                    : isNewStudent
                    ? "New student"
                    : "Returning student"}
                </h2>
                {/* Bouton pour basculer entre Nouveau et Ancien étudiant */}

                <RadioGroup
                  onValueChange={handleStudentTypeChange}
                  defaultValue={isNewStudent ? "new" : "old"}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="new" id="st-status-new" />
                    <Label htmlFor="st-status-new">
                      {lang === "fr" ? "Nouveau" : "New"}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="old" id="st-status-old" />
                    <Label htmlFor="st-status-old">
                      {lang === "fr" ? "Ancien" : "Returning"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="sm:col-span-10">
                {isNewStudent ? (
                  <div className="mx-auto">
                    <RegisterForm />
                  </div>
                ) : (
                  <div className="max-w-md mx-auto">
                    <LoginForm />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Paiement */}
          <TabsContent value="payment">
            <div className="p-4 rounded shadow grid gap-4">
              <h2 className="text-xl font-bold">
                {lang === "fr" ? "Paiement des frais" : "Fees payment"}
              </h2>
              <div className="flex flex-wrap gap-4">
                {/* Boutons de paiement */}
                {["mtn-momo", "orange-money", "express-union"].map(
                  (provider) => (
                    <Button key={provider} className="flex items-center gap-2">
                      <Image
                        src={`/assets/${provider}.png`}
                        alt={provider}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                      <span className="capitalize">
                        {provider.replace("-", " ")}
                      </span>
                    </Button>
                  )
                )}
              </div>
            </div>
          </TabsContent>

          {/* Suivi des frais */}
          <TabsContent value="check">
            <div className="p-4 rounded shadow flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">
                {lang === "fr" ? "Suivi des paiements" : "Payment tracking"}
              </h2>
              <div className="w-full max-w-xl">
                <FeesCheckForm />
              </div>
            </div>
          </TabsContent>

          {/* Matricule */}
          <TabsContent value="id">
            <div className="p-4 rounded shadow flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">
                {lang === "fr"
                  ? "Vérification de matricule"
                  : "Student ID Check"}
              </h2>
              <div className="w-full max-w-xl">
                <IdCheckForm />
              </div>
            </div>
          </TabsContent>

          {/* Reçu */}
          <TabsContent value="receipt">
            <div className="p-4 rounded shadow flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">
                {lang === "fr" ? "Reçu de paiement" : "Payment receipt"}
              </h2>
              <div className="w-full max-w-xl">
                <FeesCheckForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Pied de page */}
      <footer className="bg-slate-400 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between gap-4 text-sm">
          <div className="space-y-1">
            <p>📧 contact@smartfees.cm</p>
            <p>🏠 Rue 1.234, Yaoundé, Cameroun</p>
            <p>📞 +237 6 00 00 00 00</p>
          </div>
          <div className="text-center md:text-right">
            <p>
              © {new Date().getFullYear()} Smart Fees -{" "}
              {lang === "fr" ? "Tous droits réservés" : "All rights reserved"}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

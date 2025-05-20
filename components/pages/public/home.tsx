"use client";
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
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

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

const RegisterForm = dynamic(
  () => import("@/components/students/RegisterForm"),
  {
    loading: () => <p>Loading...</p>,
  }
);

export default function HomePage() {
  const [lang, setLang] = useLocalStorage("lang", "fr");
  const [activeTab, setActiveTab] = useState("inscription");
  const [isNewStudent, setIsNewStudent] = useState(true);

  return (
    <>
      <header className="bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md dark:shadow-none">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-3">
          {/* Logos */}
          <div className="flex items-center space-x-4">
            <Image
              width={50}
              src={"/assets/images/logos/icon.svg"}
              alt="App Logo"
              height={50}
            />
            <div className="w-40 h-12 relative">
              <Image
                src={"/assets/images/logos/text-only.webp"}
                alt="Smart Fees"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          {/* Nav */}
          <nav className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger aria-label="Sélection de la langue">
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
            <div className="flex space-x-2">
              <Button>Se Connecter</Button>
              <Button>S&lsquo;inscrire</Button>
            </div>
          </nav>
        </div>
        {/* Slogan ou hero */}
        <div className="text-center py-4 text-lg font-semibold">Slogan ici</div>
      </header>
      {/* Contenu principal */}
      <main className="flex-grow container mx-auto py-8">
        <Tabs
          defaultValue="inscription"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full grid grid-cols-5 mb-4 border-b overflow-x-scroll md:overflow-auto">
            <TabsTrigger value="inscription">Inscription</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="suivi">Suivi des frais</TabsTrigger>
            <TabsTrigger value="id">Matricule</TabsTrigger>
            <TabsTrigger value="receipt">Reçu</TabsTrigger>
          </TabsList>

          {/* Inscription */}
          <TabsContent value="inscription">
            <div className="p-4  rounded shadow grid sm:grid-cols-12">
              <div className="flex flex-col items-center sm:col-span-2">
                <h2 className="text-xl font-bold mb-4">
                  Inscription{" "}
                  {isNewStudent ? "(Nouveau étudiant)" : "(Ancien étudiant)"}
                </h2>
                {/* Bouton pour basculer entre Nouveau et Ancien étudiant */}
                <div className="mb-4">
                  <span className="mr-2">Vous êtes :</span>
                  <RadioGroup
                    onValueChange={(v) => {
                      if (v === "new") {
                        setIsNewStudent(true);
                      } else if (v === "old") {
                        setIsNewStudent(false);
                      } else {
                        setIsNewStudent(true);
                      }
                    }}
                    defaultValue={isNewStudent ? "new" : "old"}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="st-status-new" />
                      <Label htmlFor="st-status-new">Nouveau étudiant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="old" id="st-status-old" />
                      <Label htmlFor="st-status-old">Ancien étudiant</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="sm:col-span-10 flex items-start justify-center">
                {isNewStudent ? (
                  <div className="flex justify-center flex-col space-y-4">
                    <p>
                      Formulaire d&apos;inscription pour un nouveau étudiant...
                    </p>
                    <RegisterForm />
                  </div>
                ) : (
                  <div className="md:w-1/2">
                    <LoginForm/>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Paiement */}
          <TabsContent value="payment">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                Paiement des frais de scolarité
              </h2>
              <p className="mb-4">Sélectionnez votre mode de paiement :</p>
              <div className="flex space-x-4">
                {/* Boutons de paiement */}
                <Button>
                  <Image
                    src="/assets/mtn-momo.png"
                    alt="MTN MOMO"
                    width={40}
                    height={40}
                    objectFit="contain"
                  />
                  <span className="ml-2">MTN MOMO</span>
                </Button>
                <Button>
                  <Image
                    src="/assets/orange-money.png"
                    alt="Orange Money"
                    width={40}
                    height={40}
                    objectFit="contain"
                  />
                  <span className="ml-2">Orange Money</span>
                </Button>
                <Button>
                  <Image
                    src="/assets/express-union.png"
                    alt="Express Union"
                    width={40}
                    height={40}
                    objectFit="contain"
                  />
                  <span className="ml-2">Express Union</span>
                </Button>
              </div>
              {/* Formulaire de paiement */}
              <div className="mt-4">
                <p>Formulaire de paiement à intégrer ici...</p>
              </div>
            </div>
          </TabsContent>

          {/* Suivi des frais */}
          <TabsContent value="suivi">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Suivi de vos frais</h2>
              <p>Consultez ici l’historique de vos paiements et votre solde.</p>
              {/* Vous pouvez insérer ici un tableau ou une liste dynamique des transactions */}
              {/* <LoadingMessage message="Chargement des données..." /> */}
            </div>
          </TabsContent>

          {/* Matricule */}
          <TabsContent value="id">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Votre matricule</h2>
              <p>
                Votre matricule vous sera affiché ici après validation de votre
                inscription.
              </p>
              {/* Par exemple, on affiche le matricule récupéré depuis l'API */}
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="font-mono text-lg">
                  Matricule: <strong>SF-2025-00123</strong>
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Reçu */}
          <TabsContent value="receipt">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Impression du reçu</h2>
              <p>Générez et imprimez votre reçu de paiement.</p>
              {/* Bouton pour générer le reçu */}
              <Button className="mt-4" onClick={() => alert("Reçu généré !")}>
                Générer le reçu
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Pied de page */}
      <footer className="bg-slate-400 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-2 md:mb-0">
            <p>Contacts : email@example.com</p>
            <p>Adresse : 123 Rue Exemple, Ville</p>
            <p>Téléphone : +123456789</p>
          </div>
          <div>
            <p>
              &copy; {new Date().getFullYear()} Smart Fees. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

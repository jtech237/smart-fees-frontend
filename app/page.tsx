import HomePage from "@/components/pages/public/home";
import Head from "next/head";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Smart Fees - Accueil</title>
        <meta name="description" content="Smart Fees - Solutions de paiement" />
      </Head>
      <HomePage/>
    </div>
  );
}

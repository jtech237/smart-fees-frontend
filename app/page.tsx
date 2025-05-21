import HomePage from "@/components/pages/public/home";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" richColors/>
      <Head>
        <meta name="description" content="Smart Fees - Solutions de paiement" />
      </Head>
      <HomePage/>
    </div>
  );
}

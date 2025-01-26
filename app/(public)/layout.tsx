import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Smart Fees",
    description: "Smart Fees",
  };

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}

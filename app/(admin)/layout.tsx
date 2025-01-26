import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Smart Fees Admin",
    description: "Smart Fees Admin",
  };

export default function AdminLayout({
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

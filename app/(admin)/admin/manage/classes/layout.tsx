"use client"

import { PropsWithChildren, ReactNode } from "react";

export type ClassePageLayoutProps = Readonly<PropsWithChildren<{
  modal: ReactNode
}>>

export default function ClasseLayout({
  children,
  modal,
}: ClassePageLayoutProps){
  return <>
    {children}
    {modal}
  </>
}
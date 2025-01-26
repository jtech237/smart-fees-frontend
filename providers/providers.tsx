"use client"

import type {ThemeProviderProps} from "next-themes"

import React from "react"
import{ ThemeProvider as NextThemesProvider
} from "next-themes"
import { SessionProvider } from "next-auth/react";

export interface AppProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps
}

export function AppProviders({children, themeProps}: AppProvidersProps){
  return (<NextThemesProvider {...themeProps}>
    <SessionProvider>
      {children}
    </SessionProvider>
  </NextThemesProvider>)
}

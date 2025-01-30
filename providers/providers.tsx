"use client";

import type { ThemeProviderProps } from "next-themes";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface AppProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function AppProviders({ children, themeProps }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <NextThemesProvider {...themeProps}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}

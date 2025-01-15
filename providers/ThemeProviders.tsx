import { ThemeProvider as NextThemeProvider } from "next-themes";

export default function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NextThemeProvider attribute="class" enableSystem defaultTheme="dark">{children}</NextThemeProvider>;
}

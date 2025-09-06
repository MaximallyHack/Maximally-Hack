import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" 
      enableSystem={true}
      storageKey="maximally-hack-theme"
      disableTransitionOnChange={false}
      enableColorScheme={true}
      themes={['light', 'dark', 'system']}
    >
      {children}
    </NextThemesProvider>
  );
}

export { useTheme } from 'next-themes';
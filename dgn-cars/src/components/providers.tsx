"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { FavoritesProvider } from "./favorites";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <FavoritesProvider>
          {children}
          <Toaster position="bottom-center" toastOptions={{ className: "!rounded-md !font-sans" }} />
        </FavoritesProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

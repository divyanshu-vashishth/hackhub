import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { config } from "~/utils/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider>
            <WagmiProvider config={config}>
              <RainbowKitProvider>
                <Toaster />
                {children}
              </RainbowKitProvider>
            </WagmiProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

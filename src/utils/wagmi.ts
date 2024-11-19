"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Hackhub Wallet",
  projectId: "d8ed2ce3f9295e91b550aa49e1e6d0a3",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

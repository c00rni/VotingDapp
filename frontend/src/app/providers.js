"use client";
import { ChakraProvider, theme } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import {
  anvil,
  localhost,
  mainnet,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ,
  chains: [localhost],
  ssr: true,
});

const client = new QueryClient();

export function Providers({ children }) {
  return (
    <>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>
                <ChakraProvider>
                    {children}
                </ChakraProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
    </>
    );
}
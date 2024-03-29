// app/providers.jsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthUserProvider } from "../contexts/userContext";
import SplashScreen from "../components/SplashScreen";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const colors = {
  brand: {
    900: "#9d4edd",
    800: "#153e75",
    700: "#2a69ac",
  },
  dark: {
    900: "#012244",
    800: "#1a3b5a",
  },
};
const theme = extendTheme({ colors, config: { initialColorMode: "dark" } });

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthUserProvider>
        {process.env.NODE_ENV === "production" && <SplashScreen />}
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
        <ReactQueryDevtools />
      </AuthUserProvider>
    </QueryClientProvider>
  );
}

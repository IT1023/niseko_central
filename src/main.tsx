import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { NisekoStore } from "./app/store.ts";
import ContextProvider from "./context/ContextProvider.tsx";
import "./index.css";
import "./features/languages/i18n.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={NisekoStore}>
      <MantineProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>,
);

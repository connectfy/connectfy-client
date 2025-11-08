// import { StrictMode } from 'react'
import "./i18n.js";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "notistack";
import CloseButton from "./components/CloseButton/index.tsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <SnackbarProvider
            maxSnack={5}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            action={(snackbarKey) => <CloseButton snackbarKey={snackbarKey} />}
          >
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);

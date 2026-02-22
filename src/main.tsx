import "./i18n.js";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/context/ThemeContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { history } from "@/common/helpers/history.ts";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <HistoryRouter history={history as unknown as any}>
        <ThemeProvider>
          <Toaster
            toastOptions={{ duration: 4000 }}
            containerStyle={{ zIndex: 9999 }}
          />
          <App />
        </ThemeProvider>
      </HistoryRouter>
    </Provider>
  </GoogleOAuthProvider>,
);

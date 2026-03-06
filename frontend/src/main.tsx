import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router.tsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ToastContainer
          position="top-center"
          autoClose={500}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
          <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);

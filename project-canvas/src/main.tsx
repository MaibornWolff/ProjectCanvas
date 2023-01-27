import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { HashRouter } from "react-router-dom"
import "styles/index.css"
import { App } from "./App"
import { ThemeProvider } from "./ThemeProvider"
import "./samples/node-api"
import "./i18n/i18n"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
)

postMessage({ payload: "removeLoading" }, "*")

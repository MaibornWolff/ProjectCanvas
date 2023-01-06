import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import "styles/index.css"
import { App } from "./App"
import { ThemeProvider } from "./ThemeProvider"
import "./samples/node-api"
// eslint-disable-next-line import/order
import { NotificationsProvider } from "@mantine/notifications"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
)

postMessage({ payload: "removeLoading" }, "*")

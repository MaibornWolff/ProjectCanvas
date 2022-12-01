import React from "react"
import ReactDOM from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { App } from "./App"
import "./samples/node-api"
import "styles/index.css"
import { theme } from "../theme"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
)

postMessage({ payload: "removeLoading" }, "*")

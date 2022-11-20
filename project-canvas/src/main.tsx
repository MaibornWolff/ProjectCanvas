import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./samples/node-api"
import "styles/index.css"
import { MantineProvider } from "@mantine/core"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>
)

postMessage({ payload: "removeLoading" }, "*")

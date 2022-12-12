import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/layout"
import { Login } from "./components/login"
import { ProjectsView } from "./components/projects-view"

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="projectsview" element={<ProjectsView />} />
        </Route>
      </Routes>
    </div>
  )
}

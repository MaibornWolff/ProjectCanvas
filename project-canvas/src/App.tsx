import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/layout"
import { Login } from "./components/login"
import { ProjectsView } from "./components/projects-view"
import { BacklogView } from "./components/backlog-view"
import { StoryMapView } from "./components/StoryMapView"

export function App() {
  return (
    <Routes>
      <Route path="/" index element={<Login />} />
      <Route element={<Layout />}>
        <Route path="projectsview" element={<ProjectsView />} />
        <Route path="backlogview" element={<BacklogView />} />
        <Route path="storymapview" element={<StoryMapView />} />
      </Route>
    </Routes>
  )
}

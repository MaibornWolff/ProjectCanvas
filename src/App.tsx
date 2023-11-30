import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/layout"
import { Login } from "./components/Login"
import { ProjectsView } from "./components/ProjectsView"
import { BacklogView } from "./components/BacklogView"
import { EpicView } from "./components/EpicView"
import { StoryMapView } from "./components/StoryMapView"
import { StoryMapDashboard } from "./components/StoryMapView/StoryMapDashboard"

export function App() {
  return (
    <Routes>
      <Route path="/" index element={<Login />} />
      <Route element={<Layout />}>
        <Route path="projectsview" element={<ProjectsView />} />
          <Route path="backlogview" element={<BacklogView />} />
          <Route path="epicview" element={<EpicView />} />
        <Route path="storymapview">
          <Route index element={<StoryMapDashboard />} />
          <Route path=":storyMapId" element={<StoryMapView />} />
        </Route>
      </Route>
    </Routes>
  )
}

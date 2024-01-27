import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { Login } from "./components/Login";
import { ProjectsView } from "./components/ProjectsView";
import { BacklogView } from "./components/BacklogView";
import { EpicView } from "./components/EpicView";
import { StoryMapView } from "./components/StoryMapView";
import { StoryMapDashboard } from "./components/StoryMapView/StoryMapDashboard";
import { RouteNames } from "./route-names";

export function App() {
  return (
    <Routes>
      <Route path="/" index element={<Login />} />
      <Route element={<Layout />}>
        <Route path={RouteNames.PROJECTS_VIEW} element={<ProjectsView />} />
        <Route path={RouteNames.BACKLOG_VIEW} element={<BacklogView />} />
        <Route path={RouteNames.EPIC_VIEW} element={<EpicView />} />
        <Route path={RouteNames.STORY_MAP_VIEW}>
          <Route index element={<StoryMapDashboard />} />
          <Route path=":storyMapId" element={<StoryMapView />} />
        </Route>
      </Route>
    </Routes>
  );
}
